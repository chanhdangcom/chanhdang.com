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

  // Validate cover URL to prevent "Failed to construct 'URL': Invalid URL" error
  const isValidUrl = (url: string | undefined | null): boolean => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      return false;
    }
    try {
      new URL(url);
      return true;
    } catch {
      // If it's a relative URL, check if it starts with /
      return url.startsWith("/");
    }
  };

  const coverUrl =
    music.cover && isValidUrl(music.cover) ? music.cover : "/img/Logomark.png";

  return (
    <div
      className="w-full space-y-2 p-1.5 text-left"
      onClick={() => onClick?.(music)}
    >
      {/* <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-900" /> */}

      {/* <div className="font-semibold text-red-500">
        {music.singer || "ChanhDang Music"}
      </div> */}

      <div className="text-sm text-zinc-400">{music.queueName ?? ""}</div>

      <div className="my-1 space-y-2">
        <BorderPro roundedSize="rounded-md">
          <Image
            alt={music.title || "Playlist cover"}
            src={coverUrl}
            width={300}
            height={300}
            className="mx-auto h-60 w-80 shrink-0 justify-center rounded-md object-cover md:h-80 md:w-[50vh]"
          />
        </BorderPro>

        <div className="line-clamp-1 text-lg font-semibold">{music.title}</div>
      </div>
    </div>
  );
}
