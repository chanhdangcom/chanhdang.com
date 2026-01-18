import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { ObjectId } from "mongodb";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { ProductDetailClient } from "@/features/shop/components/product-detail-client";
import type { Product } from "@/features/shop/types";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const client = await clientPromise;
  const db = getShopDb(client);
  const id = decodeURIComponent(rawId);

  if (!ObjectId.isValid(id)) {
    return { title: "Sản phẩm không tồn tại" };
  }

  const product = await db
    .collection("shop_products")
    .findOne({ _id: new ObjectId(id) });

  if (!product) {
    return { title: "Sản phẩm không tồn tại" };
  }

  const title = product?.seo?.title || product?.name || "Chi tiết sản phẩm";
  const description =
    product?.seo?.description ||
    product?.shortDescription ||
    product?.description ||
    "";
  const image = product?.images?.[0]?.url || "/img/cover.jpg";

  return {
    title,
    description,
    openGraph: { title, description, images: [image] },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id: rawId, locale } = await params;
  const client = await clientPromise;
  const db = getShopDb(client);
  const id = decodeURIComponent(rawId);

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  const product = await db
    .collection("shop_products")
    .findOne({ _id: new ObjectId(id) });

  if (!product) {
    notFound();
  }

  // Get related products
  const related = product?.categorySlug
    ? await db
        .collection("shop_products")
        .find({
          categorySlug: product.categorySlug,
          _id: { $ne: product._id },
        })
        .limit(4)
        .toArray()
    : [];

  const normalized = normalizeDocument(product) as unknown as Product;
  const price = normalized.salePrice ?? normalized.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: normalized.name,
    description: normalized.description,
    image: normalized.images?.[0]?.url || "/img/cover.jpg",
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: price,
      availability:
        normalized.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <Link
          href={`/${locale}/CuaHangPhuKien`}
          className="hover:text-zinc-900 dark:hover:text-white"
        >
          Cửa hàng
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white">{normalized.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: Images & Specs */}
        <div className="space-y-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-zinc-200/60 bg-zinc-100/80 shadow-[0_30px_90px_-70px_rgba(0,0,0,0.6)] dark:border-zinc-800/60 dark:bg-zinc-900">
            <Image
              src={normalized.images?.[0]?.url || "/img/cover.jpg"}
              alt={normalized.images?.[0]?.alt || normalized.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Specs */}
          <div className="rounded-[24px] border border-zinc-200/70 bg-white/80 p-6 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/70">
            <h2 className="text-lg font-semibold">Thông số kỹ thuật</h2>
            <div className="mt-4 grid gap-3 text-sm text-zinc-600 dark:text-zinc-400 md:grid-cols-2">
              {(normalized.specs || []).length === 0 && (
                <p className="text-sm text-zinc-500">Chưa có thông số.</p>
              )}
              {(
                (normalized.specs || []) as Array<{
                  label: string;
                  value: string;
                }>
              ).map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between"
                >
                  <span>{spec.label}</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div className="space-y-5 rounded-[28px] border border-zinc-200/70 bg-white/80 p-7 shadow-[0_30px_90px_-70px_rgba(0,0,0,0.6)] backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/70">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Phụ kiện chính hãng
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-zinc-900 dark:text-white sm:text-4xl">
              {normalized.name}
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              {normalized.description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-zinc-900 dark:text-white">
                {price.toLocaleString("vi-VN")}₫
              </span>
              {normalized.salePrice && (
                <span className="text-sm text-zinc-500 line-through">
                  {normalized.price.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>

            {/* Benefits */}
            <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Giao hàng nhanh 2h nội thành</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Đổi trả trong 7 ngày nếu lỗi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Hỗ trợ tư vấn 24/7</span>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="rounded-[28px] border border-zinc-200/70 bg-white/80 p-6 shadow-[0_30px_90px_-70px_rgba(0,0,0,0.6)] backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/70">
            <ProductDetailClient product={normalized} />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="rounded-[28px] border border-zinc-200/70 bg-white/80 p-6 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/70">
        <h2 className="text-lg font-semibold">Đánh giá & nhận xét</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Tính năng đánh giá sẽ hiển thị khi có đơn hàng thành công.
        </p>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-xl font-semibold">Sản phẩm liên quan</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {related.map((item: Record<string, unknown>) => {
              const relatedProduct = normalizeDocument(
                item
              ) as unknown as Product;
              const relatedId = String(item._id);
              return (
                <Link
                  key={relatedId}
                  href={`/${locale}/CuaHangPhuKien/san-pham/${relatedId}`}
                  className="group rounded-3xl bg-white/80 p-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.55)] dark:bg-zinc-950/70"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                    <Image
                      src={relatedProduct.images?.[0]?.url || "/img/cover.jpg"}
                      alt={
                        relatedProduct.images?.[0]?.alt || relatedProduct.name
                      }
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {relatedProduct.name}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {(
                        relatedProduct.salePrice ?? relatedProduct.price
                      ).toLocaleString("vi-VN")}
                      ₫
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
