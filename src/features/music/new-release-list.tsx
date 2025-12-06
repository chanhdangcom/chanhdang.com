"use client";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useAudio } from "@/components/music-provider";
import { AuidoItem } from "./component/audio-item";

export function NewReleaseList({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();

  return (
    <div className="ml-2 flex shrink-0 justify-center md:ml-[270px]">
      <div className="grid grid-cols-2 md:grid-cols-5">
        {musics.reverse().map((music) => (
          <div key={music.id}>
            <AuidoItem
              music={music}
              handlePlay={() => handlePlayAudio(music)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
