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
    <>
      <div className="p-1.5">
        <div className="font-semibold text-black dark:text-white">
          {music.singer}
        </div>
        <div className="text-sm text-zinc-400">ChanhDang Music</div>

        <div className="my-1 space-y-2">
          <div className="relative overflow-hidden rounded-xl">
            <div className="relative h-52 w-80">
              <Image
                alt="1"
                src={music.cover}
                width={300}
                height={300}
                className="absolute inset-0 h-52 w-80 rounded-xl object-cover opacity-40 blur-md"
              />

              <Image
                alt="1"
                src={music.cover}
                width={300}
                height={300}
                className="relative z-10 mx-auto h-52 w-auto rounded-lg object-cover"
              />
            </div>

            <div className="absolute inset-0 z-20 bg-gradient-to-t from-zinc-900/40 to-transparent" />

            <div className="absolute bottom-2 left-4 right-4 z-20 line-clamp-1 text-lg font-semibold text-white">
              {music.title}.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
