/* eslint-disable react/no-unescaped-entities */
"use client";
import { useAudio } from "@/components/music-provider";
import { TableRankingItem } from "./component/table-ranking-item";

import { MUSICS } from "./data/music-page";
import { useRef } from "react";

import Link from "next/link";

type IProp = {
  home?: boolean;
  addPage?: boolean;
  none?: boolean;
};

export function TableRanking({ home, addPage, none }: IProp) {
  const { handlePlayAudio } = useAudio();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="z-[1] rounded-3xl p-1 md:max-w-full">
      {home && (
        <div className="ml-2 px-1 text-2xl font-semibold text-black dark:text-white md:ml-[270px]">
          Today's Hits
        </div>
      )}

      {none && (
        <Link href={"/music"} className="">
          <div className="relative m-4 inline-block font-mono text-xl font-semibold hover:underline">
            ChanhDang Music
            {/* 4 lines */}
            <div className="pointer-events-none absolute inset-0">
              {/* Top line */}
              <div className="absolute left-[-10px] right-[-10px] top-0 h-px bg-zinc-400 dark:bg-zinc-700/90"></div>
              {/* Bottom line */}
              <div className="absolute bottom-0 left-[-10px] right-[-10px] h-px bg-zinc-400 dark:bg-zinc-700/90"></div>
              {/* Left line */}
              <div className="absolute bottom-[-10px] left-0 top-[-10px] w-px bg-zinc-400 dark:bg-zinc-700/90"></div>
              {/* Right line */}
              <div className="absolute bottom-[-10px] right-0 top-[-10px] w-px bg-zinc-400 dark:bg-zinc-700/90"></div>
            </div>
          </div>
        </Link>
      )}

      <div
        ref={ref}
        className="mt-1 w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide md:snap-none"
      >
        <div className="grid grid-flow-col grid-rows-4 gap-4">
          {MUSICS.map((music, index) => (
            <div key={music.id} className="snap-start p-1">
              {home && (
                <div className={` ${index < 4 ? "ml-2 md:ml-[270px]" : ""}`}>
                  <TableRankingItem
                    music={music}
                    handlePlay={() => handlePlayAudio(music)}
                  />
                </div>
              )}

              {addPage && (
                <div className={` ${index < 4 ? "ml-2 md:ml-[510px]" : ""}`}>
                  <TableRankingItem
                    music={music}
                    handlePlay={() => handlePlayAudio(music)}
                  />
                </div>
              )}

              {none && (
                <div className={` ${index < 4 ? "" : ""}`}>
                  <TableRankingItem
                    music={music}
                    handlePlay={() => handlePlayAudio(music)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
