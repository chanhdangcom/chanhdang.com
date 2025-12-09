import { ISingerItem } from "./type/singer";
import { SingerListClient } from "./singler-list-client";
import clientPromise from "@/lib/mongodb";

async function getSingers(): Promise<ISingerItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const data = await db.collection("singers").find({}).toArray();

    return data.map((item) => ({
      id:
        typeof item._id === "string" ? item._id : (item._id?.toString() ?? ""),
      _id:
        typeof item._id === "string" ? item._id : (item._id?.toString() ?? ""),
      singer: String(item.singer ?? ""),
      cover: String(item.cover ?? ""),
      musics: Array.isArray(item.musics)
        ? item.musics.map((music: Record<string, unknown>) => ({
            id:
              typeof music.id === "string"
                ? music.id
                : typeof music._id === "string"
                  ? music._id
                  : (music._id?.toString() ?? ""),
            title: String(music.title ?? ""),
            singer: String(music.singer ?? ""),
            cover: String(music.cover ?? ""),
            audio: String(music.audio ?? ""),
            youtube: String(music.youtube ?? ""),
            content: String(music.content ?? ""),
            type: music.type ? String(music.type) : undefined,
          }))
        : undefined,
    }));
  } catch (error) {
    console.error("Error fetching singers:", error);
    return [];
  }
}

export async function SingerList() {
  const singers = await getSingers();

  return <SingerListClient singers={singers} />;
}
