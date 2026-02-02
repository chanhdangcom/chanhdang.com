"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchOrders } from "../api";
import type { Order, OrderStatus } from "../types";
import { useUser } from "@/hooks/use-user";
import { OrderStatusBadge } from "./order-status-badge";
import { Button } from "@/components/ui/button";

export function AccountPageClient() {
  const { user, logout, isLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";

  useEffect(() => {
    if (!user || isLoading) return;
    fetchOrders(user?.id)
      .then((data) => setOrders(data.items))
      .catch((err) => setError(err.message));
  }, [user, isLoading]);

  const orderStatusGroups = useMemo(() => {
    const statusOrder: Array<{ status: OrderStatus; label: string }> = [
      { status: "pending", label: "Chờ xác nhận" },
      { status: "paid", label: "Đã thanh toán" },
      { status: "processing", label: "Đang xử lý" },
      { status: "shipped", label: "Đang giao" },
      { status: "delivered", label: "Đã giao" },
      { status: "cancelled", label: "Đã hủy" },
      { status: "refunded", label: "Đã hoàn tiền" },
    ];

    const buckets = statusOrder.reduce<Record<OrderStatus, Order[]>>(
      (acc, item) => {
        acc[item.status] = [];
        return acc;
      },
      {} as Record<OrderStatus, Order[]>
    );

    orders.forEach((order) => {
      buckets[order.status]?.push(order);
    });

    return statusOrder.map((item) => ({
      ...item,
      items: buckets[item.status] ?? [],
    }));
  }, [orders]);

  if (!user && !isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Vui lòng đăng nhập để xem tài khoản.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push(`/${locale}/auth/login`)}
        >
          Đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-500">Xin chào</p>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              {user?.displayName || user?.username || "Khách hàng"}
            </h2>
            <p className="text-sm text-zinc-500">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={() => logout()}>
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Đơn hàng gần đây
        </h3>
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-black">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Bạn chưa có đơn hàng nào.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orderStatusGroups.some((group) => group.items.length > 0) ? (
              orderStatusGroups.map((group) => {
                if (group.items.length === 0) return null;
                return (
                  <div key={group.status} className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={group.status} />
                        <span className="text-sm text-zinc-500">
                          {group.items.length} đơn
                        </span>
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                        {group.label}
                      </span>
                    </div>
                    {group.items.map((order) => (
                      <div
                        key={order.id || order._id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
                      >
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-zinc-500">
                              {order.orderNumber}
                            </p>
                            <p className="text-base font-semibold text-zinc-900 dark:text-white">
                              {order.total.toLocaleString("vi-VN")}₫
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div
                                key={`${order.id || order._id}-${item.productId}-${index}`}
                                className="flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white/70 p-2 text-xs text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-300"
                              >
                                <img
                                  src={item.image || "/img/cover.jpg"}
                                  alt={item.productName || "Sản phẩm"}
                                  className="size-20 rounded-xl object-cover"
                                />
                                <span className="max-w-[160px] truncate">
                                  {item.productName || item.productId}
                                </span>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <span className="text-xs text-zinc-500">
                                +{order.items.length - 3} sản phẩm
                              </span>
                            )}
                          </div>
                        </div>
                        <OrderStatusBadge status={order.status} />
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(
                              `/${locale}/CuaHangPhuKien/orders/${order.id || order._id}`
                            )
                          }
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    ))}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
                Không có đơn hàng phù hợp với bộ lọc hiện tại.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
