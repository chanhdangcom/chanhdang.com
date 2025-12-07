import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import { IPlaylistItem } from "@/features/music/type/playlist";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { PlaylistDetailClient } from "@/features/music/playlist/playlist-detail-client";

type Props = {
  params: Promise<{ id: string }>;
};

async function getPlaylist(id: string): Promise<IPlaylistItem | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db("musicdb");
  const doc = await db
    .collection("playlists")
    .findOne({ _id: new ObjectId(id) });
  if (!doc) return null;

  const musics: IMusic[] = Array.isArray(doc.musics)
    ? doc.musics.map((music: Record<string, unknown>) => ({
        id:
          typeof music.id === "string"
            ? music.id
            : typeof music._id === "string"
              ? music._id
              : ((
                  music._id as { toString?: () => string } | undefined
                )?.toString?.() ?? ""),
        title: String(music.title ?? ""),
        singer: String(music.singer ?? ""),
        cover: String(music.cover ?? ""),
        audio: String(music.audio ?? ""),
        youtube: String(music.youtube ?? ""),
        content: String(music.content ?? ""),
        type: music.type ? String(music.type) : undefined,
        srt: music.srt ? String(music.srt) : undefined,
        beat: music.beat ? String(music.beat) : undefined,
      }))
    : [];

  return {
    id: typeof doc._id === "string" ? doc._id : (doc._id?.toString?.() ?? ""),
    title: String(doc.title ?? ""),
    singer: String(doc.singer ?? ""),
    cover: String(doc.cover ?? ""),
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
