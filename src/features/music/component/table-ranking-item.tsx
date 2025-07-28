"use client";
import { useAudio } from "@/components/music-provider";
import { AudioItemOrder } from "./audio-item-order";
import { IMusic } from "@/features/profile/types/music";
import { DotsThreeVertical } from "phosphor-react";

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
          className="size-12"
          music={music}
          handlePlay={() => handlePlayAudio}
          item={<DotsThreeVertical size={20} weight="bold" />}
        />
      </div>
    </div>
  );
}
