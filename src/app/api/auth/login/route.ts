import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const client = await clientPromise;
    const db = client.db("musicdb");
    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Sai tài khoản hoặc mật khẩu" },
        { status: 400 }
      );
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { error: "Sai tài khoản hoặc mật khẩu" },
        { status: 400 }
      );
    }
    // Đơn giản: trả về user info (KHÔNG trả về password)
    return NextResponse.json({
      success: true,
      user: {
        id: String(user._id),
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
