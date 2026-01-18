import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { getUserRole } from "@/lib/auth-helpers";
import { requireAdmin } from "@/lib/permissions";
import { validateCouponInput } from "@/features/shop/validators";

const COLLECTION = "shop_coupons";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const client = await clientPromise;
    const db = getShopDb(client);

    if (code) {
      const coupon = await db.collection(COLLECTION).findOne({ code: code.toUpperCase() });
      if (!coupon) {
        return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
      }
      return NextResponse.json({ coupon: normalizeDocument(coupon) });
    }

    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const coupons = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ items: coupons.map((doc) => normalizeDocument(doc)) });
  } catch (error) {
    console.error("[shop/coupons:GET]", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const payload = await request.json();
    const normalizedPayload = {
      ...payload,
      code: String(payload.code ?? "").toUpperCase(),
      active: payload.active !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const validation = validateCouponInput(normalizedPayload);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(" ") }, { status: 400 });
    }

    const client = await clientPromise;
    const db = getShopDb(client);
    const existing = await db.collection(COLLECTION).findOne({ code: normalizedPayload.code });
    if (existing) {
      return NextResponse.json({ error: "Coupon already exists" }, { status: 400 });
    }

    const result = await db.collection(COLLECTION).insertOne(normalizedPayload);
    return NextResponse.json({ success: true, couponId: String(result.insertedId) });
  } catch (error) {
    console.error("[shop/coupons:POST]", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
