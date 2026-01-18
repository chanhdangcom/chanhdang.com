import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { getUserRole } from "@/lib/auth-helpers";
import { requireAdmin } from "@/lib/permissions";
import { validateCouponInput } from "@/features/shop/validators";

const COLLECTION = "shop_coupons";

export async function GET(
  _request: Request,
  context: { params: { code: string } }
) {
  try {
    const code = context.params.code.toUpperCase();
    const client = await clientPromise;
    const db = getShopDb(client);
    const coupon = await db.collection(COLLECTION).findOne({ code });
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ coupon: normalizeDocument(coupon) });
  } catch (error) {
    console.error("[shop/coupons/[code]:GET]", error);
    return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: { code: string } }
) {
  try {
    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const code = context.params.code.toUpperCase();
    const payload = await request.json();
    const validation = validateCouponInput({ ...payload, code });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(" ") }, { status: 400 });
    }

    const client = await clientPromise;
    const db = getShopDb(client);
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { code },
      { $set: { ...payload, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!result?.value) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ coupon: normalizeDocument(result.value) });
  } catch (error) {
    console.error("[shop/coupons/[code]:PATCH]", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { code: string } }
) {
  try {
    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const code = context.params.code.toUpperCase();
    const client = await clientPromise;
    const db = getShopDb(client);
    const result = await db.collection(COLLECTION).deleteOne({ code });
    if (!result.deletedCount) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[shop/coupons/[code]:DELETE]", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
