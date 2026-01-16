"use client";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useAudio } from "@/components/music-provider";
import { AuidoItem } from "./component/audio-item";

export function NewReleaseList({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();

  return (
    <div className="shrink-0 md:ml-[270px]">
      <div className="mx-2 grid grid-cols-2 md:grid-cols-5">
        {musics.reverse().map((music) => (
          <div key={music.id} className="md:mb-12">
            <AuidoItem
              music={music}
              handlePlay={() => handlePlayAudio(music)}
              className="w-full md:h-[30vh] md:w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
