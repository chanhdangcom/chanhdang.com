import crypto from "crypto";

const PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
const ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
const SECRET_KEY = process.env.MOMO_SECRET_KEY;
const MOMO_URI =
  process.env.MOMO_URI ?? "https://test-payment.momo.vn/v2/gateway/api/create";

export const PREMIUM_AMOUNT_VND = 29_000;

export function isMomoConfigured() {
  return !!(PARTNER_CODE && ACCESS_KEY && SECRET_KEY);
}

function buildSignature(payload: Record<string, string>): string {
  const sortedKeys = Object.keys(payload).sort();
  const raw = sortedKeys
    .map((k) => `${k}=${payload[k]}`)
    .join("&");
  return crypto.createHmac("sha256", SECRET_KEY!).update(raw).digest("hex");
}

export async function createMomoPayment(params: {
  orderId: string;
  amount: number;
  orderInfo: string;
  redirectUrl: string;
  ipnUrl: string;
  lang?: "vi" | "en";
}): Promise<{ payUrl: string; requestId: string } | { error: string }> {
  if (!isMomoConfigured()) {
    return { error: "Momo chưa được cấu hình" };
  }

  const requestId = `${params.orderId}-${Date.now()}`;
  const payload: Record<string, string> = {
    partnerCode: PARTNER_CODE!,
    requestId,
    orderId: params.orderId,
    amount: String(params.amount),
    requestType: "captureWallet",
    orderInfo: params.orderInfo,
    redirectUrl: params.redirectUrl,
    ipnUrl: params.ipnUrl,
    lang: params.lang ?? "vi",
  };

  const signature = buildSignature(payload);
  const body = { ...payload, signature };

  try {
    const res = await fetch(MOMO_URI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as {
      resultCode?: number;
      payUrl?: string;
      message?: string;
    };
    if (data.resultCode === 0 && data.payUrl) {
      return { payUrl: data.payUrl, requestId };
    }
    return { error: data.message ?? "Momo không trả về link thanh toán" };
  } catch (err) {
    console.error("[Momo] Create payment error:", err);
    return { error: "Lỗi kết nối Momo" };
  }
}
