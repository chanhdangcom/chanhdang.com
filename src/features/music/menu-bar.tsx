"use client";

import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import {
  BookBookmark,
  Browsers,
  House,
  MusicNotes,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function MenuBar() {
  return (
    <div className="relative">
      <div className="h-96 w-60"></div>
      <div className="fixed top-0 h-full w-60 bg-zinc-100/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="">
          <Link href="/">
            <ChanhdangLogotype />
          </Link>

          <div className="my-8 space-y-2 text-base font-medium text-zinc-50 dark:text-zinc-400">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-900 p-2 dark:bg-zinc-900">
              <House size={20} className="text-zinc-50" weight="fill" />
              <div>Home</div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-900 p-2">
              <Browsers size={20} className="text-zinc-50" />
              <div>Brower</div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-900 p-2">
              <BookBookmark size={20} className="text-zinc-50" />
              <div>Library</div>
            </div>
          </div>

          <div className="fixed h-0.5 w-48 bg-zinc-300 dark:bg-zinc-800"></div>

          <div className="mt-16 space-y-4 p-2 font-semibold text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-zinc-900">
                <MusicNotes size={32} weight="fill" className="text-zinc-50" />
              </div>

              <div>
                <div className="line-clamp-1 text-sm font-medium">
                  <div>TITLE PLAYLIST1</div>
                </div>

                <div className="text-xs font-medium text-zinc-500">
                  <div>SINGER</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-zinc-900">
                <MusicNotes size={32} weight="fill" className="text-zinc-50" />
              </div>

              <div>
                <div className="line-clamp-1 text-sm font-medium">
                  <div>TITLE PLAYLIST2</div>
                </div>

                <div className="text-xs font-medium text-zinc-500">
                  <div>SINGER</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-zinc-900">
                <MusicNotes size={32} weight="fill" className="text-zinc-50" />
              </div>

              <div>
                <div className="line-clamp-1 text-sm font-medium">
                  <div>TITLE PLAYLIST3</div>
                </div>

                <div className="text-xs font-medium text-zinc-500">
                  <div>SINGER</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
