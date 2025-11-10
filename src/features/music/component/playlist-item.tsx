"use client";

import Image from "next/image";
import { IPlaylistItem } from "../type/playlist";
import { BorderPro } from "./border-pro";

type IProp = {
  music: IPlaylistItem;
  onClick?: (music: IPlaylistItem) => void;
};

export function PlaylistItem({ music, onClick }: IProp) {
  if (!music) {
    return <div className="text-red-500">Dữ liệu chưa sẵn sàng</div>;
  }

  return (
    <button
      type="button"
      className="w-full p-1.5 text-left transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
      onClick={() => onClick?.(music)}
    >
      <div className="font-semibold text-black dark:text-white">
        {music.singer || "ChanhDang Music"}
      </div>

      <div className="text-sm text-zinc-400">
        {music.queueName ?? "Chanhdang Playlist"}
      </div>

      <div className="my-1 space-y-2">
        <BorderPro roundedSize="rounded-lg">
          <Image
            alt={music.title || "Playlist cover"}
            src={music.cover}
            width={300}
            height={300}
            className="mx-auto h-60 w-80 shrink-0 justify-center rounded-lg object-cover md:h-60 md:w-96"
          />
        </BorderPro>

        <div className="line-clamp-1 w-full text-sm font-semibold">
          {music.title}
        </div>
      </div>
    </button>
  );
}
