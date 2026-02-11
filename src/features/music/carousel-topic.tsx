import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { NewAuidoListClient } from "./new-audio-list-client";
import { normalizeMusic, normalizeObjectIds } from "@/lib/mongodb-helpers";

type TopicDocument = {
  _id: { toString: () => string };
  title?: string;
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

export async function CarouselTopic() {
  try {
    const client = await clientPromise;
    const db = await client.db("musicdb");
    const topics = (await db
      .collection("topics")
      .find(
        {},
        {
          projection: {
            title: 1,
            musicIds: 1,
            musics: 1,
          },
        }
      )
      .toArray()) as TopicDocument[];

    if (!topics || topics.length === 0) {
      return null;
    }

    const topicMusicIds = topics.map((topic) =>
      Array.isArray(topic.musicIds)
        ? normalizeObjectIds(topic.musicIds)
        : Array.isArray(topic.musics)
          ? parseLegacyMusicIds(topic.musics)
          : []
    );
    const uniqueIdMap = new Map<string, ReturnType<typeof normalizeObjectIds>[number]>();
    topicMusicIds.flat().forEach((id) => {
      uniqueIdMap.set(id.toString(), id);
    });
    const uniqueIds = [...uniqueIdMap.values()];
    const musicDocs =
      uniqueIds.length > 0
        ? await db
            .collection("musics")
            .find(
              { _id: { $in: uniqueIds } },
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
                },
              }
            )
            .toArray()
        : [];
    const musicById = new Map(
      musicDocs.map((music) => [
        (music._id?.toString?.() ?? "") as string,
        normalizeMusic(music as Record<string, unknown>),
      ])
    );

    const resolvedTopics = topics.map((topic, index) => {
      const ids = topicMusicIds[index] ?? [];
      const musics = ids
        .map((id) => musicById.get(id.toString()))
        .filter((item): item is ReturnType<typeof normalizeMusic> => Boolean(item));
      return {
        id: topic._id.toString(),
        title: String(topic.title ?? ""),
        musics,
      };
    });
    const topicsWithSongs = resolvedTopics.filter((topic) => topic.musics.length > 0);

    if (topicsWithSongs.length === 0) {
      return null;
    }

    return (
      <div className="w-full">
        {topicsWithSongs
          .sort(() => Math.random() - 0.5)
          .map((topic) => (
            <div key={topic.id} className="">
              <>
                <Link
                  href={`/en/music/topic/${topic.id}`}
                  className="relative ml-2 mt-4 flex w-fit items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]"
                >
                  <div className="mb-1 mt-2 line-clamp-1">{topic.title}</div>

                  <CaretRight
                    size={20}
                    weight="bold"
                    className="mt-1 text-zinc-500"
                  />
                </Link>
              </>

              <NewAuidoListClient musics={topic.musics} />
            </div>
          ))}
      </div>
    );
  } catch (error) {
    console.error("❌ Failed to fetch topics:", error);
    // Return null to gracefully handle the error without breaking the page
    return null;
  }
}
