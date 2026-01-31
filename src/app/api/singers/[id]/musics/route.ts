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

    let musics: Record<string, unknown>[] = [];
    if (musicIds.length > 0) {
      musics = await db
        .collection("musics")
        .find({ _id: { $in: musicIds } })
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
            $or: [
              { singerId: singer._id },
              { singer: singerRegex },
              { singer: singerName },
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
    const userId = await getUserId(request);
    if (role === "user" && singer.addedBy && singer.addedBy !== userId) {
      return NextResponse.json(
        { error: "Bạn chỉ có thể thêm bài hát vào profile ca sĩ của chính mình" },
        { status: 403 }
      );
    }

    const newMusic = {
      ...body,
      singer: singer.singer,
      singerId: singer._id,
      addedBy: userId || null,
      createdAt: new Date(),
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
