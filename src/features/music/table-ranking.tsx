"use client";
import { useAudio } from "@/components/music-provider";
import { TableRankingItem } from "./component/table-ranking-item";

import { MUSICS } from "./data/music-page";
import { useRef } from "react";

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
        <div className="ml-2 px-1 text-xl font-semibold text-black dark:text-white md:ml-[270px]">
          Hot Tracks
        </div>
      )}

      {none && <div className=""></div>}

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
