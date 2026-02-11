import { SingerPageClient } from "@/features/music/singer-page-client";
import { MenuBar } from "@/features/music/menu-bar";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { ISingerItem } from "@/features/music/type/singer";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { CarouselAudioPlaylist } from "@/features/music/carousel-audio-playlist";
import { RecentCarouselAudio } from "@/features/music/recent-carousel-audio";
import { NewCarouselAudio } from "@/features/music/new-carousel-audio";
import { SingerList } from "@/features/music/singer-list";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeObjectIds = (ids: unknown[]) =>
  ids
    .map((id) => {
      if (id instanceof ObjectId) return id;
      if (typeof id === "string" && ObjectId.isValid(id)) {
        return new ObjectId(id);
      }
      return null;
    })
    .filter((id): id is ObjectId => Boolean(id));

async function getSinger(id: string): Promise<ISingerItem | null> {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const singer = await db.collection("singers").findOne({
      _id: new ObjectId(id),
    }, {
      projection: {
        singer: 1,
        cover: 1,
        musicIds: 1,
      },
    });

    if (!singer) {
      return null;
    }

    const musicIds = Array.isArray(singer.musicIds)
      ? normalizeObjectIds(singer.musicIds)
      : [];

    let musicDocs: Record<string, unknown>[] = [];
    if (musicIds.length > 0) {
      musicDocs = await db
        .collection("musics")
        .find(
          { _id: { $in: musicIds } },
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
        .toArray();

      // Keep playlist order from singer.musicIds
      const idOrder = new Map(musicIds.map((item, index) => [item.toString(), index]));
      musicDocs.sort((a, b) => {
        const aId = a._id?.toString?.() ?? "";
        const bId = b._id?.toString?.() ?? "";
        return (idOrder.get(aId) ?? Number.MAX_SAFE_INTEGER) -
          (idOrder.get(bId) ?? Number.MAX_SAFE_INTEGER);
      });
    } else {
      const singerName = String(singer.singer ?? "").trim();
      if (singerName) {
        const singerRegex = new RegExp(
          `(^|,)\\s*${escapeRegex(singerName)}\\s*(,|$)`,
          "i"
        );
        musicDocs = await db
          .collection("musics")
          .find(
            {
              $or: [
                { singerId: singer._id },
                { singer: singerRegex },
                { singer: singerName },
              ],
            },
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
          .limit(80)
          .toArray();
      }
    }

    const musics: IMusic[] = musicDocs.map((item) => ({
      id:
        typeof item.id === "string"
          ? item.id
          : typeof item._id === "string"
            ? item._id
            : (item._id?.toString() ?? ""),
      title: String(item.title ?? ""),
      singer: String(item.singer ?? ""),
      cover: String(item.cover ?? ""),
      audio: String(item.audio ?? ""),
      youtube: String(item.youtube ?? ""),
      content: String(item.content ?? ""),
      type: item.type ? String(item.type) : undefined,
      topic: item.topic ? String(item.topic) : undefined,
      srt: item.srt ? String(item.srt) : undefined,
      beat: item.beat ? String(item.beat) : undefined,
      createdAt:
        item.createdAt instanceof Date
          ? item.createdAt
          : item.createdAt
            ? new Date(item.createdAt as string)
            : undefined,
    }));

    return {
      id: typeof singer._id === "string" ? singer._id : singer._id?.toString(),
      _id: typeof singer._id === "string" ? singer._id : singer._id?.toString(),
      singer: String(singer.singer ?? ""),
      cover: String(singer.cover ?? ""),
      musics: musics.length > 0 ? musics : undefined,
    };
  } catch (error) {
    console.error("Error fetching singer:", error);
    return null;
  }
}

function RelatedSectionsSkeleton() {
  return (
    <div className="space-y-4 px-2 md:px-0">
      <div className="h-36 animate-pulse rounded-2xl bg-zinc-200/60 md:ml-[270px] dark:bg-zinc-800/60" />
      <div className="h-52 animate-pulse rounded-2xl bg-zinc-200/60 md:ml-[270px] dark:bg-zinc-800/60" />
      <div className="h-44 animate-pulse rounded-2xl bg-zinc-200/60 md:ml-[270px] dark:bg-zinc-800/60" />
    </div>
  );
}

export default async function SingerDetailPage({ params }: Props) {
  const { id } = await params;
  const singer = await getSinger(id);

  if (!singer) {
    return (
      <div className="md:flex">
        <MenuBar />
        <div className="pointer-events-none fixed top-0 z-10 h-24 w-full bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />

        <MotionHeaderMusic name="Artists" />

        <div className="flex items-center justify-center py-8">
          <div className="text-zinc-500">Singer not found</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SingerPageClient singer={singer} />

      <Suspense fallback={<RelatedSectionsSkeleton />}>
        <div className="space-y-4">
          <RecentCarouselAudio />

          <CarouselAudioPlaylist />

          <NewCarouselAudio />

          <div className="relative py-8">
            <div className="absolute left-0 top-0 h-full w-full bg-zinc-100 dark:bg-zinc-900" />

            <SingerList />

            <div className="mt-8 h-32 md:ml-60" />
          </div>
        </div>
      </Suspense>
    </>
  );
}
