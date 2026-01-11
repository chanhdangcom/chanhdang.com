"use client";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useAudio } from "@/components/music-provider";
import { AuidoItem } from "./component/audio-item";

export function TopicList({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();

  return (
    <div className="shrink-0 md:ml-[270px]">
      <div className="mx-2 grid grid-cols-2 gap-1 md:grid-cols-5">
        {musics.reverse().map((music) => (
          <div key={music.id}>
            <AuidoItem
              music={music}
              handlePlay={() => handlePlayAudio(music)}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
