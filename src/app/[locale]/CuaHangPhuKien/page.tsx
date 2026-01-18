import Link from "next/link";
import { Metadata } from "next";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { CategoryFilter } from "@/features/shop/components/category-filter";
import { ProductCard } from "@/features/shop/components/product-card";
import type { Category, Product } from "@/features/shop/types";

export const metadata: Metadata = {
  title: "Cửa Hàng Phụ Kiện Điện Thoại | Chánh Đang Store",
  description:
    "Mua phụ kiện điện thoại chính hãng: ốp lưng, sạc nhanh, tai nghe, kính cường lực với trải nghiệm mua sắm chuẩn quốc tế.",
  openGraph: {
    title: "Cửa Hàng Phụ Kiện Điện Thoại",
    description: "Trải nghiệm mua sắm phụ kiện điện thoại hiện đại, chuẩn SEO.",
    images: ["/img/cover.jpg"],
  },
};

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; search?: string }>;
}) {
  const { locale } = await params;
  const search = await searchParams;

  let categories: Record<string, unknown>[] = [];
  let products: Record<string, unknown>[] = [];

  try {
    const client = await clientPromise;
    const db = getShopDb(client);
    categories = await db
      .collection("shop_categories")
      .find({ isActive: { $ne: false } })
      .sort({ order: 1, name: 1 })
      .toArray();

    const filter: Record<string, unknown> = { isActive: { $ne: false } };
    if (search?.category) {
      filter.categorySlug = search.category;
    }
    if (search?.search) {
      filter.$or = [
        { name: { $regex: search.search, $options: "i" } },
        { description: { $regex: search.search, $options: "i" } },
      ];
    }
    products = await db
      .collection("shop_products")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(12)
      .toArray();
  } catch (error) {
    console.error("[CuaHangPhuKien:page]", error);
  }

  return (
    <div className="space-y-14">
      <section className="rounded-[32px] border border-zinc-200/60 bg-gradient-to-b from-white to-zinc-50 p-12 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.6)] dark:border-zinc-800/60 dark:from-zinc-950 dark:to-black">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
              <span className="rounded-full border border-zinc-200/70 px-3 py-1 dark:border-zinc-700/70">
                Premium
              </span>
              <span>Apple-grade experience</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
              Phụ kiện điện thoại tinh tế, trải nghiệm mua sắm đẳng cấp.
            </h1>
            <p className="max-w-xl text-base text-zinc-600 dark:text-zinc-400">
              Chuẩn hóa từ chọn lọc sản phẩm, tư vấn cá nhân hóa đến giao hàng
              siêu tốc. Mọi chi tiết đều gọn gàng, minh bạch và đáng tin cậy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/CuaHangPhuKien?category=op-lung`}
                className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm text-white shadow-lg shadow-zinc-900/20"
              >
                Mua ốp lưng
              </Link>
              <Link
                href={`/${locale}/CuaHangPhuKien?category=sac-nhanh`}
                className="rounded-full border border-zinc-200 px-6 py-2.5 text-sm text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-300"
              >
                Sạc nhanh
              </Link>
              <Link
                href={`/${locale}/CuaHangPhuKien?category=tai-nghe`}
                className="rounded-full border border-zinc-200 px-6 py-2.5 text-sm text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-300"
              >
                Tai nghe
              </Link>
            </div>
          </div>
          <div className="grid gap-4 rounded-[28px] border border-zinc-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/60">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Giao nhanh 2H",
                  desc: "Nội thành, theo dõi realtime.",
                },
                { title: "Đổi trả 7 ngày", desc: "Hỗ trợ nhanh, minh bạch." },
                { title: "Bảo hành chính hãng", desc: "Cam kết 100%." },
                { title: "Thanh toán an toàn", desc: "Đa kênh, bảo mật cao." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-black dark:text-zinc-400"
                >
                  <p className="text-base font-semibold text-zinc-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Insight
              </p>
              <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-white">
                {products.length} sản phẩm luôn sẵn sàng giao trong ngày
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-zinc-900 dark:text-white">
              Sản phẩm được yêu thích
            </h2>
            <p className="text-sm text-zinc-500">
              Tuyển chọn {products.length} phụ kiện đáng mua nhất hôm nay
            </p>
          </div>
          <CategoryFilter
            categories={categories.map(
              (doc) => normalizeDocument(doc) as unknown as Category
            )}
            active={search?.category ?? null}
            locale={locale}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={String(product._id)}
              product={normalizeDocument(product) as unknown as Product}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
