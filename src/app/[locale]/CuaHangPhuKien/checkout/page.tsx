import { Metadata } from "next";
import { CheckoutPageClient } from "@/features/shop/components/checkout-page-client";

export const metadata: Metadata = {
  title: "Thanh toán | Cửa Hàng Phụ Kiện",
  description: "Hoàn tất đơn hàng và chọn phương thức thanh toán phù hợp.",
};

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Thanh toán</h1>
        <p className="text-sm text-zinc-500">
          Hoàn tất thông tin giao hàng và xác nhận đơn.
        </p>
      </div>
      <CheckoutPageClient />
    </div>
  );
}
