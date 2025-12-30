import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Tên đăng nhập phải có ít nhất 3 ký tự" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 8 ký tự" },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Check if username already exists
    const existingUsername = await db
      .collection("users")
      .findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Tên đăng nhập đã được sử dụng" },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await db.collection("users").findOne({ email });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email đã được sử dụng" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Create user
    const result = await db.collection("users").insertOne({
      username,
      email: email || null,
      password: hash,
      displayName: username,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      userId: String(result.insertedId),
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Lỗi server. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

