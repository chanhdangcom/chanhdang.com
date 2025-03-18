"use client";

import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { BookBookmark, Browsers, House } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { AudioItemOrder } from "./component/audio-item-order";
import { MUSICS } from "./data/music-page-playlist";

export function MenuBar() {
  return (
    <div className="relative hidden md:flex">
      <div className="h-96 w-64"></div>
      <div className="fixed top-0 h-full w-64 bg-zinc-100/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="">
          <Link href="/">
            <ChanhdangLogotype />
          </Link>

          <div className="my-8 space-y-2 text-base font-medium text-zinc-950 dark:text-zinc-400">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-200 p-2 dark:bg-zinc-900">
              <House size={20} className="" weight="fill" />
              <div className="">Home</div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-200 p-2 dark:bg-zinc-900">
              <Browsers size={20} className="dark:text-zinc-50" />
              <div className="">Brower</div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-200 p-2 dark:bg-zinc-900">
              <BookBookmark size={20} className="" />
              <div className="">Library</div>
            </div>
          </div>

          <div className="fixed h-0.5 w-56 bg-zinc-300 dark:bg-zinc-800"></div>

          <div className="mt-16 space-y-4 font-semibold">
            {MUSICS.map((music) => (
              <AudioItemOrder
                music={music}
                key={music.id}
                className="size-16"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
