import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { RecentAuidoListClient } from "./recent-audio-list-client";
import clientPromise from "@/lib/mongodb";

type HistoryItem = {
  _id: string;
  userId: string;
  musicId: string;
  musicData: IMusic;
  playedAt: string;
  playCount?: number;
};

export async function RecentCarouselAudio() {
  const client = await clientPromise;
  const data = await client.db("musicdb");
  const history = await data.collection("history").find({}).toArray();
  const historyItems: HistoryItem[] = Array.isArray(history)
    ? history.map((item) => ({
        _id: item._id.toString(),
        userId: item.userId.toString(),
        musicId: item.musicId.toString(),
        musicData: item.musicData as IMusic,
        playedAt: item.playedAt.toString(),
      }))
    : [];
  return (
    <>
      <div className="relative w-full rounded-3xl text-black dark:text-white md:max-h-full">
        <div className="flex justify-between">
          <h2 className="ml-2 flex items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]">
            <div>Recently Played</div>

            <CaretRight
              size={20}
              weight="bold"
              className="text-zinc-500 md:mt-1"
            />
          </h2>
        </div>

        <RecentAuidoListClient
          musics={historyItems.map((item) => item.musicData)}
        />
      </div>
    </>
  );
}
