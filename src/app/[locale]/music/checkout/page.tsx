import { CheckoutPage } from "@/features/music/checkout-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán | ChanhDang Music",
  description: "Thanh toán Music Premium qua Polar. An toàn, nhanh chóng.",
};

export default function Page() {
  return <CheckoutPage />;
}
