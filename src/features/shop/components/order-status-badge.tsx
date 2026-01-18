import type { OrderStatus } from "../types";

const statusMap: Record<OrderStatus, { label: string; tone: string }> = {
  pending: { label: "Chờ xác nhận", tone: "bg-amber-100 text-amber-700" },
  paid: { label: "Đã thanh toán", tone: "bg-emerald-100 text-emerald-700" },
  processing: { label: "Đang xử lý", tone: "bg-blue-100 text-blue-700" },
  shipped: { label: "Đang giao", tone: "bg-purple-100 text-purple-700" },
  delivered: { label: "Đã giao", tone: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", tone: "bg-red-100 text-red-700" },
  refunded: { label: "Đã hoàn tiền", tone: "bg-zinc-200 text-zinc-700" },
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const meta = statusMap[status];
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.tone}`}>
      {meta.label}
    </span>
  );
}
