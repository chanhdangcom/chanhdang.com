import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { normalizeMusic } from "@/lib/mongodb-helpers";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeObjectIds = (ids: unknown[]) =>
  ids
    .map((id) => {
      if (id instanceof ObjectId) return id;
      if (typeof id === "string" && ObjectId.isValid(id)) {
        return new ObjectId(id);
      }
      return null;
    })
    .filter((id): id is ObjectId => Boolean(id));

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const singer = await db.collection("singers").findOne({ _id: new ObjectId(id) });

    if (!singer) {
      return NextResponse.json({ error: "Singer not found" }, { status: 404 });
    }

    const musicIds = Array.isArray(singer.musicIds)
      ? normalizeObjectIds(singer.musicIds)
      : [];

    // Chỉ hiển thị bài đã duyệt trên trang ca sĩ (công khai)
    const publicFilter = {
      $or: [{ status: { $exists: false } }, { status: "approved" }],
    };

    let musics: Record<string, unknown>[] = [];
    if (musicIds.length > 0) {
      musics = await db
        .collection("musics")
        .find({
          _id: { $in: musicIds },
          ...publicFilter,
        })
        .toArray();
    } else {
      const singerName = String(singer.singer ?? "").trim();
      if (singerName) {
        const singerRegex = new RegExp(
          `(^|,)\\s*${escapeRegex(singerName)}\\s*(,|$)`,
          "i"
        );
        musics = await db
          .collection("musics")
          .find({
            $and: [
              {
                $or: [
                  { singerId: singer._id },
                  { singer: singerRegex },
                  { singer: singerName },
                ],
              },
              publicFilter,
            ],
          })
          .toArray();
      }
    }

    const normalized = musics.map((m: Record<string, unknown>) =>
      normalizeMusic(m)
    );
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching singer musics:", error);
    return NextResponse.json(
      { error: "Failed to fetch singer musics" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để thêm bài hát" },
        { status: 401 }
      );
    }

    // User thường: chặn chỉ khi isPremiumCreator === false (tương thích ngược: user cũ không có field vẫn được phép)
    if (role === "user") {
      const client = await clientPromise;
      const db = client.db("musicdb");
      const userDoc = await db.collection("users").findOne(
        { _id: new ObjectId(userId) },
        { projection: { isPremiumCreator: 1 } }
      );
      if (userDoc?.isPremiumCreator === false) {
        return NextResponse.json(
          {
            error:
              "Bạn cần nâng cấp lên gói Premium Creator để thêm bài hát vào kênh.",
          },
          { status: 403 }
        );
      }
    }

    const { id } = await context.params;
    const body = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    if (!body.title || !body.audio || !body.cover) {
      return NextResponse.json(
        { error: "Missing title, audio, or cover" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const singer = await db.collection("singers").findOne({ _id: new ObjectId(id) });

    if (!singer) {
      return NextResponse.json({ error: "Singer not found" }, { status: 404 });
    }

    // Check if user owns this singer profile (for regular users)
    // Admin can add to any singer
    if (role === "user" && singer.addedBy && singer.addedBy !== userId) {
      return NextResponse.json(
        { error: "Bạn chỉ có thể thêm bài hát vào profile ca sĩ của chính mình" },
        { status: 403 }
      );
    }

    // Người dùng thường: bài hát sẽ ở trạng thái chờ duyệt
    // Admin: bài hát được duyệt ngay lập tức
    const status = role === "admin" ? "approved" : "pending";

    const newMusic = {
      ...body,
      singer: singer.singer,
      singerId: singer._id,
      addedBy: userId || null,
      createdAt: new Date(),
      status,
      approvedAt: role === "admin" ? new Date() : null,
      approvedBy: role === "admin" && userId ? userId : null,
    };

    const insertResult = await db.collection("musics").insertOne(newMusic);
    await db.collection("singers").updateOne(
      { _id: new ObjectId(id) },
      {
        $addToSet: { musicIds: insertResult.insertedId },
        $set: { updatedAt: new Date() },
      }
    );

    const musicWithId = { ...newMusic, _id: insertResult.insertedId };
    return NextResponse.json({ success: true, music: normalizeMusic(musicWithId) });
  } catch (error) {
    console.error("Error adding music to singer:", error);
    return NextResponse.json(
      { error: "Failed to add music to singer" },
      { status: 500 }
    );
  }
}
