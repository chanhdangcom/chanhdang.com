"use client";
import { useAudio } from "@/components/music-provider";
import { AudioItemOrder } from "./audio-item-order";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { DotsThree } from "@phosphor-icons/react/dist/ssr";

type Iprop = {
  music: IMusic;
  handlePlay?: () => void;
};

export function TableRankingItem({ music, handlePlay }: Iprop) {
  const { handlePlayAudio } = useAudio();

  return (
    <div
      className="z-10 cursor-pointer text-black dark:text-white"
      onClick={handlePlay}
    >
      <div className="flex items-center justify-between">
        <AudioItemOrder
          className="w-[70vw] md:w-[30vw]"
          music={music}
          handlePlay={() => handlePlayAudio}
          item={<DotsThree size={20} weight="bold" />}
          border={true}
        />
      </div>
    </div>
  );
}
