"use client";
import Image from "next/image";
import { IPlaylistItem } from "../type/playlist";

type IProp = {
  music: IPlaylistItem;
};

export function SingerItem({ music }: IProp) {
  return (
    <div>
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
    </div>
  );
}
