import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getUserId } from "@/lib/auth-helpers";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { isPremium: false, isPremiumCreator: false },
        { status: 200 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { isPremium: 1, isPremiumCreator: 1 } }
      );

    return NextResponse.json({
      isPremium: Boolean(user?.isPremium),
      isPremiumCreator: Boolean(user?.isPremiumCreator),
    });
  } catch (error) {
    console.error("[premium-status] Failed to get premium status", error);
    return NextResponse.json(
      { isPremium: false, isPremiumCreator: false },
      { status: 200 }
    );
  }
}

