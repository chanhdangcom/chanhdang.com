"use client";

import { IMusic } from "@/app/[locale]/features/profile /types/music";
import { AuidoItem } from "./component/audio-item";
import { useAudio } from "@/components/music-provider";

export function AuidoListClient({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();

  return (
    <div className="grid snap-x snap-mandatory grid-flow-col grid-rows-2 overflow-x-auto scroll-smooth scrollbar-hide md:snap-none">
      {musics.map((music, index) => (
        <div key={music.id} className="snap-start">
          <div
            className={`w-full shrink-0 ${
              index === 0 || index === 1 ? "ml-2 md:ml-[270px]" : ""
            }`}
          >
            <AuidoItem
              music={music}
              handlePlay={() => handlePlayAudio(music)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
