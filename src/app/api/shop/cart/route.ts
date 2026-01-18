import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getShopDb } from "@/lib/shop-db";
import { getUserId } from "@/lib/auth-helpers";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { calculateCartTotals } from "@/features/shop/utils";
import { validateCartItemInput } from "@/features/shop/validators";

const COLLECTION = "shop_carts";

async function getCartByUserId(userId: string) {
  const client = await clientPromise;
  const db = getShopDb(client);
  return db.collection(COLLECTION).findOne({ userId });
}

export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const cart = await getCartByUserId(userId);
    if (!cart) {
      return NextResponse.json({ items: [], subtotal: 0, total: 0 });
    }
    return NextResponse.json(normalizeDocument(cart));
  } catch (error) {
    console.error("[shop/cart:GET]", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const fallbackUserId =
      typeof payload?.userId === "string" ? payload.userId : null;
    const userId = (await getUserId(request)) ?? fallbackUserId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const validation = validateCartItemInput(payload);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(" ") }, { status: 400 });
    }

    const client = await clientPromise;
    const db = getShopDb(client);
    const collection = db.collection(COLLECTION);

    const cart = await collection.findOne({ userId });
    const items = cart?.items ?? [];
    const existingIndex = items.findIndex(
      (item: { productId?: string; variant?: string }) =>
        item.productId === payload.productId && item.variant === payload.variant
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += payload.quantity;
    } else {
      items.push(payload);
    }

    const totals = calculateCartTotals(items, cart?.discount ?? 0);
    const updated = await collection.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          items,
          subtotal: totals.subtotal,
          total: totals.total,
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    if (!updated || !updated.value) {
      return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
    }
    return NextResponse.json(normalizeDocument(updated.value));
  } catch (error) {
    console.error("[shop/cart:POST]", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const fallbackUserId =
      typeof payload?.userId === "string" ? payload.userId : null;
    const userId = (await getUserId(request)) ?? fallbackUserId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const items = Array.isArray(payload.items) ? payload.items : null;
    if (!items) {
      return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
    }

    const totals = calculateCartTotals(items, payload.discount ?? 0);
    const client = await clientPromise;
    const db = getShopDb(client);
    const collection = db.collection(COLLECTION);
    const updated = await collection.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          items,
          subtotal: totals.subtotal,
          discount: payload.discount ?? 0,
          total: totals.total,
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    if (!updated || !updated.value) {
      return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
    }
    return NextResponse.json(normalizeDocument(updated.value));
  } catch (error) {
    console.error("[shop/cart:PATCH]", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = getShopDb(client);
    await db.collection(COLLECTION).deleteOne({ userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[shop/cart:DELETE]", error);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
