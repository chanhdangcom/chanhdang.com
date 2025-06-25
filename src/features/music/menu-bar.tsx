"use client";

import { BookBookmark, Browsers, House } from "@phosphor-icons/react/dist/ssr";
import { AudioItemOrder } from "./component/audio-item-order";
import { MUSICSPLAYLIST } from "./data/music-page-playlist";
import { useAudio } from "@/components/music-provider";

export function MenuBar() {
  const { handlePlayAudio } = useAudio();
  return (
    <div className="relative ml-4 mt-4 hidden md:flex">
      <div className="h-96 w-60"></div>
      <div className="fixed h-full w-60 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 p-4">
        <div className="">
          {/* <Link href="/">
            <ChanhdangLogotype />
          </Link> */}

          <div className="space-y-2 text-base font-medium text-zinc-50">
            <div className="flex items-center gap-2 rounded-2xl bg-zinc-800 p-2">
              <House size={20} className="" weight="fill" />
              <div className="font-semibold">Home</div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-zinc-800 p-2">
              <Browsers size={20} className="text-zinc-50" />
              <div className="font-semibold">Brower</div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-zinc-800 p-2">
              <BookBookmark size={20} className="" />
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
