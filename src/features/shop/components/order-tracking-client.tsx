"use client";

import { useState } from "react";
import { OrderStatusBadge } from "./order-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Order } from "../types";

export function OrderTrackingClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(
        `/api/shop/orders/track?orderNumber=${encodeURIComponent(
          orderNumber
        )}&phone=${encodeURIComponent(phone)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không tìm thấy đơn hàng");
      }
      setOrder(data.order);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Tra cứu đơn hàng
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Nhập mã đơn hàng và số điện thoại để kiểm tra trạng thái.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Mã đơn hàng (ORD-xxxx)"
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
          />
          <Input
            placeholder="Số điện thoại"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
        <Button
          className="mt-4"
          onClick={handleSubmit}
          disabled={isLoading || !orderNumber || !phone}
        >
          {isLoading ? "Đang tra cứu..." : "Tra cứu"}
        </Button>
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {order && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-zinc-500">Mã đơn hàng</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {order.orderNumber}
                </p>
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
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Sản phẩm
            </h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              {order.items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex justify-between">
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Lộ trình đơn hàng
            </h3>
            <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {(order.timeline || []).map((step, index) => (
                <div key={`${step.status}-${index}`} className="flex justify-between">
                  <span>{step.status}</span>
                  <span>{new Date(step.at).toLocaleString("vi-VN")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
