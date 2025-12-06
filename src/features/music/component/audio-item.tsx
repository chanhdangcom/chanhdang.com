/* eslint-disable @next/next/no-img-element */

"use client";

import { useUser } from "@/hooks/use-user";
import { useState } from "react";
import { Play } from "phosphor-react";
import { motion } from "framer-motion";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { BorderPro } from "./border-pro";
import { LibraryTrackButton } from "../library/library-track-button";
import { useImageHoverColor } from "@/hooks/use-image-hover-color";

type IProp = {
  music: IMusic;
  handlePlay?: () => void;
};

export function AuidoItem({ music, handlePlay }: IProp) {
  const { user } = useUser();
  const [isEnter, setIsEnter] = useState<boolean>(false);
  const hoverBg = useImageHoverColor(music?.cover);

  return (
    <motion.div whileTap={{ scale: 0.8 }}>
      <div
        onMouseEnter={() => setIsEnter(true)}
        onMouseLeave={() => setIsEnter(false)}
        className="w-44 shrink-0 space-y-1 rounded-xl p-2 text-zinc-50 md:w-52"
        style={{
          backgroundColor: isEnter ? hoverBg : "transparent",
          transition: "background-color 150ms ease",
        }}
      >
        <div className="relative">
          {music.cover ? (
            <BorderPro roundedSize="rounded-lg">
              <img
                src={music.cover}
                alt="cover"
                className="mx-auto size-44 shrink-0 cursor-pointer justify-center rounded-lg object-cover md:size-52"
                onClick={handlePlay}
              />
            </BorderPro>
          ) : (
            <div
              className="size-40 cursor-pointer rounded-2xl bg-zinc-800"
              onClick={handlePlay}
            ></div>
          )}

          {isEnter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="pointer-events-none absolute top-0 h-20 w-full rounded-md bg-gradient-to-b from-zinc-900/80 to-transparent"
            ></motion.div>
          )}

          {isEnter && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="absolute right-2 top-2"
            >
              <LibraryTrackButton music={music} userId={user?.id} size="sm" />
            </motion.div>
          )}

          {isEnter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="absolute bottom-2 right-2"
            >
              <Play
                className="size-10 rounded-full bg-zinc-900/60 p-2 text-zinc-50 backdrop-blur-sm hover:text-red-500"
                weight="fill"
              />
            </motion.div>
          )}
        </div>

        <div className="text-black dark:text-white">
          <div
            className="line-clamp-1 w-32 cursor-pointer text-sm font-semibold"
            onClick={handlePlay}
          >
            {music.title || "TITLE"}
          </div>

          <div className="line-clamp-1 w-32 text-xs text-zinc-500">
            {music.singer || "SINGER"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
