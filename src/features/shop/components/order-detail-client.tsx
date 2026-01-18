"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchOrder } from "../api";
import type { Order } from "../types";
import { OrderStatusBadge } from "./order-status-badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";

export function OrderDetailClient({ orderId }: { orderId: string }) {
  const { user, isLoading } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "vi";

  useEffect(() => {
    if (!user || isLoading) return;
    fetchOrder(orderId, user?.id)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message));
  }, [orderId, user, isLoading]);

  if (!user && !isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Vui lòng đăng nhập để xem đơn hàng.
        </p>
        <Button className="mt-4" onClick={() => router.push(`/${locale}/auth/login`)}>
          Đăng nhập
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-500">Mã đơn</p>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              {order.orderNumber}
            </h2>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Tổng thanh toán:{" "}
          <span className="font-semibold text-zinc-900 dark:text-white">
            {order.total.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Sản phẩm</h3>
        <div className="mt-4 space-y-3">
          {order.items.map((item, index) => (
            <div
              key={`${item.productId}-${index}`}
              className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400"
            >
              <span>
                {item.productName} x {item.quantity}
              </span>
              <span>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Địa chỉ giao hàng
          </h3>
          <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            <p>{order.shippingAddress.addressLine2}</p>
            <p>
              {order.shippingAddress.city} {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Lộ trình</h3>
          <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            {(order.timeline || []).map((step, index) => (
              <div key={`${step.status}-${index}`} className="flex items-center justify-between">
                <span>{step.status}</span>
                <span>{new Date(step.at).toLocaleString("vi-VN")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
