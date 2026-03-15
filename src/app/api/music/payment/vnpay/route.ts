import { NextRequest, NextResponse } from "next/server";
import { vnpay, PREMIUM_AMOUNT_VND, ProductCode, VnpLocale } from "@/lib/vnpay";

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
    const returnUrl = `${APP_URL}/api/music/payment/vnpay/return?locale=${encodeURIComponent(locale)}`;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const txnRef = `MUSIC-PREM-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: PREMIUM_AMOUNT_VND,
      vnp_IpAddr: ip,
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan goi Music Premium thang - ${txnRef}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: returnUrl,
      vnp_Locale: VnpLocale.VN,
    });

    return NextResponse.json({
      paymentUrl,
      orderId: txnRef,
      amount: PREMIUM_AMOUNT_VND,
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
