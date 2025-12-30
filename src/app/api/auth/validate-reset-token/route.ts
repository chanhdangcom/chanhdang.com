import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    const user = await db.collection("users").findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    return NextResponse.json({ valid: !!user });
  } catch (error) {
    console.error("Validate reset token error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}

