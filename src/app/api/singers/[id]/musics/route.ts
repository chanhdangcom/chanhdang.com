import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { normalizeMusic } from "@/lib/mongodb-helpers";

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

    const musics = Array.isArray(singer.musics) ? singer.musics : [];
    const normalized = musics.map((m: Record<string, unknown>) => normalizeMusic(m));
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

    const newMusic = {
      ...body,
      singer: singer.singer,
      createdAt: new Date(),
    };

    await db.collection("musics").insertOne(newMusic);
    await db.collection("singers").updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { musics: newMusic },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({ success: true, music: normalizeMusic(newMusic) });
  } catch (error) {
    console.error("Error adding music to singer:", error);
    return NextResponse.json(
      { error: "Failed to add music to singer" },
      { status: 500 }
    );
  }
}
