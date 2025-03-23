"use client";
import Image from "next/image";
import { ISingerItem } from "../type/singer";

type IProp = {
  music: ISingerItem;
  onClick: (id: string) => void;
};

export function SingerItem({ music, onClick }: IProp) {
  return (
    <div onClick={() => onClick(music.id)}>
      {music.cover ? (
        <Image
          alt="singer cover"
          width={128}
          height={128}
          src={music.cover}
          className="size-32 rounded-full object-cover"
        />
      ) : (
        <div className="size-32 rounded-full bg-zinc-600"></div>
      )}

      <div className="mt-2 line-clamp-1 flex justify-center text-zinc-500">
        {music.singer}
      </div>
    </div>
  );
}
