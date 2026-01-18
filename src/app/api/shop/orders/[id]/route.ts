import { NextResponse } from "next/server";
import { ObjectId, type Document, type UpdateFilter } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { getUserId, getUserRole } from "@/lib/auth-helpers";
import { requireAdmin } from "@/lib/permissions";

const COLLECTION = "shop_orders";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId(request);
    const role = await getUserRole(request);
    const { id } = await context.params;

    const client = await clientPromise;
    const db = getShopDb(client);
    const fallbackDb = client.db();
    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { orderNumber: id };

    let order = await db.collection(COLLECTION).findOne(query);
    if (!order && fallbackDb.databaseName !== db.databaseName) {
      order = await fallbackDb.collection(COLLECTION).findOne(query);
    }
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (!requireAdmin(role) && order.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ order: normalizeDocument(order) });
  } catch (error) {
    console.error("[shop/orders/[id]:GET]", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await context.params;
    const isObjectId = ObjectId.isValid(id);
    const payload = await request.json();
    const updates: Record<string, unknown> = {};
    if (payload.status) {
      updates.status = payload.status;
    }
    if (payload.shippingAddress) {
      updates.shippingAddress = payload.shippingAddress;
    }
    updates.updatedAt = new Date();

    const client = await clientPromise;
    const db = getShopDb(client);
    const update: {
      $set: Record<string, unknown>;
      $push?: { timeline: { status: string; at: Date; note?: string } };
    } = { $set: updates };
    if (payload.status) {
      update.$push = {
        timeline: { status: payload.status, at: new Date(), note: payload.note },
      };
    }

    const result = await db.collection(COLLECTION).findOneAndUpdate(
      isObjectId ? { _id: new ObjectId(id) } : { orderNumber: id },
      update as unknown as UpdateFilter<Document>,
      { returnDocument: "after" }
    );

    if (!result?.value) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order: normalizeDocument(result.value) });
  } catch (error) {
    console.error("[shop/orders/[id]:PATCH]", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
