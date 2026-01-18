import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { getUserRole } from "@/lib/auth-helpers";
import { requireAdmin } from "@/lib/permissions";
import { slugify } from "@/features/shop/utils";

const PRODUCTS_COLLECTION = "shop_products";
const CATEGORIES_COLLECTION = "shop_categories";

export async function POST(request: Request) {
  try {
    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = getShopDb(client);

    const existing = await db.collection(PRODUCTS_COLLECTION).countDocuments();
    if (existing > 0) {
      return NextResponse.json({ message: "Seed skipped, data exists." });
    }

    const categories = [
      { name: "Ốp lưng", slug: "op-lung", description: "Ốp lưng cao cấp", order: 1 },
      { name: "Sạc nhanh", slug: "sac-nhanh", description: "Sạc nhanh chuẩn quốc tế", order: 2 },
      { name: "Tai nghe", slug: "tai-nghe", description: "Tai nghe không dây", order: 3 },
      { name: "Cáp & Adapter", slug: "cap-adapter", description: "Cáp, adapter đa dụng", order: 4 },
      { name: "Kính cường lực", slug: "kinh-cuong-luc", description: "Bảo vệ màn hình", order: 5 },
    ].map((item) => ({
      ...item,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const categoryResult = await db.collection(CATEGORIES_COLLECTION).insertMany(categories);
    const categoryIds = Object.values(categoryResult.insertedIds).map((id) => String(id));

    const products = [
      {
        name: "Ốp lưng MagSafe Premium",
        description: "Ốp lưng chống sốc, hỗ trợ sạc MagSafe, thiết kế thanh lịch.",
        price: 390000,
        salePrice: 319000,
        stock: 120,
        tags: ["magsafe", "premium"],
        categorySlug: "op-lung",
        categoryId: categoryIds[0],
        imageUrl: "/img/shop-op-lung.svg",
      },
      {
        name: "Sạc nhanh 35W chuẩn PD",
        description: "Sạc nhanh chuẩn PD, tích hợp bảo vệ quá nhiệt.",
        price: 520000,
        salePrice: 459000,
        stock: 80,
        tags: ["pd", "charger"],
        categorySlug: "sac-nhanh",
        categoryId: categoryIds[1],
        imageUrl: "/img/shop-sac-nhanh.svg",
      },
      {
        name: "Tai nghe không dây AirFlow",
        description: "Chống ồn chủ động, pin 36 giờ, kết nối ổn định.",
        price: 1290000,
        salePrice: 1090000,
        stock: 60,
        tags: ["anc", "wireless"],
        categorySlug: "tai-nghe",
        categoryId: categoryIds[2],
        imageUrl: "/img/shop-tai-nghe.svg",
      },
      {
        name: "Cáp sạc bọc dù 2m",
        description: "Cáp sạc bọc dù chống đứt gãy, tương thích đa thiết bị.",
        price: 190000,
        salePrice: 159000,
        stock: 200,
        tags: ["cable", "durable"],
        categorySlug: "cap-adapter",
        categoryId: categoryIds[3],
        imageUrl: "/img/shop-cap-adapter.svg",
      },
      {
        name: "Kính cường lực 9H",
        description: "Kính cường lực 9H, chống trầy xước, dễ dán.",
        price: 150000,
        salePrice: 119000,
        stock: 150,
        tags: ["tempered-glass"],
        categorySlug: "kinh-cuong-luc",
        categoryId: categoryIds[4],
        imageUrl: "/img/shop-kinh-cuong-luc.svg",
      },
    ].map((product) => ({
      ...product,
      slug: slugify(product.name),
      images: [
        {
          url: product.imageUrl,
          alt: product.name,
        },
      ],
      variants: [
        { name: "Màu sắc", options: ["Đen", "Trắng", "Xanh"] },
      ],
      specs: [
        { label: "Bảo hành", value: "12 tháng" },
        { label: "Xuất xứ", value: "Chính hãng" },
      ],
      ratingAvg: 4.6,
      reviewCount: 120,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.collection(PRODUCTS_COLLECTION).insertMany(products);

    return NextResponse.json({ success: true, categories: categories.length, products: products.length });
  } catch (error) {
    console.error("[shop/seed:POST]", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
