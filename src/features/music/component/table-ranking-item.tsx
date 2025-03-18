import { useAudio } from "@/components/music-provider";
import { AudioItemOrder } from "./audio-item-order";
import { IMusic } from "@/features/profile/types/music";

type Iprop = {
  music: IMusic;
  handlePlay: () => void;
};

export function TableRankingItem({ music, handlePlay }: Iprop) {
  const { handlePlayAudio } = useAudio();

  return (
    <div
      className="z-10 w-[40vh] cursor-pointer md:w-[110vh]"
      onClick={handlePlay}
    >
      <div className="flex items-center justify-between">
        <AudioItemOrder
          className="size-20"
          music={music}
          handlePlay={() => handlePlayAudio}
        />

        <div className="line-clamp-1 hidden text-zinc-500 md:flex">
          Rap VIET
        </div>
      </div>
    </div>
  );
}
