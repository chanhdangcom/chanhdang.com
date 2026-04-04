/* eslint-disable @next/next/no-img-element */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useUser } from "@/hooks/use-user";
import { BorderPro } from "./border-pro";
import { LibraryTrackButton } from "../library/library-track-button";
import { useImageHoverColor } from "@/hooks/use-image-hover-color";
import { cn } from "@/lib/utils";
import { useAudio } from "@/components/music-provider";
import { DynamicIslandWave } from "@/components/ui/dynamic-island";
import { IPlaylistItem } from "../type/playlist";
import {
  AudioItemContextMenu,
  useAudioItemContextMenu,
} from "./audio-item-context-menu";

type IProp = {
  music: IMusic | IPlaylistItem;
  handlePlay?: () => void;
  className?: string;
};

const isMusicItem = (item: IMusic | IPlaylistItem): item is IMusic =>
  typeof (item as IMusic).audio === "string" &&
  typeof (item as IMusic).youtube === "string" &&
  typeof (item as IMusic).content === "string";

export function AuidoItem({ music, handlePlay, className }: IProp) {
  const { user } = useUser();
  const { currentMusic, isPlaying } = useAudio();
  const [isEnter, setIsEnter] = useState(false);
  const hoverBg = useImageHoverColor(music.cover, { alpha: 0.3 });
  const isTrack = isMusicItem(music);
  const menu = useAudioItemContextMenu({
    onTap: handlePlay,
    disabled: !isTrack,
  });

  const isCurrentTrack = isTrack && currentMusic?.id === music.id;
  const waveColor = "#f43f5e";

  return (
    <>
      {isTrack && (
        <AudioItemContextMenu
          music={music}
          userId={user?.id}
          open={menu.showMenu}
          cardLayoutId={menu.cardLayoutId}
          isDesktop={menu.isDesktop}
          desktopOverlayPosition={menu.desktopOverlayPosition}
          menuRef={menu.menuRef}
          overlayRef={menu.overlayRef}
          onClose={menu.closeMenu}
          onPlay={handlePlay}
        />
      )}

      <motion.div
        layoutId={menu.cardLayoutId}
        animate={{ scale: menu.showMenu ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{
          opacity: menu.showMenu ? 0 : 1,
          pointerEvents: menu.showMenu ? "none" : undefined,
        }}
        className={cn(
          "relative isolate",
          menu.showMenu
            ? "z-[90]"
            : isEnter
              ? "z-30"
              : isCurrentTrack
                ? "z-20"
                : "z-10",
          menu.showMenu
            ? "saturate-110 rounded-xl bg-zinc-300 brightness-105 dark:bg-zinc-900"
            : ""
        )}
      >
        <div
          ref={menu.rootRef}
          onMouseEnter={() => setIsEnter(true)}
          onMouseLeave={() => setIsEnter(false)}
          onPointerDown={menu.handlePointerDown}
          onPointerUp={menu.handlePointerUp}
          onPointerLeave={menu.handlePointerLeave}
          onContextMenu={menu.handleContextMenu}
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
              <div className="relative">
                {isCurrentTrack && !menu.showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeIn" }}
                    className="pointer-events-none absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-zinc-900/60"
                  >
                    <DynamicIslandWave
                      isPlay={isPlaying}
                      coverUrl={music.cover}
                      color={waveColor}
                    />
                  </motion.div>
                )}

                <BorderPro roundedSize="rounded-lg">
                  <img
                    src={music.cover}
                    alt="cover"
                    className="mx-auto size-44 shrink-0 cursor-pointer justify-center rounded-lg object-cover md:size-52"
                    onClick={handlePlay}
                  />
                </BorderPro>
              </div>
            ) : (
              <div
                className="size-40 cursor-pointer rounded-xl bg-zinc-800"
                onClick={handlePlay}
              />
            )}

            {isTrack && isEnter && !menu.showMenu && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeIn" }}
                className="pointer-events-none absolute top-0 h-20 w-full rounded-t-lg bg-gradient-to-b from-zinc-900/80 to-transparent"
              />
            )}

            {isTrack && isEnter && !menu.showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeIn" }}
                className="absolute right-2 top-2"
              >
                <LibraryTrackButton music={music} userId={user?.id} size="sm" />
              </motion.div>
            )}
          </div>

          <div className="font-apple text-black dark:text-white">
            <div
              className="line-clamp-1 w-full cursor-pointer font-apple text-sm font-semibold"
              onClick={handlePlay}
            >
              {music.title || "TITLE"}
            </div>

            <div className="line-clamp-1 w-full font-apple text-xs text-zinc-500">
              {music.singer || "SINGER"}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
