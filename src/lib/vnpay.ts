import { VNPay, ProductCode, VnpLocale, HashAlgorithm } from "vnpay";

const tmnCode = process.env.VNP_TMN_CODE;
const secureSecret = process.env.VNP_HASH_SECRET;
const vnpayHost = process.env.VNP_URL ?? "https://sandbox.vnpayment.vn";

export const vnpay = (
  tmnCode && secureSecret
    ? new VNPay({
        tmnCode,
        secureSecret,
        vnpayHost,
        testMode: process.env.NODE_ENV !== "production",
        hashAlgorithm: HashAlgorithm.SHA512,
      })
    : null
) as VNPay | null;

export { ProductCode, VnpLocale };

export const PREMIUM_AMOUNT_VND = 29_000;
