import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Db, ObjectId } from "mongodb";
import { getCurrentUser, getUserRole } from "@/lib/auth-helpers";
import {
  normalizeObjectIds,
  normalizeMusic,
  normalizeDocument,
} from "@/lib/mongodb-helpers";
import { areUsersFriends } from "@/lib/social-graph";

type PlaylistDocument = {
  _id: ObjectId;
  title?: string;
  singer?: string;
  cover?: string;
  musicIds?: unknown[];
  musics?: unknown[];
  ownerId?: string;
  ownerName?: string;
  ownerAvatar?: string;
  isUserPlaylist?: boolean;
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
    .find(
      { _id: { $in: ids } },
      {
        projection: {
          title: 1,
          singer: 1,
          cover: 1,
          audio: 1,
          youtube: 1,
          content: 1,
          type: 1,
          topic: 1,
          srt: 1,
          beat: 1,
          createdAt: 1,
          playCount: 1,
        },
      }
    )
    .toArray();
  return found.map((m) => normalizeMusic(m as Record<string, unknown>));
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
    const ownerId = url.searchParams.get("ownerId");
    const requesterUserId = url.searchParams.get("userId")?.trim() || undefined;
    const lite = url.searchParams.get("lite") === "1";
    const limitParam = Number(url.searchParams.get("limit") ?? "0");
    const limit = Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(limitParam, 50)
      : 0;
    const role = await getUserRole(request);
    const currentUser = await getCurrentUser(request);

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

      const musicIds = Array.isArray(singer.musicIds)
        ? normalizeObjectIds(singer.musicIds)
        : [];
      let normalizedMusics = await resolveMusicsByIds(db, musicIds);

      if (normalizedMusics.length === 0) {
        const singerName = String(singer.singer ?? "").trim();
        if (singerName) {
          const singerRegex = new RegExp(
            `(^|,)\\s*${escapeRegex(singerName)}\\s*(,|$)`,
            "i"
          );
          const fallback = await db
            .collection("musics")
            .find({
              $or: [
                { singerId: singer._id },
                { singer: singerRegex },
                { singer: singerName },
              ],
            })
            .toArray();
          normalizedMusics = fallback.map((m) =>
            normalizeMusic(m as Record<string, unknown>)
          );
        }
      }
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
        musics: musics.map((m) => normalizeMusic(m as Record<string, unknown>)),
      };

      return NextResponse.json([playlist]);
    }

    if (ownerId && role !== "admin" && ownerId !== requesterUserId) {
      const ownerUser =
        ObjectId.isValid(ownerId)
          ? await db.collection("users").findOne({ _id: new ObjectId(ownerId) })
          : null;

      const canViewAsFriend =
        ownerUser && currentUser ? areUsersFriends(ownerUser, currentUser) : false;

      if (!canViewAsFriend) {
        return NextResponse.json(
          { error: "Bạn không có quyền xem playlist cá nhân của người khác" },
          { status: 403 }
        );
      }
    }

    const query: Record<string, unknown> = ownerId
      ? { ownerId }
      : {
          $or: [
            { isUserPlaylist: { $exists: false } },
            { isUserPlaylist: false },
          ],
        };

    const cursor = db.collection("playlists").find(
      query,
      {
        projection: lite
          ? {
              title: 1,
              singer: 1,
              cover: 1,
              musicIds: 1,
              ownerId: 1,
              ownerName: 1,
              ownerAvatar: 1,
              isUserPlaylist: 1,
              createdAt: 1,
              updatedAt: 1,
            }
          : undefined,
      }
    );
    if (limit > 0) {
      cursor.limit(limit);
    }
    const playlists = await cursor.toArray();

    if (lite) {
      const lightweight = (playlists as PlaylistDocument[]).map((playlist) => ({
        ...normalizeDocument(playlist),
        title: String(playlist.title ?? ""),
        singer: String(playlist.singer ?? ""),
        cover: String(playlist.cover ?? ""),
        ownerId: typeof playlist.ownerId === "string" ? playlist.ownerId : undefined,
        ownerName:
          typeof playlist.ownerName === "string" ? playlist.ownerName : undefined,
        ownerAvatar:
          typeof playlist.ownerAvatar === "string"
            ? playlist.ownerAvatar
            : undefined,
        isUserPlaylist: Boolean(playlist.isUserPlaylist),
      }));
      return NextResponse.json(lightweight);
    }

    const normalized = await Promise.all(
      (playlists as PlaylistDocument[]).map(async (playlist) => {
        const normalizedIds = Array.isArray(playlist.musicIds)
          ? normalizeObjectIds(playlist.musicIds)
          : Array.isArray(playlist.musics)
            ? parseLegacyMusicIds(playlist.musics)
            : [];
        const musics = await resolveMusicsByIds(db, normalizedIds);

        return {
          ...normalizeDocument(playlist),
          title: String(playlist.title ?? ""),
          singer: String(playlist.singer ?? ""),
          cover: String(playlist.cover ?? ""),
          ownerId: typeof playlist.ownerId === "string" ? playlist.ownerId : undefined,
          ownerName:
            typeof playlist.ownerName === "string" ? playlist.ownerName : undefined,
          ownerAvatar:
            typeof playlist.ownerAvatar === "string"
              ? playlist.ownerAvatar
              : undefined,
          isUserPlaylist: Boolean(playlist.isUserPlaylist),
          musicIds: normalizedIds.map((id) => id.toString()),
          musics,
        };
      })
    );

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching playlists:", error);
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
    const role = await getUserRole(request);
    const ownerId =
      typeof body.userId === "string" && body.userId.trim()
        ? body.userId.trim()
        : undefined;
    const isAdmin = role === "admin";

    if (!isAdmin && !ownerId) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để tạo playlist cá nhân" },
        { status: 401 }
      );
    }

    const payload =
      Array.isArray(body.musicIds) && body.musicIds.length > 0
        ? body.musicIds
        : Array.isArray(body.musics)
          ? body.musics
          : [];
    const musicIds = parseMusicIdsFromPayload(payload);

    const doc = {
      title: String(body.title),
      singer: String(
        body.singer ??
          body.ownerName ??
          (ownerId ? "Created by you" : "")
      ),
      cover: String(body.cover),
      musicIds,
      ownerId,
      ownerName:
        typeof body.ownerName === "string" ? String(body.ownerName) : undefined,
      ownerAvatar:
        typeof body.ownerAvatar === "string"
          ? String(body.ownerAvatar)
          : undefined,
      isUserPlaylist: !isAdmin && Boolean(ownerId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("playlists").insertOne(doc);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json(
      { error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}


