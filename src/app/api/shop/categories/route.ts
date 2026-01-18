import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { getUserRole } from "@/lib/auth-helpers";
import { requireAdmin } from "@/lib/permissions";
import { slugify } from "@/features/shop/utils";
import { validateCategoryInput } from "@/features/shop/validators";

const COLLECTION = "shop_categories";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = getShopDb(client);
    const categories = await db
      .collection(COLLECTION)
      .find({ isActive: { $ne: false } })
      .sort({ order: 1, name: 1 })
      .toArray();
    return NextResponse.json({ items: categories.map((doc) => normalizeDocument(doc)) });
  } catch (error) {
    console.error("[shop/categories:GET]", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
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

    const validation = validateCategoryInput(normalizedPayload);
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
    return NextResponse.json({ success: true, categoryId: String(result.insertedId) });
  } catch (error) {
    console.error("[shop/categories:POST]", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
