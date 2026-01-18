import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { getUserId } from "@/lib/auth-helpers";

const COLLECTION = "shop_reviews";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = getShopDb(client);
    const reviews = await db
      .collection(COLLECTION)
      .find({ productId })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ items: reviews.map((doc) => normalizeDocument(doc)) });
  } catch (error) {
    console.error("[shop/reviews:GET]", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await request.json();
    if (!payload.productId || typeof payload.rating !== "number") {
      return NextResponse.json({ error: "Invalid review payload" }, { status: 400 });
    }
    const rating = Math.max(1, Math.min(5, payload.rating));
    const review = {
      productId: String(payload.productId),
      userId,
      rating,
      content: String(payload.content ?? ""),
      createdAt: new Date(),
    };
    const client = await clientPromise;
    const db = getShopDb(client);
    const result = await db.collection(COLLECTION).insertOne(review);
    return NextResponse.json({ success: true, reviewId: String(result.insertedId) });
  } catch (error) {
    console.error("[shop/reviews:POST]", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
