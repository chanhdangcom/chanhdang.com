import { SingerPageClient } from "@/features/music/singer-page-client";
import { MenuBar } from "@/features/music/menu-bar";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { ISingerItem } from "@/features/music/type/singer";
import { IMusic } from "@/app/[locale]/features/profile/types/music";

import { Footer } from "@/app/[locale]/features/profile/footer";
import { CarouselAudioPlaylist } from "@/features/music/carousel-audio-playlist";
import { RecentCarouselAudio } from "@/features/music/recent-carousel-audio";
import { NewCarouselAudio } from "@/features/music/new-carousel-audio";

type Props = {
  params: Promise<{ id: string }>;
};

async function getSinger(id: string): Promise<ISingerItem | null> {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const singer = await db.collection("singers").findOne({
      _id: new ObjectId(id),
    });

    if (!singer) {
      return null;
    }

    // Chuyển đổi dữ liệu sang ISingerItem
    const musics: IMusic[] = Array.isArray(singer.musics)
      ? singer.musics.map((item: Record<string, unknown>) => ({
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
        }))
      : [];

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
      <RecentCarouselAudio />
      <CarouselAudioPlaylist />
      <NewCarouselAudio />

      <div className="mb-40 mt-8 md:ml-60">
        <Footer />
      </div>
    </>
  );
}
