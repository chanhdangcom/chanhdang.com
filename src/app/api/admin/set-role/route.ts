import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getUserRole, getUserId } from "@/lib/auth-helpers";
import { ObjectId } from "mongodb";

/**
 * API endpoint to set user role (admin only)
 * POST /api/admin/set-role
 * Body: { userId: string, role: "user" | "admin" }
 */
export async function POST(request: Request) {
  try {
    // Check if requester is admin
    const requesterRole = await getUserRole(request);
    if (requesterRole !== "admin") {
      return NextResponse.json(
        { error: "Chỉ admin mới có quyền thay đổi role" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Thiếu userId hoặc role" },
        { status: 400 }
      );
    }

    if (role !== "user" && role !== "admin") {
      return NextResponse.json(
        { error: "Role không hợp lệ. Chỉ có thể là 'user' hoặc 'admin'" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "UserId không hợp lệ" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Check if user exists
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { error: "User không tồn tại" },
        { status: 404 }
      );
    }

    // Update role
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          role,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật role của user thành ${role}`,
    });
  } catch (error) {
    console.error("Error setting user role:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật role" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/set-role - List all users with their roles
 */
export async function GET(request: Request) {
  try {
    // Check if requester is admin
    const requesterRole = await getUserRole(request);
    if (requesterRole !== "admin") {
      return NextResponse.json(
        { error: "Chỉ admin mới có quyền xem danh sách users" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } }) // Don't return passwords
      .toArray();

    const normalized = users.map((user) => ({
      id: String(user._id),
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      role: user.role || "user",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json({ success: true, users: normalized });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách users" },
      { status: 500 }
    );
  }
}

