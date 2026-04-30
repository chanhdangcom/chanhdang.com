"use client";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useAudio } from "@/components/music-provider";
import { AuidoItem } from "./component/audio-item";

export function NewReleaseList({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();
  const releaseMusics = [...musics].reverse();

  return (
    <div className="shrink-0 md:ml-[270px]">
      <div className="mx-2 grid grid-cols-2 gap-x-2 gap-y-5 md:grid-cols-5 md:gap-x-2.5 md:gap-y-6">
        {releaseMusics.map((music) => (
          <div key={music.id} className="w-full">
            <AuidoItem
              music={music}
              handlePlay={() => handlePlayAudio(music)}
              className="h-full w-full md:h-[30vh] md:w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
