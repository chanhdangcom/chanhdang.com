import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getUserRole, getUserId } from "@/lib/auth-helpers";
import { normalizeDocument } from "@/lib/mongodb-helpers";

/**
 * API endpoint for users to create their own artist profile
 * Only authenticated users can create their own artist profile
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const role = await getUserRole(request);
    const userId = await getUserId(request);

    if (!role || role === "guest" || !userId) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để tạo profile ca sĩ" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.singer || !body.cover) {
      return NextResponse.json(
        { error: "Thiếu tên ca sĩ hoặc ảnh bìa" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Check if user already has an artist profile
    const existingProfile = await db.collection("singers").findOne({
      addedBy: userId,
    });

    if (existingProfile) {
      // Return existing profile instead of error - allow adding music to existing profile
      return NextResponse.json({
        success: true,
        singer: normalizeDocument(existingProfile),
        message: "Sử dụng profile ca sĩ hiện có",
        isExisting: true,
      });
    }

    // Check if singer name already exists
    const existingSinger = await db.collection("singers").findOne({
      singer: body.singer,
    });

    if (existingSinger) {
      return NextResponse.json(
        { error: "Tên ca sĩ này đã tồn tại" },
        { status: 400 }
      );
    }

    // Create artist profile
    const result = await db.collection("singers").insertOne({
      ...body,
      musics: [],
      addedBy: userId,
      isUserProfile: true, // Mark as user-created profile
      createdAt: new Date(),
    });

    // Fetch the newly created profile
    const newProfile = await db.collection("singers").findOne({
      _id: result.insertedId,
    });

    if (!newProfile) {
      return NextResponse.json(
        { error: "Đã tạo profile nhưng không tìm thấy" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      singer: normalizeDocument(newProfile),
      message: "Tạo profile ca sĩ thành công!",
    });
  } catch (error) {
    console.error("Error creating artist profile:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo profile ca sĩ" },
      { status: 500 }
    );
  }
}

