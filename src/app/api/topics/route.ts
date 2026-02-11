import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import {
  normalizeObjectIds,
  normalizeDocument,
  normalizeMusic,
} from "@/lib/mongodb-helpers";
import { Db, ObjectId } from "mongodb";

interface CreateTopicBody {
  title: string;
  cover: string;
  musics?: string[];
  musicIds?: string[];
}

type TopicDocument = {
  _id: ObjectId;
  title?: string;
  cover?: string;
  musicIds?: unknown[];
  musics?: unknown[];
  createdAt?: Date;
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

const parseMusicIdsFromPayload = (payload: unknown[] = []) => {
  const directIds = normalizeObjectIds(payload);
  if (directIds.length > 0) return directIds;
  return parseLegacyMusicIds(payload);
};

const resolveMusicsByIds = async (db: Db, ids: ObjectId[]) => {
  if (ids.length === 0) return [];
  const found = await db
    .collection("musics")
    .find({ _id: { $in: ids } })
    .toArray();
  return found.map((m) => normalizeMusic(m as Record<string, unknown>));
};

const normalizeTopic = async (db: Db, topic: TopicDocument) => {
  const normalizedIds = Array.isArray(topic.musicIds)
    ? normalizeObjectIds(topic.musicIds)
    : Array.isArray(topic.musics)
      ? parseLegacyMusicIds(topic.musics)
      : [];
  const musics = await resolveMusicsByIds(db, normalizedIds);

  return {
    ...normalizeDocument(topic),
    title: String(topic.title ?? ""),
    cover: String(topic.cover ?? ""),
    musicIds: normalizedIds.map((id) => id.toString()),
    musics,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateTopicBody;

    if (!body.title || !body.cover) {
      return NextResponse.json(
        { error: "Missing title or cover" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    const musicIdPayload =
      Array.isArray(body.musicIds) && body.musicIds.length > 0
        ? body.musicIds
        : Array.isArray(body.musics)
          ? body.musics
          : [];
    const musicIds = parseMusicIdsFromPayload(musicIdPayload);

    await db.collection("topics").insertOne({
      title: body.title,
      cover: body.cover,
      musicIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, musicsCount: musicIds.length });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const topics = (await db.collection("topics").find().toArray()) as TopicDocument[];
    const normalized = await Promise.all(topics.map((topic) => normalizeTopic(db, topic)));
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}