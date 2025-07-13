"use client";
import { ISingerItem } from "../type/singer";
import { useAudio } from "@/components/music-provider";
import { AuidoItem } from "./audio-item";
import Image from "next/image";

type IProp = {
  music: ISingerItem;
};

export function AudioSingerItemOrder({ music }: IProp) {
  const { handlePlayAudio } = useAudio();

  if (!music) {
    return <div className="text-red-500">Dữ liệu nhạc chưa sẵn sàng</div>;
  }

  return (
    <div>
      <div className="scrollbar-hide flex overflow-x-auto">
        {music.musics?.map((music) => (
          <div key={music.id} className="">
            <div className="w-fit shrink-0 cursor-pointer space-y-2 rounded-xl p-1.5 text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900">
              {music.cover ? (
                <Image
                  height={300}
                  width={300}
                  alt="cover"
                  src={music.cover}
                  quality={100}
                  className="mx-auto h-40 w-40 justify-center rounded-lg object-cover md:size-44"
                />
              ) : (
                <div className="size-40 rounded-2xl bg-zinc-800"></div>
              )}

              <div className="text-black dark:text-white">
                <div className="line-clamp-1 w-32 text-sm font-semibold">
                  {music.title || "TITLE"}
                </div>

                <div className="line-clamp-1 w-32 text-sm text-zinc-500">
                  {music.singer || "SINGER"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
