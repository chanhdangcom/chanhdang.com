import { NextRequest, NextResponse } from "next/server";
import { vnpay, ProductCode, VnpLocale } from "@/lib/vnpay";
import { getMusicPlanConfig, resolveMusicPlan } from "@/lib/music-plans";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://chanhdang.com";

export async function POST(request: NextRequest) {
  if (!vnpay) {
    return NextResponse.json(
      { error: "VNPay chưa được cấu hình (VNP_TMN_CODE, VNP_HASH_SECRET)" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const locale = body.locale ?? "vi";
    const plan = resolveMusicPlan(body.plan);
    const planConfig = getMusicPlanConfig(plan);
    const returnUrl = `${APP_URL}/api/music/payment/vnpay/return?locale=${encodeURIComponent(locale)}&plan=${encodeURIComponent(plan)}`;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const txnRef = `MUSIC-${planConfig.orderCode}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: planConfig.amount,
      vnp_IpAddr: ip,
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan goi ${planConfig.orderLabel} thang - ${txnRef}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: returnUrl,
      vnp_Locale: VnpLocale.VN,
    });

    return NextResponse.json({
      paymentUrl,
      orderId: txnRef,
      amount: planConfig.amount,
      plan,
      message: "Quét mã QR hoặc mở link bằng app VNPay để thanh toán.",
    });
  } catch (err) {
    console.error("[VNPay] Create payment error:", err);
    return NextResponse.json(
      { error: "Không tạo được link thanh toán" },
      { status: 500 }
    );
  }
}
