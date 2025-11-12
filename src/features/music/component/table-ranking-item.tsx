"use client";
import { useAudio } from "@/components/music-provider";
import { AudioItemOrder } from "./audio-item-order";

import { DotsThreeVertical } from "phosphor-react";
import { IMusic } from "@/app/[locale]/features/profile /types/music";

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
          className="w-[35vh]"
          music={music}
          handlePlay={() => handlePlayAudio}
          item={<DotsThreeVertical size={20} weight="bold" />}
        />
      </div>
    </div>
  );
}
