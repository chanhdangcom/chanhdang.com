import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import {
  normalizeDocument,
  normalizeMusic,
  normalizeObjectIds,
  parseObjectIds,
} from "@/lib/mongodb-helpers";

type PlaylistDocument = {
  _id: ObjectId;
  title?: string;
  singer?: string;
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
    const doc = (await db
      .collection("playlists")
      .findOne({ _id: new ObjectId(id) })) as PlaylistDocument | null;

    if (!doc) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const musicIds = Array.isArray(doc.musicIds)
      ? normalizeObjectIds(doc.musicIds)
      : Array.isArray(doc.musics)
        ? parseLegacyMusicIds(doc.musics)
        : [];
    const musicDocs =
      musicIds.length > 0
        ? await db
            .collection("musics")
            .find({ _id: { $in: musicIds } })
            .toArray()
        : [];
    const normalized = {
      ...normalizeDocument(doc),
      title: String(doc.title ?? ""),
      singer: String(doc.singer ?? ""),
      cover: String(doc.cover ?? ""),
      musicIds: musicIds.map((item) => item.toString()),
      musics: musicDocs.map((music) => normalizeMusic(music as Record<string, unknown>)),
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
    if (Array.isArray(body.musicIds)) {
      updateDoc.musicIds = parseObjectIds(body.musicIds);
    } else if (Array.isArray(body.musics)) {
      updateDoc.musicIds = parseLegacyMusicIds(body.musics);
    }

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


