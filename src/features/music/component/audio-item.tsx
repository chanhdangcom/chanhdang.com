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
import { cn } from "@/lib/utils";
import { IPlaylistItem } from "../type/playlist";
import { useAudio } from "@/components/music-provider";
import { DynamicIslandWave } from "@/components/ui/dynamic-island";
import { useTheme } from "next-themes";

type IProp = {
  music: IMusic | IPlaylistItem;
  handlePlay?: () => void;
  className?: string;
};

export function AuidoItem({ music, handlePlay, className }: IProp) {
  const { user } = useUser();
  const { currentMusic, isPlaying } = useAudio();
  const { resolvedTheme } = useTheme();
  const [isEnter, setIsEnter] = useState<boolean>(false);
  const hoverBg = useImageHoverColor(music?.cover, { alpha: 0.3 });
  const isCurrentTrack =
    typeof (music as IMusic).audio === "string" &&
    currentMusic?.id === music?.id;
  const waveColor = resolvedTheme === "dark" ? "#3b82f6" : "#f43f5e";

  return (
    <motion.div whileTap={{ scale: 0.8 }}>
      <div
        onMouseEnter={() => setIsEnter(true)}
        onMouseLeave={() => setIsEnter(false)}
        className={cn(
          "w-44 shrink-0 space-y-1 rounded-xl p-1.5 text-zinc-50 md:w-52",
          className
        )}
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
                className={cn(
                  "mx-auto size-44 shrink-0 cursor-pointer justify-center rounded-lg object-cover md:size-52",
                  className
                )}
                onClick={handlePlay}
              />
            </BorderPro>
          ) : (
            <div
              className="size-40 cursor-pointer rounded-xl bg-zinc-800"
              onClick={handlePlay}
            />
          )}

          {isEnter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="pointer-events-none absolute top-0 h-20 w-full rounded-t-lg bg-gradient-to-b from-zinc-900/80 to-transparent"
            />
          )}

          {isEnter && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="absolute right-2 top-2"
            >
              <LibraryTrackButton
                music={music as IMusic}
                userId={user?.id}
                size="sm"
              />
            </motion.div>
          )}

          {(isEnter || isCurrentTrack) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="absolute bottom-2 right-2"
            >
              {isCurrentTrack ? (
                <div className="rounded-full bg-zinc-500/60 px-2 py-0.5 backdrop-blur-sm">
                  <DynamicIslandWave
                    isPlay={isPlaying}
                    coverUrl={music.cover}
                    color={waveColor}
                  />
                </div>
              ) : (
                <Play
                  className="size-10 rounded-full bg-zinc-900/60 p-2 text-rose-500 backdrop-blur-sm"
                  weight="fill"
                />
              )}
            </motion.div>
          )}
        </div>

        <div className="text-black dark:text-white">
          <div
            className="line-clamp-1 w-full cursor-pointer text-sm font-semibold"
            onClick={handlePlay}
          >
            {music.title || "TITLE"}
          </div>

          <div className="line-clamp-1 w-full text-xs text-zinc-500">
            {music.singer || "SINGER"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
