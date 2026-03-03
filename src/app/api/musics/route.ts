import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { normalizeDocument } from "@/lib/mongodb-helpers";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const isRandom = url.searchParams.get("random");
    const limitParam = url.searchParams.get("limit");
    const sortParam = url.searchParams.get("sort");
    const statusParam = url.searchParams.get("status");

    const limit = Math.max(
      1,
      Math.min(100, Number.isFinite(Number(limitParam)) ? Number(limitParam) : 1)
    );

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Filter theo trạng thái:
    // - status=all    → lấy tất cả
    // - status=<name> → lọc theo trạng thái cụ thể
    // - mặc định      → chỉ lấy bài đã duyệt hoặc bài cũ chưa có status
    let filter: Record<string, unknown> = {};

    if (statusParam === "all") {
      filter = {};
    } else if (statusParam) {
      filter = { status: statusParam };
    } else {
      filter = {
        $or: [{ status: { $exists: false } }, { status: "approved" }],
      };
    }

    const musics = isRandom
      ? await db
          .collection("musics")
          .aggregate([
            { $match: filter },
            { $sample: { size: limit } },
          ])
          .toArray()
      : sortParam === "playCount"
        ? await db
            .collection("musics")
            .find(filter)
            .sort({ playCount: -1, updatedAt: -1 })
            .limit(limit)
            .toArray()
        : await db.collection("musics").find(filter).toArray();

    const normalized = musics.map((m) => normalizeDocument(m));
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching musics:", error);
    return NextResponse.json(
      { error: "Failed to fetch musics" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication and permissions
    const { getUserRole, getUserId } = await import("@/lib/auth-helpers");
    const role = await getUserRole(request);

    if (!role || (role !== "user" && role !== "admin")) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để thêm bài hát" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("musicdb");

    // Add userId to track who added the music
    const userId = await getUserId(request);

    // Người dùng thường: bài hát sẽ ở trạng thái chờ duyệt
    // Admin: bài hát được duyệt ngay lập tức
    const status = role === "admin" ? "approved" : "pending";

    const musicData = {
      ...body,
      addedBy: userId || null,
      createdAt: new Date(),
      status,
      approvedAt: role === "admin" ? new Date() : null,
      approvedBy: role === "admin" && userId ? userId : null,
    };

    const result = await db.collection("musics").insertOne(musicData);
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Error adding music:", error);
    return NextResponse.json(
      { error: "Failed to add music" },
      { status: 500 }
    );
  }
}
