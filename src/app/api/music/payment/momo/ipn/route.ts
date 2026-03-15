import { NextRequest, NextResponse } from "next/server";

/**
 * Momo IPN (Instant Payment Notification): Momo gọi URL này sau khi thanh toán.
 * Xác thực chữ ký, cập nhật DB/trạng thái Premium cho user.
 * Hiện chỉ log; production: lưu orderId + userId và set premium.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: verify Momo signature, map orderId -> userId, set premium in DB
    console.log("[Momo IPN]", body);
    return NextResponse.json({ resultCode: 0, message: "OK" });
  } catch {
    return NextResponse.json(
      { resultCode: 1, message: "Error" },
      { status: 500 }
    );
  }
}
