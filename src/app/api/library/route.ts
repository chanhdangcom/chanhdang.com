import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Db, ObjectId } from "mongodb";
import {
  normalizeDocument,
  normalizeMusic,
  normalizeObjectIds,
  parseObjectIds,
} from "@/lib/mongodb-helpers";

// API quản lý Library (bài hát & playlist đã lưu của user)
type LibraryDoc = {
  _id: ObjectId | string;
  userId: string;
  resourceId?: string;
  resourceType?: string;
  resourceData?: unknown;
  musicId?: string;
  musicData?: unknown;
  createdAt: Date;
};

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

const normalizeLibraryEntry = async (db: Db, entry: LibraryDoc) => {
  const resourceType = entry.resourceType ?? "music";
  const resourceId = entry.resourceId ?? entry.musicId;
  let resourceData = entry.resourceData ?? entry.musicData;

  if (resourceId && resourceType === "music" && ObjectId.isValid(resourceId)) {
    const music = await db.collection("musics").findOne({
      _id: new ObjectId(resourceId),
    });
    if (music) {
      resourceData = normalizeMusic(music as Record<string, unknown>);
    }
  }

  if (resourceId && resourceType === "playlist" && ObjectId.isValid(resourceId)) {
    const playlist = (await db.collection("playlists").findOne({
      _id: new ObjectId(resourceId),
    })) as PlaylistDocument | null;

    if (playlist) {
      const musicIds = Array.isArray(playlist.musicIds)
        ? normalizeObjectIds(playlist.musicIds)
        : Array.isArray(playlist.musics)
          ? parseLegacyMusicIds(playlist.musics)
          : [];
      const musicDocs =
        musicIds.length > 0
          ? await db
              .collection("musics")
              .find({ _id: { $in: musicIds } })
              .toArray()
          : [];
      resourceData = {
        ...normalizeDocument(playlist),
        title: String(playlist.title ?? ""),
        singer: String(playlist.singer ?? ""),
        cover: String(playlist.cover ?? ""),
        musicIds: musicIds.map((id) => id.toString()),
        musics: musicDocs.map((music) =>
          normalizeMusic(music as Record<string, unknown>)
        ),
      };
    }
  }

  return {
    _id: typeof entry._id === "string" ? entry._id : entry._id.toString(),
    userId: entry.userId,
    createdAt: entry.createdAt,
    resourceType,
    resourceId,
    resourceData,
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json({ error: "Thiếu userId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Lấy danh sách Library của user
    const query: Record<string, unknown> = { userId };
    if (type) {
      if (type === "music") {
        query.$or = [{ resourceType: "music" }, { resourceType: { $exists: false } }];
      } else {
        query.resourceType = type;
      }
    }

    const entries = (await db
      .collection("favorites")
      .find(query)
      .toArray()) as LibraryDoc[];

    const normalizedEntries = await Promise.all(
      entries.map((entry) => normalizeLibraryEntry(db, entry))
    );
    return NextResponse.json(normalizedEntries);
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch library entries" },
      { status: 500 }
    );
  }
}

// Thêm resource vào Library
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId;
    const resourceType = (body.resourceType ?? "music") as
      | "music"
      | "playlist";
    const resourceId = body.resourceId ?? body.musicId;
    const resourceData = body.data ?? body.musicData;

    if (!userId || !resourceId) {
      return NextResponse.json(
        { error: "Thiếu userId hoặc resourceId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const normalizedResourceId = String(resourceId);

    // Kiểm tra xem resource đã tồn tại chưa
    const existingEntryQuery: Record<string, unknown> = {
      userId,
      $or: [{ resourceId: normalizedResourceId }, { musicId: normalizedResourceId }],
    };
    if (resourceType === "music") {
      existingEntryQuery.$and = [
        {
          $or: [{ resourceType: "music" }, { resourceType: { $exists: false } }],
        },
      ];
    } else {
      existingEntryQuery.resourceType = resourceType;
    }

    const existingEntry = await db
      .collection("favorites")
      .findOne(existingEntryQuery);

    if (existingEntry) {
      return NextResponse.json(
        { error: "Đã có trong Library" },
        { status: 400 }
      );
    }

    const result = await db.collection("favorites").insertOne({
      userId,
      resourceId: normalizedResourceId,
      resourceType,
      // giữ tương thích cho dữ liệu cũ, nhưng không bắt buộc lưu object nhúng nữa
      resourceData: resourceData ?? undefined,
      // legacy fields để tương thích
      musicId: resourceType === "music" ? normalizedResourceId : undefined,
      musicData: resourceType === "music" ? resourceData : undefined,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to add library entry" },
      { status: 500 }
    );
  }
}

// Xóa resource khỏi Library
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const resourceType = searchParams.get("type") ?? "music";
    const resourceId =
      searchParams.get("resourceId") ?? searchParams.get("musicId");

    if (!userId || !resourceId) {
      return NextResponse.json(
        { error: "Thiếu userId hoặc resourceId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    const deleteQuery: Record<string, unknown> = {
      userId,
      $or: [{ resourceId }, { musicId: resourceId }],
    };
    if (resourceType === "music") {
      deleteQuery.$and = [
        {
          $or: [{ resourceType: "music" }, { resourceType: { $exists: false } }],
        },
      ];
    } else {
      deleteQuery.resourceType = resourceType;
    }

    const result = await db.collection("favorites").deleteOne(deleteQuery);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy trong Library" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to remove library entry" },
      { status: 500 }
    );
  }
}
