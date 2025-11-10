import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/playlists
// - No query: return stored playlists
// - ?genre=RAP (or any type): build a virtual playlist from musics.type
// - ?singerId=...: build a virtual playlist from a singer's musics
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const genre = url.searchParams.get("genre");
    const singerId = url.searchParams.get("singerId");

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Virtual playlist by singer
    if (singerId) {
      if (!ObjectId.isValid(singerId)) {
        return NextResponse.json(
          { error: "Invalid singerId" },
          { status: 400 }
        );
      }

      const singer = await db
        .collection("singers")
        .findOne({ _id: new ObjectId(singerId) });
      if (!singer) {
        return NextResponse.json(
          { error: "Singer not found" },
          { status: 404 }
        );
      }

      const musics = Array.isArray(singer.musics) ? singer.musics : [];
      const cover =
        typeof singer.cover === "string" && singer.cover
          ? singer.cover
          : musics[0]?.cover || "";

      const playlist = {
        id: String(singer._id),
        title: `Playlist • ${String(singer.singer ?? "Unknown")}`,
        singer: String(singer.singer ?? "Unknown"),
        cover,
        musics: musics.map((m: Record<string, unknown>) => ({
          id:
            typeof m.id === "string"
              ? m.id
              : typeof (m as { _id?: unknown })._id === "string"
                ? (m as { _id: string })._id
                : ((m as { _id?: { toString?: () => string } })._id?.toString() ??
                  ""),
          title: String(m.title ?? ""),
          singer: String(m.singer ?? ""),
          cover: String(m.cover ?? ""),
          audio: String(m.audio ?? ""),
          youtube: String(m.youtube ?? ""),
          content: String(m.content ?? ""),
          type: m.type ? String(m.type) : undefined,
          srt: m.srt ? String(m.srt) : undefined,
          beat: m.beat ? String(m.beat) : undefined,
        })),
      };

      return NextResponse.json([playlist]);
    }

    // Virtual playlist by genre/type
    if (genre) {
      const type = genre;
      const musics = await db
        .collection("musics")
        .find({ type })
        .toArray();

      const playlist = {
        id: `genre:${type}`,
        title: `Top ${type}`,
        singer: "Genre Mix",
        cover: musics[0]?.cover || "https://cdn.chanhdang.com/top50_global.jpg",
        musics: musics.map((m) => ({
          id:
            typeof m._id === "string" ? m._id : (m._id?.toString() ?? ""),
          title: String(m.title ?? ""),
          singer: String(m.singer ?? ""),
          cover: String(m.cover ?? ""),
          audio: String(m.audio ?? ""),
          youtube: String(m.youtube ?? ""),
          content: String(m.content ?? ""),
          type: m.type ? String(m.type) : undefined,
          srt: m.srt ? String(m.srt) : undefined,
          beat: m.beat ? String(m.beat) : undefined,
        })),
      };

      return NextResponse.json([playlist]);
    }

    // Stored playlists
    const playlists = await db.collection("playlists").find({}).toArray();
    const normalized = playlists.map((p) => {
      const musics = Array.isArray(p.musics) ? p.musics : [];
      return {
        id: typeof p._id === "string" ? p._id : (p._id?.toString() ?? ""),
        title: String(p.title ?? ""),
        singer: String(p.singer ?? ""),
        cover: String(p.cover ?? ""),
        musics: musics.map((m: Record<string, unknown>) => ({
          id:
            typeof m.id === "string"
              ? m.id
              : typeof (m as { _id?: unknown })._id === "string"
                ? (m as { _id: string })._id
                : ((m as { _id?: { toString?: () => string } })._id?.toString() ??
                  ""),
          title: String(m.title ?? ""),
          singer: String(m.singer ?? ""),
          cover: String(m.cover ?? ""),
          audio: String(m.audio ?? ""),
          youtube: String(m.youtube ?? ""),
          content: String(m.content ?? ""),
          type: m.type ? String(m.type) : undefined,
          srt: m.srt ? String(m.srt) : undefined,
          beat: m.beat ? String(m.beat) : undefined,
        })),
      };
    });

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

// POST /api/playlists
// body: { title, singer, cover, musicIds?: string[] }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.cover) {
      return NextResponse.json(
        { error: "Missing title or cover" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    let musics: unknown[] = [];
    if (Array.isArray(body.musicIds) && body.musicIds.length > 0) {
      const ids = body.musicIds
        .filter((id: unknown) => typeof id === "string" && ObjectId.isValid(id as string))
        .map((id: unknown) => new ObjectId(id as string));

      if (ids.length > 0) {
        const found = await db
          .collection("musics")
          .find({ _id: { $in: ids } })
          .toArray();
        musics = found.map((m) => ({
          id: typeof m._id === "string" ? m._id : (m._id?.toString() ?? ""),
          title: String(m.title ?? ""),
          singer: String(m.singer ?? ""),
          cover: String(m.cover ?? ""),
          audio: String(m.audio ?? ""),
          youtube: String(m.youtube ?? ""),
          content: String(m.content ?? ""),
          type: m.type ? String(m.type) : undefined,
          srt: m.srt ? String(m.srt) : undefined,
          beat: m.beat ? String(m.beat) : undefined,
        }));
      }
    }

    const doc = {
      title: String(body.title),
      singer: String(body.singer ?? ""),
      cover: String(body.cover),
      musics,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("playlists").insertOne(doc);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}


