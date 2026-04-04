/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "phosphor-react";
import {
  Export,
  ListPlus,
  PlusCircle,
  Queue,
  Shuffle,
  ThumbsDown,
} from "@phosphor-icons/react/dist/ssr";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { BorderPro } from "./border-pro";
import { LibraryTrackButton } from "../library/library-track-button";
import { cn } from "@/lib/utils";
import { useAudio } from "@/components/music-provider";

type UseAudioItemContextMenuOptions = {
  onTap?: () => void;
  disabled?: boolean;
};

export function useAudioItemContextMenu({
  onTap,
  disabled = false,
}: UseAudioItemContextMenuOptions = {}) {
  const instanceId = useId();
  const [showMenu, setShowMenu] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [desktopOverlayPosition, setDesktopOverlayPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const didOpenMenuRef = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const closeMenu = useCallback(() => {
    clearLongPressTimer();
    didOpenMenuRef.current = false;
    setShowMenu(false);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled) return;

    event.preventDefault();
    clearLongPressTimer();
    didOpenMenuRef.current = false;
    longPressTimerRef.current = window.setTimeout(() => {
      didOpenMenuRef.current = true;
      setShowMenu(true);
    }, 500);
  };

  const handlePointerUp = () => {
    if (disabled) return;

    clearLongPressTimer();
    if (!didOpenMenuRef.current) {
      onTap?.();
    }
    didOpenMenuRef.current = false;
  };

  const handlePointerLeave = () => {
    if (disabled) return;
    clearLongPressTimer();
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    event.preventDefault();
    clearLongPressTimer();
    didOpenMenuRef.current = true;
    setShowMenu(true);
  };

  useEffect(() => {
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    updateIsDesktop();
    window.addEventListener("resize", updateIsDesktop);

    return () => {
      window.removeEventListener("resize", updateIsDesktop);
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
      const clickedInsideOverlay = !!(
        overlayRef.current &&
        target &&
        overlayRef.current.contains(target)
      );

      if (!clickedInsideRoot && !clickedInsideMenu && !clickedInsideOverlay) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleGlobalPointerDown);
    document.addEventListener("touchstart", handleGlobalPointerDown);

    return () => {
      document.removeEventListener("mousedown", handleGlobalPointerDown);
      document.removeEventListener("touchstart", handleGlobalPointerDown);
    };
  }, [showMenu, closeMenu]);

  useEffect(() => {
    if (!showMenu) {
      setDesktopOverlayPosition(null);
      return;
    }

    const updateDesktopOverlayPosition = () => {
      const rect = rootRef.current?.getBoundingClientRect();

      if (!rect || window.innerWidth < 768) {
        setDesktopOverlayPosition(null);
        return;
      }

      setDesktopOverlayPosition({
        left: rect.left,
        top: rect.top,
      });
    };

    updateDesktopOverlayPosition();
    window.addEventListener("resize", updateDesktopOverlayPosition);
    document.addEventListener("scroll", updateDesktopOverlayPosition, true);

    return () => {
      window.removeEventListener("resize", updateDesktopOverlayPosition);
      document.removeEventListener(
        "scroll",
        updateDesktopOverlayPosition,
        true
      );
    };
  }, [showMenu]);

  return {
    cardLayoutId: `audio-item-context-${instanceId}`,
    showMenu,
    isDesktop,
    desktopOverlayPosition,
    rootRef,
    menuRef,
    overlayRef,
    closeMenu,
    handlePointerDown,
    handlePointerUp,
    handlePointerLeave,
    handleContextMenu,
  };
}

type AudioItemContextMenuProps = {
  music: IMusic;
  userId?: string;
  open: boolean;
  cardLayoutId?: string;
  isDesktop: boolean;
  desktopOverlayPosition: { left: number; top: number } | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onPlay?: () => void;
};

export function AudioItemContextMenu({
  music,
  userId,
  open,
  cardLayoutId,
  isDesktop,
  desktopOverlayPosition,
  menuRef,
  overlayRef,
  onClose,
  onPlay,
}: AudioItemContextMenuProps) {
  const { queue, setQueue, handlePlayRandomAudio } = useAudio();

  if (typeof document === "undefined") {
    return null;
  }

  const handlePlayClick = () => {
    onPlay?.();
    onClose();
  };

  const handleAddToQueue = () => {
    setQueue([...queue, music]);
    onClose();
  };

  const handleShuffle = () => {
    handlePlayRandomAudio();
    onClose();
  };

  const handleShare = async () => {
    const shareText = `${music.title || "Track"} - ${music.singer || "Unknown singer"}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: music.title || "Track",
          text: shareText,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }
    } catch {
      // Ignore share cancellation/errors.
    } finally {
      onClose();
    }
  };

  const handlePlaceholderAction = () => {
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            "fixed inset-0 z-[120]",
            isDesktop
              ? "bg-black/15 backdrop-blur-[2px]"
              : "bg-black/45 backdrop-blur-[4px]"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isDesktop ? 0.12 : 0.2, ease: "easeOut" }}
        >
          <div
            ref={overlayRef}
            className={cn(
              "pointer-events-auto absolute flex flex-col items-center",
              isDesktop ? "" : "left-1/2 top-28 -translate-x-1/2"
            )}
            style={
              isDesktop && desktopOverlayPosition
                ? {
                    left: desktopOverlayPosition.left,
                    top: desktopOverlayPosition.top,
                  }
                : undefined
            }
          >
            <motion.div
              layoutId={cardLayoutId}
              transition={{
                type: "spring",
                stiffness: isDesktop ? 420 : 320,
                damping: isDesktop ? 38 : 32,
                mass: isDesktop ? 0.7 : 1,
              }}
              className="rounded-xl bg-zinc-300 dark:bg-zinc-900"
            >
              <div className="w-44 space-y-1 rounded-xl p-1.5 text-zinc-50 md:w-52">
                <div className="relative">
                  {music.cover ? (
                    <BorderPro roundedSize="rounded-lg">
                      <img
                        src={music.cover}
                        alt="cover"
                        className="mx-auto size-44 shrink-0 cursor-pointer justify-center rounded-lg object-cover md:size-52"
                        onClick={handlePlayClick}
                      />
                    </BorderPro>
                  ) : (
                    <div
                      className="size-40 cursor-pointer rounded-xl bg-zinc-800 md:size-52"
                      onClick={handlePlayClick}
                    />
                  )}
                </div>

                <div className="font-apple text-black dark:text-white">
                  <div
                    className="line-clamp-1 w-full cursor-pointer font-apple text-sm font-semibold"
                    onClick={handlePlayClick}
                  >
                    {music.title || "TITLE"}
                  </div>

                  <div className="line-clamp-1 w-full font-apple text-xs text-zinc-500">
                    {music.singer || "SINGER"}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isDesktop ? 10 : 0, y: isDesktop ? 0 : 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: isDesktop ? 6 : 0, y: isDesktop ? 0 : 6 }}
              transition={{ duration: isDesktop ? 0.14 : 0.22, ease: "easeOut" }}
              ref={menuRef}
              className={cn(
                "z-[130] max-h-[calc(100dvh-320px)] w-full overflow-y-auto rounded-3xl border border-white/15 bg-white/70 px-4 py-2 pb-4 text-black shadow-2xl backdrop-blur-md dark:bg-zinc-950/70 dark:text-white",
                isDesktop
                  ? "absolute right-[calc(100%+8px)] top-1/2 mt-0 -translate-y-1/2"
                  : "mt-2"
              )}
            >
          <div className="flex justify-between gap-8 border-b border-black/10 px-2 py-2 pb-4 dark:border-white/10">
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-0.5"
              onClick={handleAddToQueue}
            >
              <PlusCircle size={18} weight="fill" />
              <div className="text-xs font-medium">Add</div>
            </button>

            <div className="flex flex-col items-center justify-center gap-0.5">
              <LibraryTrackButton music={music} userId={userId} size="sm" />
              <div className="text-xs font-medium">Favorite</div>
            </div>

            <button
              type="button"
              className="flex flex-col items-center justify-center gap-0.5"
              onClick={handleShare}
            >
              <Export size={18} weight="fill" />
              <div className="text-xs font-medium">Share</div>
            </button>
          </div>

          <div className="space-y-4 border-b border-black/10 py-2 dark:border-white/10">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl text-left text-sm hover:bg-zinc-800/5 dark:hover:bg-white/5"
              onClick={handlePlayClick}
            >
              <Play size={16} weight="regular" />
              <span className="font-medium">Play</span>
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl text-left text-sm hover:bg-zinc-800/5 dark:hover:bg-white/5"
              onClick={handleShuffle}
            >
              <Shuffle size={16} weight="regular" />
              <span className="font-medium">Shuffle</span>
            </button>
          </div>

          <div className="border-b border-black/10 py-4 dark:border-white/10">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl text-left text-sm hover:bg-zinc-800/5 dark:hover:bg-white/5"
              onClick={handlePlaceholderAction}
            >
              <ListPlus size={16} weight="regular" />
              <span className="font-medium">Add to a Playlist</span>
            </button>
          </div>

          <div className="border-b border-black/10 py-4 dark:border-white/10">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl text-left text-sm hover:bg-zinc-800/5 dark:hover:bg-white/5"
              onClick={handleAddToQueue}
            >
              <Queue size={16} weight="regular" />
              <span className="font-medium">Add to Queue</span>
            </button>
          </div>

          <div className="pt-4">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl text-left text-sm hover:bg-zinc-800/5 dark:hover:bg-white/5"
              onClick={handlePlaceholderAction}
            >
              <ThumbsDown size={16} weight="regular" />
              <span className="font-medium">Suggest Less</span>
            </button>
          </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
