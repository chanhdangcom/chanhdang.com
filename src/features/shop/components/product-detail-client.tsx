"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Product } from "../types";
import { addToCart } from "../api";
import { useUser } from "@/hooks/use-user";

type ProductDetailClientProps = {
  product: Product;
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.options?.[0] ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const price = useMemo(() => product.salePrice ?? product.price, [product]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push(`/${locale}/auth/login`);
      return;
    }
    setIsSubmitting(true);
    try {
      await addToCart(
        {
        productId: product.id || product._id || "",
        productName: product.name,
        productSlug: product.slug,
        image: product.images?.[0]?.url,
        price,
        quantity,
        variant: selectedVariant,
        },
        user?.id
      );
      router.push(`/${locale}/CuaHangPhuKien/cart`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
        >
          -
        </Button>
        <span className="text-sm font-semibold">{quantity}</span>
        <Button variant="outline" onClick={() => setQuantity((prev) => prev + 1)}>
          +
        </Button>
      </div>
      {product.variants?.[0] && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {product.variants[0].name}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants[0].options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedVariant(option)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selectedVariant === option
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleAddToCart} disabled={isSubmitting}>
          {isSubmitting ? "Đang thêm..." : "Thêm vào giỏ"}
        </Button>
        <Button variant="outline" onClick={() => router.push(`/${locale}/CuaHangPhuKien/cart`)}>
          Xem giỏ hàng
        </Button>
      </div>
      {!user && (
        <p className="text-sm text-zinc-500">
          Vui lòng đăng nhập để đặt hàng và theo dõi đơn.
        </p>
      )}
    </div>
  );
}
