import { NextRequest, NextResponse } from "next/server";
import {
  createMomoPayment,
  isMomoConfigured,
} from "@/lib/momo";
import { getMusicPlanConfig, resolveMusicPlan } from "@/lib/music-plans";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://chanhdang.com";

export async function POST(request: NextRequest) {
  if (!isMomoConfigured()) {
    return NextResponse.json(
      {
        error: "Momo chưa được cấu hình (MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY)",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const locale = body.locale ?? "vi";
    const plan = resolveMusicPlan(body.plan);
    const planConfig = getMusicPlanConfig(plan);

    const orderId = `MUSIC-${planConfig.orderCode}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const redirectUrl = `${APP_URL}/${locale}/music/premium?success=1&gateway=momo&plan=${encodeURIComponent(plan)}`;
    const ipnUrl = `${APP_URL}/api/music/payment/momo/ipn`;

    const result = await createMomoPayment({
      orderId,
      amount: planConfig.amount,
      orderInfo: `Thanh toan goi ${planConfig.orderLabel} thang - ${orderId}`,
      redirectUrl,
      ipnUrl,
      lang: "vi",
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      payUrl: result.payUrl,
      orderId,
      requestId: result.requestId,
      amount: planConfig.amount,
      plan,
      message: "Mở link bằng app Momo hoặc quét mã QR để thanh toán.",
    });
  } catch (err) {
    console.error("[Momo] Create payment error:", err);
    return NextResponse.json(
      { error: "Không tạo được link thanh toán" },
      { status: 500 }
    );
  }
}
