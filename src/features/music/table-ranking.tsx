/* eslint-disable react/no-unescaped-entities */
"use client";
import { useAudio } from "@/components/music-provider";
import { TableRankingItem } from "./component/table-ranking-item";

import { MUSICS } from "./data/music-page";
import { useRef } from "react";

export function TableRanking() {
  const { handlePlayAudio } = useAudio();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="z-[1] rounded-3xl p-1 md:max-w-full">
      <div className="ml-2 px-1 text-2xl font-semibold text-black dark:text-white md:ml-[270px]">
        Today's Hits
      </div>

      <div
        ref={ref}
        className="mt-3 w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
      >
        <div className="grid grid-flow-col grid-rows-4 gap-x-4">
          {MUSICS.map((music, index) => (
            <div key={music.id} className="snap-start">
              <div
                className={`flex items-center gap-6 px-1 py-2 ${index < 4 ? "ml-2 md:ml-[270px]" : ""}`}
              >
                <TableRankingItem
                  music={music}
                  handlePlay={() => handlePlayAudio(music)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
