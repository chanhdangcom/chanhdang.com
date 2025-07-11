"use client";

import { BookBookmark, Browsers, House } from "@phosphor-icons/react/dist/ssr";

import { MUSICSPLAYLIST } from "./data/music-page-playlist";
import { useAudio } from "@/components/music-provider";
import { AudioItemOrder } from "./component/audio-item-order";

export function MenuBar() {
  const { handlePlayAudio } = useAudio();
  return (
    <div className="relative ml-4 mt-4 hidden md:flex">
      <div className="h-96 w-60"></div>
      <div className="absolute h-full w-60 rounded-3xl bg-gradient-to-b from-zinc-200 to-zinc-100 p-4 dark:from-zinc-900 dark:to-zinc-950">
        <div className="">
          <div className="space-y-2 text-base font-medium text-black dark:text-white">
            <div className="flex items-center gap-2 rounded-2xl bg-zinc-300 p-2 dark:bg-zinc-800">
              <House size={20} weight="fill" />
              <div className="font-semibold">Home</div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-zinc-300 p-2 dark:bg-zinc-800">
              <Browsers size={20} weight="fill" />
              <div className="font-semibold">Brower</div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-zinc-300 p-2 dark:bg-zinc-800">
              <BookBookmark size={20} weight="fill" />
              <div className="font-semibold">Library</div>
            </div>
          </div>

          {/* <div className="fixed h-0.5 w-72 bg-zinc-800"></div> */}

          <div className="mt-16 space-y-4 font-semibold">
            {MUSICSPLAYLIST.map((music) => (
              <AudioItemOrder
                music={music}
                key={music.id}
                className="size-16"
                handlePlay={() => handlePlayAudio}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
