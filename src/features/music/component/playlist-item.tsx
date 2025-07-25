"use client";

import Image from "next/image";
import { IPlaylistItem } from "../type/playlist";

type IProp = {
  music: IPlaylistItem;
};

export function PlaylistItem({ music }: IProp) {
  if (!music) {
    return <div className="text-red-500">Dữ liệu chưa sẵn sàng</div>;
  }

  return (
    <div className="p-1.5">
      <div className="font-semibold text-black dark:text-white">
        {music.singer}
      </div>

      <div className="text-sm text-zinc-400">ChanhDang Music</div>

      <div className="my-1 space-y-2">
        <Image
          alt="1"
          src={music.cover}
          width={300}
          height={300}
          className="mx-auto h-40 w-40 shrink-0 justify-center rounded-lg object-cover md:size-52"
        />

        <div className="line-clamp-1 w-full text-sm font-semibold">
          {music.title}.
        </div>
      </div>
    </div>
  );
}
