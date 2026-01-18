import { Metadata } from "next";
import { OrderDetailClient } from "@/features/shop/components/order-detail-client";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng | Cửa Hàng Phụ Kiện",
  description: "Theo dõi trạng thái đơn hàng và lịch sử giao dịch.",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Đơn hàng
        </h1>
        <p className="text-sm text-zinc-500">
          Theo dõi trạng thái đơn hàng của bạn.
        </p>
      </div>
      <OrderDetailClient orderId={id} />
    </div>
  );
}
