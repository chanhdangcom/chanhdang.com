"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";
import { fetchCart, updateCart } from "../api";
import type { Cart, CartItem } from "../types";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";

export function CartPageClient() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user || isLoading) return;
    fetchCart(user?.id)
      .then(setCart)
      .catch((err) => setError(err.message));
  }, [user, isLoading]);

  const items = cart?.items || [];
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const discount = cart?.discount || 0;
  const total = Math.max(subtotal - discount, 0);

  const handleUpdate = async (nextItems: CartItem[]) => {
    setIsSaving(true);
    try {
      const updated = await updateCart(nextItems, discount, user?.id);
      setCart(updated);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user && !isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Bạn cần đăng nhập để xem giỏ hàng.
        </p>
        <Button className="mt-4" onClick={() => router.push(`/${locale}/auth/login`)}>
          Đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-black">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Giỏ hàng của bạn đang trống.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push(`/${locale}/CuaHangPhuKien`)}
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          items.map((item, index) => (
            <CartItemRow
              key={`${item.productId}-${item.variant}-${index}`}
              item={item}
              onChange={(next) => {
                const nextItems = items.map((current) =>
                  current.productId === item.productId && current.variant === item.variant
                    ? next
                    : current
                );
                handleUpdate(nextItems);
              }}
              onRemove={() => {
                const nextItems = items.filter(
                  (current) =>
                    current.productId !== item.productId || current.variant !== item.variant
                );
                handleUpdate(nextItems);
              }}
            />
          ))
        )}
      </div>
      <CartSummary
        subtotal={subtotal}
        discount={discount}
        total={total}
        onCheckout={() => router.push(`/${locale}/CuaHangPhuKien/checkout`)}
      />
      {isSaving && (
        <p className="text-sm text-zinc-500">Đang cập nhật giỏ hàng...</p>
      )}
    </div>
  );
}
