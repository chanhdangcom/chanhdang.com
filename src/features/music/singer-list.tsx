import { ISingerItem } from "./type/singer";
import { SingerListClient } from "./singler-list-client";
import clientPromise from "@/lib/mongodb";

async function getSingers(): Promise<ISingerItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const data = await db
      .collection("singers")
      .find(
        {},
        {
          projection: {
            singer: 1,
            cover: 1,
          },
        }
      )
      .toArray();

    return data.map((item) => ({
      id:
        typeof item._id === "string" ? item._id : (item._id?.toString() ?? ""),
      _id:
        typeof item._id === "string" ? item._id : (item._id?.toString() ?? ""),
      singer: String(item.singer ?? ""),
      cover: String(item.cover ?? ""),
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
