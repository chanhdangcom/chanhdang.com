/* eslint-disable @next/next/no-img-element */

"use client";

import { useUser } from "@/hooks/use-user";
import { useEffect, useRef, useState } from "react";
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
import {
  Export,
  ListPlus,
  PlusCircle,
  Queue,
  Shuffle,
  Star,
} from "@phosphor-icons/react/dist/ssr";

type IProp = {
  music: IMusic | IPlaylistItem;
  handlePlay?: () => void;
  className?: string;
};

export function AuidoItem({ music, handlePlay, className }: IProp) {
  const { user } = useUser();
  const { currentMusic, isPlaying, queue, setQueue, handlePlayRandomAudio } =
    useAudio();

  const [isEnter, setIsEnter] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const longPressTimerRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hoverBg = useImageHoverColor(music?.cover, { alpha: 0.3 });
  const isCurrentTrack =
    typeof (music as IMusic).audio === "string" &&
    currentMusic?.id === music?.id;
  const waveColor = "#f43f5e";

  const track = music as IMusic;
  const activeScale = showMenu ? (isMobile ? 1.3 : 1.2) : 1;

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handlePointerDown = () => {
    clearLongPressTimer();
    longPressTimerRef.current = window.setTimeout(() => {
      setShowMenu(true);
    }, 500);
  };

  const handlePointerUpOrLeave = () => {
    clearLongPressTimer();
  };

  const handleAddToQueue = () => {
    setQueue([...queue, track]);
    setShowMenu(false);
  };

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  useEffect(() => {
    if (!showMenu) return;

    const handleGlobalPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      const clickedInsideRoot = !!(
        rootRef.current &&
        target &&
        rootRef.current.contains(target)
      );
      const clickedInsideMenu = !!(
        menuRef.current &&
        target &&
        menuRef.current.contains(target)
      );

      if (!clickedInsideRoot && !clickedInsideMenu) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleGlobalPointerDown);
    document.addEventListener("touchstart", handleGlobalPointerDown);

    return () => {
      document.removeEventListener("mousedown", handleGlobalPointerDown);
      document.removeEventListener("touchstart", handleGlobalPointerDown);
    };
  }, [showMenu]);

  return (
    <>
      <motion.div
        animate={{ scale: activeScale }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        layout
        style={{
          position: isMobile && showMenu ? "fixed" : "relative",
          left: isMobile && showMenu ? "50%" : undefined,
          top: isMobile && showMenu ? "40px" : undefined,
          marginLeft: isMobile && showMenu ? "-88px" : undefined,
        }}
        className={cn(
          "relative isolate",
          showMenu
            ? "z-[90]"
            : isEnter
              ? "z-30"
              : isCurrentTrack
                ? "z-20"
                : "z-10",
          showMenu ? "rounded-xl bg-zinc-300 dark:bg-zinc-900" : ""
        )}
      >
        <div
          ref={rootRef}
          onMouseEnter={() => setIsEnter(true)}
          onMouseLeave={() => setIsEnter(false)}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
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

            {isEnter && !showMenu && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeIn" }}
                className="pointer-events-none absolute top-0 h-20 w-full rounded-t-lg bg-gradient-to-b from-zinc-900/80 to-transparent"
              />
            )}

            {isEnter && !showMenu && (
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

            {(isEnter || isCurrentTrack) && !showMenu && (
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

            {showMenu && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                ref={menuRef}
                className="absolute top-[calc(100%+52px)] z-[100] w-fit -translate-x-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-zinc-500/40 p-4 text-xs text-black shadow-xl backdrop-blur-xl dark:bg-zinc-950/60 dark:text-white md:-left-3 md:top-1/2 md:w-full md:-translate-x-full md:-translate-y-1/2"
              >
                <div className="flex justify-between gap-8 border-b border-white/10 pb-4">
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <PlusCircle size={18} weight="fill" />

                    <div className="text-xs font-medium">Add</div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <Star size={18} weight="fill" />

                    <div className="text-xs font-medium">Favorite</div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <Export size={18} weight="fill" />

                    <div className="text-xs font-medium">Share</div>
                  </div>
                </div>

                <div className="space-y-2 border-b border-white/10 py-2">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-xl text-left text-sm hover:bg-zinc-800"
                    onClick={handleAddToQueue}
                  >
                    <Play size={16} weight="regular" className="" />

                    <span className="font-medium">Play</span>
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-xl text-left text-sm hover:bg-zinc-800"
                    onClick={handlePlayRandomAudio}
                  >
                    <Shuffle size={16} weight="regular" className="" />

                    <span className="font-medium"> Shuffle</span>
                  </button>
                </div>

                <div className="border-b border-white/10 py-2">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-xl text-left text-sm hover:bg-zinc-800"
                    onClick={handleAddToQueue}
                  >
                    <ListPlus size={16} weight="regular" className="" />

                    <span className="font-medium">Add to a Playlist</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-xl text-left text-sm hover:bg-zinc-800"
                    onClick={handleAddToQueue}
                  >
                    <Queue size={16} weight="regular" className="" />

                    <span className="font-medium">Add to Queue</span>
                  </button>
                </div>
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
