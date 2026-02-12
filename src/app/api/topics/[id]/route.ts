import clientPromise from "@/lib/mongodb";
import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getUserRole } from "@/lib/auth-helpers";
import {
  normalizeDocument,
  normalizeMusic,
  normalizeObjectIds,
  parseObjectIds,
} from "@/lib/mongodb-helpers";

type TopicDocument = {
  _id: ObjectId;
  title?: string;
  cover?: string;
  musicIds?: unknown[];
  musics?: unknown[];
};

const parseLegacyMusicIds = (musics: unknown[] = []) =>
  normalizeObjectIds(
    musics
      .map((music) =>
        typeof music === "object" && music !== null
          ? ((music as { id?: unknown; _id?: unknown }).id ??
            (music as { _id?: unknown })._id)
          : null
      )
      .filter(Boolean)
  );

const normalizeTopic = async (db: Db, topic: TopicDocument) => {
  const normalizedIds = Array.isArray(topic.musicIds)
    ? normalizeObjectIds(topic.musicIds)
    : Array.isArray(topic.musics)
      ? parseLegacyMusicIds(topic.musics)
      : [];

  const musicDocs =
    normalizedIds.length > 0
      ? await db
          .collection("musics")
          .find({ _id: { $in: normalizedIds } })
          .toArray()
      : [];

  return {
    ...normalizeDocument(topic),
    title: String(topic.title ?? ""),
    cover: String(topic.cover ?? ""),
    musicIds: normalizedIds.map((id) => id.toString()),
    musics: musicDocs.map((music) => normalizeMusic(music as Record<string, unknown>)),
  };
};

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
    const topic = (await db
      .collection("topics")
      .findOne({ _id: new ObjectId(id) })) as TopicDocument | null;

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(await normalizeTopic(db, topic));
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const role = await getUserRole(request);
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Chỉ admin mới có quyền cập nhật topic" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("musicdb");

    const updateDoc: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.title === "string") updateDoc.title = body.title;
    if (typeof body.cover === "string") updateDoc.cover = body.cover;
    if (Array.isArray(body.musicIds)) {
      updateDoc.musicIds = parseObjectIds(body.musicIds);
    } else if (Array.isArray(body.musics)) {
      updateDoc.musicIds = parseLegacyMusicIds(body.musics);
    }

    await db.collection("topics").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const role = await getUserRole(request);
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Chỉ admin mới có quyền xóa topic" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const result = await db.collection("topics").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}