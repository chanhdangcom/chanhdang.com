import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import { IPlaylistItem } from "@/features/music/type/playlist";
import { PlaylistDetailClient } from "@/features/music/playlist/playlist-detail-client";
import { normalizeMusic, normalizeObjectIds } from "@/lib/mongodb-helpers";

type PlaylistDocument = {
  _id: ObjectId;
  title?: string;
  singer?: string;
  cover?: string;
  musicIds?: unknown[];
  musics?: unknown[];
};

const playlistProjection = {
  title: 1,
  singer: 1,
  cover: 1,
  musicIds: 1,
  musics: 1,
} as const;

const musicProjection = {
  title: 1,
  singer: 1,
  cover: 1,
  audio: 1,
  youtube: 1,
  content: 1,
  type: 1,
  srt: 1,
  beat: 1,
  createdAt: 1,
} as const;

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

type Props = {
  params: Promise<{ id: string }>;
};

async function getPlaylist(id: string): Promise<IPlaylistItem | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db("musicdb");
  const doc = (await db
    .collection("playlists")
    .findOne({ _id: new ObjectId(id) }, { projection: playlistProjection })) as PlaylistDocument | null;
  if (!doc) return null;

  const musicIds = Array.isArray(doc.musicIds)
    ? normalizeObjectIds(doc.musicIds)
    : Array.isArray(doc.musics)
      ? parseLegacyMusicIds(doc.musics)
      : [];
  const musicDocs =
    musicIds.length > 0
      ? await db
          .collection("musics")
          .find({ _id: { $in: musicIds } }, { projection: musicProjection })
          .toArray()
      : [];

  // Keep display order stable based on playlist.musicIds
  if (musicIds.length > 0) {
    const order = new Map(musicIds.map((item, index) => [item.toString(), index]));
    musicDocs.sort((a, b) => {
      const aId = a._id?.toString?.() ?? "";
      const bId = b._id?.toString?.() ?? "";
      return (order.get(aId) ?? Number.MAX_SAFE_INTEGER) -
        (order.get(bId) ?? Number.MAX_SAFE_INTEGER);
    });
  }
  const musics = musicDocs.map((music) =>
    normalizeMusic(music as Record<string, unknown>)
  );

  return {
    id: typeof doc._id === "string" ? doc._id : (doc._id?.toString?.() ?? ""),
    title: String(doc.title ?? ""),
    singer: String(doc.singer ?? ""),
    cover: String(doc.cover ?? ""),
    musicIds: musicIds.map((item) => item.toString()),
    musics,
  };
}

export default async function PlaylistDetailPage({ params }: Props) {
  const { id } = await params;
  const playlist = await getPlaylist(id);

  if (!playlist) {
    notFound();
  }

  return <PlaylistDetailClient playlist={playlist} />;
}
