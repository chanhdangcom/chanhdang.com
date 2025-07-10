"use client";
import { useAudio } from "@/components/music-provider";
import { TableRankingItem } from "./component/table-ranking-item";

import { MUSICS } from "./data/music-page";

export function TableRanking() {
  const { handlePlayAudio } = useAudio();

  return (
    <div className="z-[1] rounded-3xl p-1 md:max-w-6xl md:p-2">
      <div className="mb-2">
        <div className="px-1 text-2xl font-semibold text-zinc-50">
          Todays Hits
        </div>
      </div>

      <div className="scrollbar-hide w-full overflow-x-auto">
        <div className="grid grid-flow-col grid-rows-4 gap-x-4">
          {MUSICS.map((music) => (
            <div key={music.id}>
              <div className="flex items-center gap-6 px-1 py-2">
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
