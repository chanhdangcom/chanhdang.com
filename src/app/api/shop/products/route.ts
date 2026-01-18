import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { getUserRole } from "@/lib/auth-helpers";
import { requireAdmin } from "@/lib/permissions";
import { slugify } from "@/features/shop/utils";
import { validateProductInput } from "@/features/shop/validators";

const COLLECTION = "shop_products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 12), 1), 60);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { isActive: { $ne: false } };
    const andFilters: Array<Record<string, unknown>> = [];
    if (search) {
      andFilters.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $elemMatch: { $regex: search, $options: "i" } } },
        ],
      });
    }
    if (category) {
      andFilters.push({
        $or: [
          { categorySlug: category },
          ObjectId.isValid(category) ? { categoryId: category } : { categorySlug: category },
        ],
      });
    }
    if (andFilters.length) {
      filter.$and = andFilters;
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      popular: { reviewCount: -1 },
    };

    const client = await clientPromise;
    const db = getShopDb(client);
    const collection = db.collection(COLLECTION);

    const [items, total] = await Promise.all([
      collection
        .find(filter)
        .sort(sortMap[sort] || sortMap.newest)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return NextResponse.json({
      items: items.map((doc) => normalizeDocument(doc)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[shop/products:GET]", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const payload = await request.json();
    const slug = payload.slug ? String(payload.slug) : slugify(String(payload.name ?? ""));
    const normalizedPayload = {
      ...payload,
      slug,
      isActive: payload.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const validation = validateProductInput(normalizedPayload);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(" ") }, { status: 400 });
    }

    const client = await clientPromise;
    const db = getShopDb(client);
    const collection = db.collection(COLLECTION);

    const exists = await collection.findOne({ slug });
    if (exists) {
      normalizedPayload.slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const result = await collection.insertOne(normalizedPayload);
    return NextResponse.json({
      success: true,
      productId: String(result.insertedId),
    });
  } catch (error) {
    console.error("[shop/products:POST]", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
