import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { getUserRole } from "@/lib/auth-helpers";
import { requireAdmin } from "@/lib/permissions";
import { validateProductInput } from "@/features/shop/validators";

const COLLECTION = "shop_products";

function buildFilter(slug: string) {
  if (ObjectId.isValid(slug)) {
    return { _id: new ObjectId(slug) };
  }
  return { slug };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const client = await clientPromise;
    const db = getShopDb(client);
    const product = await db.collection(COLLECTION).findOne(buildFilter(slug));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: normalizeDocument(product) });
  } catch (error) {
    console.error("[shop/products/[slug]:GET]", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { slug } = await context.params;
    const payload = await request.json();
    const validation = validateProductInput({ ...payload, slug: payload.slug ?? slug });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(" ") }, { status: 400 });
    }
    const client = await clientPromise;
    const db = getShopDb(client);
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      buildFilter(slug),
      { $set: { ...payload, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!result?.value) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: normalizeDocument(result.value) });
  } catch (error) {
    console.error("[shop/products/[slug]:PATCH]", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { slug } = await context.params;
    const client = await clientPromise;
    const db = getShopDb(client);
    const result = await db.collection(COLLECTION).deleteOne(buildFilter(slug));
    if (!result.deletedCount) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[shop/products/[slug]:DELETE]", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
