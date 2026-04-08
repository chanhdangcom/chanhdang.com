import { NextRequest, NextResponse } from "next/server";
import type { ReturnQueryFromVNPay } from "vnpay";
import { vnpay } from "@/lib/vnpay";
import { resolveMusicPlan } from "@/lib/music-plans";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://chanhdang.com";

export async function GET(request: NextRequest) {
  if (!vnpay) {
    return NextResponse.redirect(
      `${APP_URL}/vi/music/premium?error=vnpay_not_configured`,
      302
    );
  }

  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries()) as unknown as ReturnQueryFromVNPay;

  try {
    const verify = vnpay.verifyReturnUrl(query);

    if (!verify.isVerified) {
      return NextResponse.redirect(
        `${APP_URL}/vi/music/premium?error=invalid_signature`,
        302
      );
    }

    if (!verify.isSuccess) {
      return NextResponse.redirect(
        `${APP_URL}/vi/music/premium?error=payment_failed`,
        302
      );
    }

    const locale = searchParams.get("locale") ?? "vi";
    const plan = resolveMusicPlan(searchParams.get("plan"));
    return NextResponse.redirect(
      `${APP_URL}/${locale}/music/premium?success=1&gateway=vnpay&plan=${plan}`,
      302
    );
  } catch {
    return NextResponse.redirect(
      `${APP_URL}/vi/music/premium?error=invalid_data`,
      302
    );
  }
}
