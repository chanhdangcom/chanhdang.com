import { Metadata } from "next";
import { OrderTrackingClient } from "@/features/shop/components/order-tracking-client";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng | Cửa Hàng Phụ Kiện",
  description: "Kiểm tra trạng thái đơn hàng bằng mã đơn và số điện thoại.",
};

export default function OrderTrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Tra cứu đơn hàng
        </h1>
        <p className="text-sm text-zinc-500">
          Nhập mã đơn hàng và số điện thoại để theo dõi trạng thái giao hàng.
        </p>
      </div>
      <OrderTrackingClient />
    </div>
  );
}
