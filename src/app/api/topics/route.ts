import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { normalizeMusic, parseObjectIds } from "@/lib/mongodb-helpers";

interface CreateTopicBody {
  title: string;
  cover: string;
  musics?: string[];
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

    let musics: unknown[] = [];
    if (Array.isArray(body.musics) && body.musics.length > 0) {
      const ids = parseObjectIds(body.musics);
      if (ids.length > 0) {
        const found = await db
          .collection("musics")
          .find({ _id: { $in: ids } })
          .toArray();
        musics = found.map((m) => normalizeMusic(m as Record<string, unknown>));
      }
    }

    await db.collection("topics").insertOne({
      title: body.title,
      cover: body.cover,
      musics,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
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
    const topics = await db.collection("topics").find().toArray();
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}