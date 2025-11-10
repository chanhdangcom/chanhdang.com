import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const normalizeEmbeddedMusic = (music: Record<string, unknown>) => {
  const idFromDoc = (() => {
    if (typeof music.id === "string") return music.id;
    const raw = (music as { _id?: unknown })._id;
    if (typeof raw === "string") return raw;
    if (raw && typeof (raw as { toString: () => string }).toString === "function") {
      return (raw as { toString: () => string }).toString();
    }
    return "";
  })();

  return {
    id: idFromDoc,
    title: String(music.title ?? ""),
    singer: String(music.singer ?? ""),
    cover: String(music.cover ?? ""),
    audio: String(music.audio ?? ""),
    youtube: String(music.youtube ?? ""),
    content: String(music.content ?? ""),
    type: music.type ? String(music.type) : undefined,
    srt: music.srt ? String(music.srt) : undefined,
    beat: music.beat ? String(music.beat) : undefined,
  };
};

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
      const normalizedMusics = musics.map((m: Record<string, unknown>) =>
        normalizeEmbeddedMusic(m)
      );
      const cover =
        typeof singer.cover === "string" && singer.cover
          ? singer.cover
          : normalizedMusics[0]?.cover || "https://cdn.chanhdang.com/top50_global.jpg";

      const playlist = {
        id: String(singer._id),
        title: `Playlist • ${String(singer.singer ?? "Unknown")}`,
        singer: String(singer.singer ?? "Unknown"),
        cover,
        musics: normalizedMusics,
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
        musics: musics.map((m) =>
          normalizeEmbeddedMusic(m as unknown as Record<string, unknown>)
        ),
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
        musics: musics.map((m: Record<string, unknown>) =>
          normalizeEmbeddedMusic(m)
        ),
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
        musics = found.map((m) =>
          normalizeEmbeddedMusic(m as unknown as Record<string, unknown>)
        );
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


