import { Metadata } from "next";
import { CartPageClient } from "@/features/shop/components/cart-page-client";

export const metadata: Metadata = {
  title: "Giỏ hàng | Cửa Hàng Phụ Kiện",
  description: "Quản lý giỏ hàng, cập nhật số lượng và tiến hành thanh toán.",
};

export default function CartPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Giỏ hàng</h1>
        <p className="text-sm text-zinc-500">Kiểm tra lại sản phẩm trước khi thanh toán.</p>
      </div>
      <CartPageClient />
    </div>
  );
}
