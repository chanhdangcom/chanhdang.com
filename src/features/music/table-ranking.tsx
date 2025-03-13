"use client";
import { useAudio } from "@/components/music-provider";
import { TableRankingItem } from "./component/table-ranking-item";
import { MUSICS } from "./data/music-page-ranking";
import { Ranking } from "@phosphor-icons/react/dist/ssr";

export function TableRanking() {
  const { handlePlayAudio } = useAudio();
  return (
    <div className="rounded-3xl border-b p-2 shadow-sm dark:border-zinc-800">
      <div className="mb-8 flex gap-2">
        <Ranking size={32} weight="fill" className="text-pink-500" />
        <div className="text-2xl">Ranking</div>
      </div>

      {MUSICS.map((music, index) => (
        <div
          key={music.id}
          className="transform rounded-3xl p-1 transition-transform duration-300 hover:scale-105 hover:bg-zinc-100 hover:dark:bg-zinc-900"
        >
          <div className="m-4 flex items-center gap-4">
            <div className="text-3xl text-zinc-500">{index + 1}</div>

            <TableRankingItem
              title={music.title}
              singer={music.singer}
              cover={music.cover}
              content={music.content}
              handlePlay={() => handlePlayAudio(music)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
