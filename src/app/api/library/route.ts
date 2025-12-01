import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// API quản lý Library (bài hát & playlist đã lưu của user)
type LibraryDoc = {
  _id: string;
  userId: string;
  resourceId?: string;
  resourceType?: string;
  resourceData?: unknown;
  musicId?: string;
  musicData?: unknown;
  createdAt: Date;
};

const normalizeLibraryEntry = (entry: LibraryDoc) => {
  const resourceType = entry.resourceType ?? "music";
  const resourceId = entry.resourceId ?? entry.musicId;
  const resourceData = entry.resourceData ?? entry.musicData;

  return {
    ...entry,
    resourceType,
    resourceId,
    resourceData,
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json({ error: "Thiếu userId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Lấy danh sách Library của user
    const query: Record<string, unknown> = { userId };
    if (type) {
      query.resourceType = type;
    }

    const entries = await db
      .collection("favorites")
      .find(query)
      .toArray();

    return NextResponse.json(
      entries.map((entry) =>
        normalizeLibraryEntry(entry as unknown as LibraryDoc)
      )
    );
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch library entries" },
      { status: 500 }
    );
  }
}

// Thêm resource vào Library
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId;
    const resourceType = (body.resourceType ?? "music") as
      | "music"
      | "playlist";
    const resourceId = body.resourceId ?? body.musicId;
    const resourceData = body.data ?? body.musicData;

    if (!userId || !resourceId || !resourceData) {
      return NextResponse.json(
        { error: "Thiếu userId, resourceId hoặc dữ liệu" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Kiểm tra xem resource đã tồn tại chưa
    const existingEntry = await db.collection("favorites").findOne({
      userId,
      resourceId,
      resourceType,
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Đã có trong Library" },
        { status: 400 }
      );
    }

    const result = await db.collection("favorites").insertOne({
      userId,
      resourceId,
      resourceType,
      resourceData,
      // legacy fields để tương thích
      musicId: resourceType === "music" ? resourceId : undefined,
      musicData: resourceType === "music" ? resourceData : undefined,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to add library entry" },
      { status: 500 }
    );
  }
}

// Xóa resource khỏi Library
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const resourceType = searchParams.get("type") ?? "music";
    const resourceId =
      searchParams.get("resourceId") ?? searchParams.get("musicId");

    if (!userId || !resourceId) {
      return NextResponse.json(
        { error: "Thiếu userId hoặc resourceId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    const result = await db.collection("favorites").deleteOne({
      userId,
      resourceId,
      resourceType,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy trong Library" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to remove library entry" },
      { status: 500 }
    );
  }
}
