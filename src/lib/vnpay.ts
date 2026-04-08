import { VNPay, ProductCode, VnpLocale, HashAlgorithm } from "vnpay";
import { MUSIC_PLAN_CONFIG } from "./music-plans";

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

export const PREMIUM_AMOUNT_VND = MUSIC_PLAN_CONFIG.premium.amount;
export const PREMIUM_CREATOR_AMOUNT_VND = MUSIC_PLAN_CONFIG.creator.amount;
