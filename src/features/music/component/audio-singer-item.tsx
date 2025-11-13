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
      <div className="w-full md:hidden">
        {music.musics?.map((music) => (
          <div key={music.id} className="p-2">
            <AudioItemOrder
              music={music}
              handlePlay={() => handlePlayAudio(music)}
            />
          </div>
        ))}
      </div>

      <div className="hidden w-full overflow-x-auto scrollbar-hide md:flex md:justify-center">
        <div className="grid grid-flow-col grid-rows-3 gap-x-4">
          {music.musics?.map((music) => (
            <div key={music.id}>
              <div className="flex items-center gap-6 px-1 py-2">
                <AudioItemOrder
                  music={music}
                  handlePlay={() => handlePlayAudio(music)}
                  className="w-[50vh]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
