import Image from "next/image";
import Link from "next/link";
import type { Product } from "../types";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
  product: Product;
  locale: string;
};

export function ProductCard({ product, locale }: ProductCardProps) {
  const price = product.salePrice ?? product.price;
  const productId = product.id || product._id;
  return (
    <div className="group flex h-full flex-col rounded-3xl border border-zinc-200/60 bg-white/80 p-5 shadow-[0_20px_60px_-45px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:border-zinc-300/80 hover:shadow-[0_30px_80px_-45px_rgba(0,0,0,0.55)] dark:border-zinc-800/60 dark:bg-zinc-950/70">
      <Link
        href={`/${locale}/CuaHangPhuKien/san-pham/${productId}`}
        className="block"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100/80 dark:bg-zinc-900">
          <Image
            src={product.images?.[0]?.url || "/img/cover.jpg"}
            alt={product.images?.[0]?.alt || product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        </div>
        <div className="mt-5 space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-white">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
            {product.shortDescription || product.description}
          </p>
        </div>
      </Link>
      <div className="mt-auto flex flex-col gap-3 pt-6">
        <div className="space-y-1">
          {product.salePrice ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-zinc-900 dark:text-white">
                {price.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-sm text-zinc-500 line-through">
                {product.price.toLocaleString("vi-VN")}₫
              </span>
            </div>
          ) : (
            <span className="text-xl font-semibold text-zinc-900 dark:text-white">
              {price.toLocaleString("vi-VN")}₫
            </span>
          )}
          <p className="text-xs text-zinc-500">
            Còn {product.stock ?? 0} sản phẩm
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-full border-zinc-200/80 bg-white/70 px-4 text-zinc-700 transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-200 dark:hover:border-white dark:hover:bg-white dark:hover:text-zinc-900 sm:w-auto sm:self-end"
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}
