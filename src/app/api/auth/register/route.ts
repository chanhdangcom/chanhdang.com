import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db("musicdb");
    const existing = await db.collection("users").findOne({ username });
    if (existing) {
      return NextResponse.json(
        { error: "Tài khoản đã tồn tại" },
        { status: 400 }
      );
    }
    const hash = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({
      username,
      password: hash,
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
