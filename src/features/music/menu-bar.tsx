"use client";

import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { BookBookmark, Browsers, House } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { AudioItemOrder } from "./component/audio-item-order";
import { MUSICSPLAYLIST } from "./data/music-page-playlist";
import { useAudio } from "@/components/music-provider";

export function MenuBar() {
  const { handlePlayAudio } = useAudio();
  return (
    <div className="relative hidden md:flex">
      <div className="h-96 w-64"></div>
      <div className="fixed top-0 h-full w-64 border border-zinc-800 bg-zinc-950 p-4">
        <div className="">
          <Link href="/">
            <ChanhdangLogotype />
          </Link>

          <div className="my-8 space-y-2 text-base font-medium text-zinc-50">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-900 p-2">
              <House size={20} className="" weight="fill" />
              <div className="">Home</div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-900 p-2">
              <Browsers size={20} className="text-zinc-50" />
              <div className="">Brower</div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-900 p-2">
              <BookBookmark size={20} className="" />
              <div className="">Library</div>
            </div>
          </div>

          <div className="fixed h-0.5 w-56 bg-zinc-800"></div>

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
