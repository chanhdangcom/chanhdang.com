import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { normalizeDocument, normalizeMusic } from "@/lib/mongodb-helpers";

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
    const doc = await db.collection("playlists").findOne({ _id: new ObjectId(id) });

    if (!doc) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const musics = Array.isArray(doc.musics) ? doc.musics : [];
    const normalized = {
      ...normalizeDocument(doc),
      title: String(doc.title ?? ""),
      singer: String(doc.singer ?? ""),
      cover: String(doc.cover ?? ""),
      musics: musics.map((m: Record<string, unknown>) => normalizeMusic(m)),
    };

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlist" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("musicdb");

    const updateDoc: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.title === "string") updateDoc.title = body.title;
    if (typeof body.singer === "string") updateDoc.singer = body.singer;
    if (typeof body.cover === "string") updateDoc.cover = body.cover;
    if (Array.isArray(body.musics)) updateDoc.musics = body.musics;

    await db.collection("playlists").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating playlist:", error);
    return NextResponse.json(
      { error: "Failed to update playlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const result = await db.collection("playlists").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return NextResponse.json(
      { error: "Failed to delete playlist" },
      { status: 500 }
    );
  }
}


