import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { getUserId, getUserRole } from "@/lib/auth-helpers";
import { requireAdmin } from "@/lib/permissions";
import { calculateCartTotals } from "@/features/shop/utils";
import { validateOrderInput } from "@/features/shop/validators";

const COLLECTION = "shop_orders";
const CART_COLLECTION = "shop_carts";

function buildOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
}

export async function GET(request: Request) {
  try {
    const role = await getUserRole(request);
    const userId = await getUserId(request);
    if (!userId && !requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "1";
    const filter = all && requireAdmin(role) ? {} : { userId };

    const client = await clientPromise;
    const db = getShopDb(client);
    let orders = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    if (orders.length === 0) {
      const fallbackDb = client.db();
      if (fallbackDb.databaseName !== db.databaseName) {
        orders = await fallbackDb
          .collection(COLLECTION)
          .find(filter)
          .sort({ createdAt: -1 })
          .toArray();
      }
    }

    return NextResponse.json({ items: orders.map((doc) => normalizeDocument(doc)) });
  } catch (error) {
    console.error("[shop/orders:GET]", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const validation = validateOrderInput(payload);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(" ") }, { status: 400 });
    }

    const { items, shippingAddress, paymentMethod, discount = 0 } = payload;
    const totals = calculateCartTotals(items, discount);

    const order = {
      orderNumber: buildOrderNumber(),
      userId,
      items,
      status: "pending",
      shippingAddress,
      paymentMethod,
      subtotal: totals.subtotal,
      discount,
      total: totals.total,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [{ status: "pending", at: new Date(), note: "Đơn hàng được tạo" }],
    };

    const client = await clientPromise;
    const db = getShopDb(client);
    const result = await db.collection(COLLECTION).insertOne(order);

    await db.collection(CART_COLLECTION).deleteOne({ userId });

    return NextResponse.json({ success: true, orderId: String(result.insertedId) });
  } catch (error) {
    console.error("[shop/orders:POST]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
