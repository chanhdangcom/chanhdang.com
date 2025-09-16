"use client";
import { ISingerItem } from "../type/singer";
import { useAudio } from "@/components/music-provider";
import { AuidoItem } from "./audio-item";

type IProp = {
  music: ISingerItem;
};

export function AudioSingerItemOrder({ music }: IProp) {
  const { handlePlayAudio } = useAudio();

  if (!music) {
    return <div className="text-red-500">Dữ liệu nhạc chưa sẵn sàng</div>;
  }

  return (
    <div>
      <div className="flex overflow-x-auto scrollbar-hide">
        {music.musics?.map((music) => (
          <div key={music.id} className="">
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
