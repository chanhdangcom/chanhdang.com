"use client";

import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { AuidoItem } from "./component/audio-item";
import { useAudio } from "@/components/music-provider";

export function RecentAuidoListClient({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();

  return (
    <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-hide md:snap-none">
      {musics.slice(0, 8).map((music, index) => (
        <div key={music.id} className="snap-start">
          <div
            className={`w-full shrink-0 ${
              index === 0 ? "ml-2 md:ml-[270px]" : ""
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
