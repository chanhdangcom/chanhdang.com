"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckoutForm } from "./checkout-form";
import { CartSummary } from "./cart-summary";
import { createOrder, fetchCart } from "../api";
import type { Cart } from "../types";
import { useUser } from "@/hooks/use-user";

export function CheckoutPageClient() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || isLoading) return;
    fetchCart(user?.id)
      .then(setCart)
      .catch((err) => setError(err.message));
  }, [user, isLoading]);

  if (!user && !isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Bạn cần đăng nhập để thanh toán.
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Giỏ hàng trống, không thể thanh toán.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        <CheckoutForm
          isSubmitting={isSubmitting}
          onSubmit={async ({ shippingAddress, paymentMethod }) => {
            setIsSubmitting(true);
            try {
              const response = await createOrder(
                {
                  items: cart.items,
                  shippingAddress,
                  paymentMethod,
                  discount: cart.discount || 0,
                  total: cart.total,
                },
                user?.id
              );
              router.push(`/${locale}/CuaHangPhuKien/orders/${response.orderId}`);
            } catch (err) {
              setError((err as Error).message);
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      </div>
      <CartSummary
        subtotal={cart.subtotal}
        discount={cart.discount || 0}
        total={cart.total}
      />
    </div>
  );
}
