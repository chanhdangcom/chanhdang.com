import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { normalizeDocument } from "@/lib/mongodb-helpers";

const COLLECTION = "shop_orders";

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { error: "Missing orderNumber or phone" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = getShopDb(client);
    const fallbackDb = client.db();
    let order = await db.collection(COLLECTION).findOne({ orderNumber });
    if (!order && fallbackDb.databaseName !== db.databaseName) {
      order = await fallbackDb
        .collection(COLLECTION)
        .findOne({ orderNumber });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderPhone = normalizePhone(
      String((order as { shippingAddress?: { phone?: string } }).shippingAddress?.phone ?? "")
    );
    if (normalizePhone(phone) !== orderPhone) {
      return NextResponse.json({ error: "Invalid order info" }, { status: 404 });
    }

    return NextResponse.json({ order: normalizeDocument(order) });
  } catch (error) {
    console.error("[shop/orders/track:GET]", error);
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    );
  }
}
