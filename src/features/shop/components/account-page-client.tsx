"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchOrders } from "../api";
import type { Order } from "../types";
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

  if (!user && !isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Vui lòng đăng nhập để xem tài khoản.
        </p>
        <Button className="mt-4" onClick={() => router.push(`/${locale}/auth/login`)}>
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
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Đơn hàng gần đây</h3>
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
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id || order._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
              >
                <div>
                  <p className="text-sm text-zinc-500">{order.orderNumber}</p>
                  <p className="text-base font-semibold text-zinc-900 dark:text-white">
                    {order.total.toLocaleString("vi-VN")}₫
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${locale}/CuaHangPhuKien/orders/${order.id || order._id}`)}
                >
                  Xem chi tiết
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
