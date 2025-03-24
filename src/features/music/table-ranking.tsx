"use client";
import { useAudio } from "@/components/music-provider";
import { TableRankingItem } from "./component/table-ranking-item";
import { MUSICS } from "./data/music-page-ranking";
import { Ranking } from "@phosphor-icons/react/dist/ssr";

export function TableRanking() {
  const { handlePlayAudio } = useAudio();

  return (
    <div className="z-[1] rounded-3xl md:max-w-xl md:p-2">
      <div className="container flex gap-2">
        <Ranking size={32} weight="fill" className="text-zinc-500" />
        <div className="text-2xl text-zinc-50">Top songs</div>
      </div>

      {MUSICS.map((music, index) => (
        <div
          key={music.id}
          className="transform rounded-3xl transition-transform duration-300 hover:bg-zinc-100 hover:dark:bg-zinc-900 md:p-1 md:hover:scale-105"
        >
          <div className="flex items-center gap-6 border-b border-zinc-800 p-2">
            <div className="text-xl text-zinc-500">{index + 1}</div>
            <TableRankingItem
              music={music}
              handlePlay={() => handlePlayAudio(music)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
