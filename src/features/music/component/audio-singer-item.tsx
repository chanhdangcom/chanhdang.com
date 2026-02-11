"use client";
import { ISingerItem } from "../type/singer";
import { useAudio } from "@/components/music-provider";
import { AudioItemOrder } from "./audio-item-order";
import { DotsThreeVertical } from "@phosphor-icons/react/dist/ssr";

type IProp = {
  music: ISingerItem;
};

export function AudioSingerItem({ music }: IProp) {
  const { handlePlayAudio } = useAudio();

  if (!music) {
    return <div className="text-rose-500">Dữ liệu nhạc chưa sẵn sàng</div>;
  }

  return (
    <div>
      <div className="space-y-4">
        {music.musics?.map((song, index) => (
          <div key={song.id} className="flex items-center gap-4 font-apple">
            <div className="font-medium text-zinc-500">{index + 1}</div>

            <AudioItemOrder
              music={song}
              handlePlay={() => handlePlayAudio(song)}
              date={
                song.createdAt
                  ? new Date(song.createdAt as Date).toISOString()
                  : undefined
              }
              item={<DotsThreeVertical size={20} weight="bold" />}
              className="w-full"
              border={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
