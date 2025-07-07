"use client";
import { useAudio } from "@/components/music-provider";
import { AudioItemOrder } from "./audio-item-order";
import { IMusic } from "@/features/profile/types/music";
import { DotsThree } from "@phosphor-icons/react/dist/ssr";

type Iprop = {
  music: IMusic;
  handlePlay: () => void;
};

export function TableRankingItem({ music, handlePlay }: Iprop) {
  const { handlePlayAudio } = useAudio();

  return (
    <div className="z-10 cursor-pointer text-zinc-50" onClick={handlePlay}>
      <div className="flex items-center justify-between">
        <AudioItemOrder
          className="size-16"
          music={music}
          handlePlay={() => handlePlayAudio}
        />
        <DotsThree size={20} weight="bold" />
      </div>
    </div>
  );
}
