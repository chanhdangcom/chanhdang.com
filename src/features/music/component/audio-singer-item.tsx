"use client";
import { ISingerItem } from "../type/singer";
import { useAudio } from "@/components/music-provider";
import { AudioItemOrder } from "./audio-item-order";

type IProp = {
  music: ISingerItem;
};

export function AudioSingerItem({ music }: IProp) {
  const { handlePlayAudio } = useAudio();

  if (!music) {
    return <div className="text-red-500">Dữ liệu nhạc chưa sẵn sàng</div>;
  }

  return (
    <div>
      {music.musics?.map((music) => (
        <div key={music.id} className="p-2">
          <AudioItemOrder
            music={music}
            handlePlay={() => handlePlayAudio(music)}
          />
        </div>
      ))}
    </div>
  );
}
