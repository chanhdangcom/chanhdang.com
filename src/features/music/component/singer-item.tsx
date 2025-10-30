"use client";
import Image from "next/image";
import { ISingerItem } from "../type/singer";
import { BorderPro } from "./border-pro";

type IProp = {
  music: ISingerItem;
  onClick: (id: string) => void;
};

export function SingerItem({ music, onClick }: IProp) {
  const handleClick = () => {
    const id = music.id ?? music._id;
    if (id) {
      onClick(id);
    }
  };
  return (
    <div onClick={handleClick}>
      {music.cover ? (
        <BorderPro roundedSize="rounded-full">
          <Image
            alt="singer cover"
            width={128}
            height={128}
            src={music.cover}
            className="size-44 rounded-full object-cover md:size-52"
          />
        </BorderPro>
      ) : (
        <div className="size-44 rounded-full bg-zinc-600 md:size-44"></div>
      )}

      <div className="mt-2 line-clamp-1 flex justify-center font-semibold text-black dark:text-white">
        {music.singer}
      </div>
    </div>
  );
}
