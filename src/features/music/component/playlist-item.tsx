"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { IPlaylistItem } from "../type/playlist";
import { BorderPro } from "./border-pro";
import { useImageHoverColor } from "@/hooks/use-image-hover-color";

type IProp = {
  music: IPlaylistItem | null;
  onClick?: (music: IPlaylistItem) => void;
};

export function PlaylistItem({ music, onClick }: IProp) {
  const [isEnter, setIsEnter] = useState<boolean>(false);

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
    music?.cover && isValidUrl(music.cover) ? music.cover : "/img/Logomark.png";

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
              <Image
                alt={music.title || "Playlist cover"}
                src={coverUrl}
                width={500}
                height={500}
                className="mx-auto size-44 shrink-0 cursor-pointer justify-center rounded-lg object-cover md:size-52"
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
