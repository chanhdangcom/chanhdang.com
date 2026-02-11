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
    .findOne({ _id: new ObjectId(id) })) as PlaylistDocument | null;
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
          .find({ _id: { $in: musicIds } })
          .toArray()
      : [];
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
