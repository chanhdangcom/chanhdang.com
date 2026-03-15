import { PremiumPage } from "@/features/music/premium-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nâng cấp Premium | ChanhDang Music",
  description:
    "Premium 29.000₫/tháng - Nghe nhạc không giới hạn, chất lượng cao. Thanh toán qua QR, thẻ.",
};

export default function Page() {
  return <PremiumPage />;
}
