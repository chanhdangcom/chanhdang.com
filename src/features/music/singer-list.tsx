import { ISingerItem } from "./type/singer";
import { SingerListClient } from "./singler-list-client";
import clientPromise from "@/lib/mongodb";

type IProp = {
  home?: boolean;
  addPage?: boolean;
};

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
      musics: Array.isArray(item.musics) ? item.musics : undefined,
      createdAt: item.createdAt instanceof Date ? item.createdAt : undefined,
      updatedAt: item.updatedAt instanceof Date ? item.updatedAt : undefined,
    }));
  } catch (error) {
    console.error("Error fetching singers:", error);
    return [];
  }
}

export async function SingerList({ home, addPage }: IProp) {
  const singers = await getSingers();

  return <SingerListClient singers={singers} home={home} addPage={addPage} />;
}
