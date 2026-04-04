"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IPlaylistItem } from "../type/playlist";
import { BorderPro } from "./border-pro";
import { useImageHoverColor } from "@/hooks/use-image-hover-color";
import { PlaylistCover } from "./playlist-cover";
import { getPlaylistCoverPreviewUrl } from "../utils/playlist-cover";

type IProp = {
  music: IPlaylistItem | null;
  onClick?: (music: IPlaylistItem) => void;
};

export function PlaylistItem({ music, onClick }: IProp) {
  const [isEnter, setIsEnter] = useState<boolean>(false);
  const coverUrl = getPlaylistCoverPreviewUrl(music?.cover);

  const hoverBg = useImageHoverColor(coverUrl);

  if (!music) {
    return <div className="text-rose-500">Dữ liệu chưa sẵn sàng</div>;
  }

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <div
        onMouseEnter={() => setIsEnter(true)}
        onMouseLeave={() => setIsEnter(false)}
        className="w-full space-y-2 rounded-xl p-1.5 text-left transition-colors"
        style={{
          backgroundColor: isEnter ? hoverBg : "transparent",
          transition: "background-color 150ms ease",
        }}
        onClick={() => onClick?.(music)}
      >
        <div className="text-sm text-zinc-400">{music.queueName ?? ""}</div>

        <div className="my-1 space-y-2">
          <div className="relative">
            <BorderPro roundedSize="rounded-md">
              <PlaylistCover
                cover={music.cover}
                title={music.title || "Playlist cover"}
                className="mx-auto size-44 shrink-0 cursor-pointer justify-center rounded-lg md:size-52"
              />
            </BorderPro>

            {isEnter && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeIn" }}
                className="pointer-events-none absolute top-0 h-20 w-full rounded-md bg-gradient-to-b from-zinc-900/80 to-transparent"
              />
            )}
          </div>

          <div className="line-clamp-1 w-32 cursor-pointer text-sm font-semibold">
            {music.title}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
