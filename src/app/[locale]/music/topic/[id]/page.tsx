import { AudioBar } from "@/features/music/audio-bar";
import { BackButton } from "@/features/music/component/back-button";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { HeaderMusicPage } from "@/features/music/header-music-page";
import { MenuBar } from "@/features/music/menu-bar";
import { MenuBarMobile } from "@/features/music/menu-bar-mobile";
import { TopicList } from "@/features/music/topic-list";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import {
  normalizeMusic,
  normalizeObjectIds,
  parseObjectIds,
} from "@/lib/mongodb-helpers";
import { IMusic } from "@/app/[locale]/features/profile/types/music";

type Iprop = {
  params: { id: string };
};

type TopicDocument = {
  _id: ObjectId;
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

async function GetTopic(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const client = await clientPromise;
  const db = await client.db("musicdb");
  const topic = (await db
    .collection("topics")
    .findOne({ _id: new ObjectId(id) })) as TopicDocument | null;

  if (!topic) return null;

  const musicIds = Array.isArray(topic.musicIds)
    ? normalizeObjectIds(topic.musicIds)
    : Array.isArray(topic.musics)
      ? parseLegacyMusicIds(topic.musics)
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
  ) as IMusic[];

  return {
    id: topic._id.toString(),
    title: String(topic.title ?? ""),
    musicIds: musicIds.map((item) => item.toString()),
    musics,
  };
}

export default async function Page({ params }: Iprop) {
  const { id } = await params;
  const topic = await GetTopic(id);

  if (!topic) {
    return <div>Topic not found</div>;
  }

  return (
    <div>
      <div className="flex font-apple">
        <MotionHeaderMusic />
        <MenuBar />

        <div className="mx-auto w-full">
          <div className="relative z-10">
            <div className="z-20 hidden md:ml-[270px] md:flex">
              <HeaderMusicPage />
            </div>

            <BackButton className="left-3" />

            <div className="mt-4 line-clamp-1 gap-1 px-1 text-center text-xl font-bold text-black dark:text-white md:ml-[270px]">
              {topic?.title}
            </div>

            <div className="mt-4">
              <TopicList musics={topic?.musics} />

            </div>
          </div>

          <div className="my-40">
            <AudioBar />
            <MenuBarMobile />
          </div>
        </div>
      </div>
    </div>
  );
}
