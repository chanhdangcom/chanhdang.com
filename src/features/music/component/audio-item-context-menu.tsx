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
  onOpenMenu?: () => void;
  disabled?: boolean;
};

type MenuPlacement = {
  desktopSide: "left" | "right";
  desktopMenuTop: number;
  mobileTop: number;
};

export function useAudioItemContextMenu({
  onTap,
  onOpenMenu,
  disabled = false,
}: UseAudioItemContextMenuOptions = {}) {
  const instanceId = useId();
  const [showMenu, setShowMenu] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [desktopOverlayPosition, setDesktopOverlayPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [menuPlacement, setMenuPlacement] = useState<MenuPlacement>({
    desktopSide: "left",
    desktopMenuTop: 0,
    mobileTop: 112,
  });
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

  const openMenu = useCallback(() => {
    requestAnimationFrame(() => {
      onOpenMenu?.();
    });

    clearLongPressTimer();
    didOpenMenuRef.current = true;
    setShowMenu(true);
  }, [onOpenMenu]);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled) return;

    event.preventDefault();
    clearLongPressTimer();
    didOpenMenuRef.current = false;
    longPressTimerRef.current = window.setTimeout(() => {
      openMenu();
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
    openMenu();
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
      const menuRect = menuRef.current?.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const viewportPadding = 16;
      const gap = 8;

      if (!rect) {
        setDesktopOverlayPosition(null);
        return;
      }

      if (viewportWidth < 768) {
        const estimatedMenuHeight = menuRect?.height ?? 360;
        const estimatedCardHeight = rect.height || 208;
        const overlayHeight = estimatedCardHeight + gap + estimatedMenuHeight;
        const desiredTop = rect.top - 24;
        const maxTop = Math.max(
          viewportPadding,
          viewportHeight - overlayHeight - viewportPadding
        );

        setMenuPlacement((prev) => ({
          ...prev,
          mobileTop: Math.max(viewportPadding, Math.min(desiredTop, maxTop)),
        }));
        setDesktopOverlayPosition(null);
        return;
      }

      const menuWidth = menuRect?.width ?? 320;
      const menuHeight = menuRect?.height ?? 320;
      const canPlaceLeft = rect.left - gap - menuWidth >= viewportPadding;
      const canPlaceRight =
        rect.right + gap + menuWidth <= viewportWidth - viewportPadding;
      const desktopSide = canPlaceLeft || !canPlaceRight ? "left" : "right";

      const desiredMenuTop = rect.top + rect.height / 2 - menuHeight / 2;
      const maxMenuTop = Math.max(
        viewportPadding,
        viewportHeight - menuHeight - viewportPadding
      );
      const clampedMenuTop = Math.max(
        viewportPadding,
        Math.min(desiredMenuTop, maxMenuTop)
      );

      setDesktopOverlayPosition({
        left: rect.left,
        top: rect.top,
      });
      setMenuPlacement({
        desktopSide,
        desktopMenuTop: clampedMenuTop - rect.top,
        mobileTop: 112,
      });
    };

    const rafId = window.requestAnimationFrame(updateDesktopOverlayPosition);
    window.addEventListener("resize", updateDesktopOverlayPosition);
    document.addEventListener("scroll", updateDesktopOverlayPosition, true);

    return () => {
      window.cancelAnimationFrame(rafId);
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
    menuPlacement,
    rootRef,
    menuRef,
    overlayRef,
    openMenu,
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
  menuPlacement: MenuPlacement;
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
  menuPlacement,
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
              ? "bg-black/45 backdrop-blur-sm"
              : "bg-black/45 backdrop-blur-sm"
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
              isDesktop
                ? desktopOverlayPosition
                  ? {
                      left: desktopOverlayPosition.left,
                      top: desktopOverlayPosition.top,
                    }
                  : undefined
                : {
                    top: menuPlacement.mobileTop,
                  }
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
              <div className="w-52 space-y-1 rounded-xl p-1.5 text-zinc-50">
                <div className="relative">
                  {music.cover ? (
                    <BorderPro roundedSize="rounded-lg">
                      <img
                        src={music.cover}
                        alt="cover"
                        className="mx-auto size-52 shrink-0 cursor-pointer justify-center rounded-lg object-cover"
                        onClick={handlePlayClick}
                      />
                    </BorderPro>
                  ) : (
                    <div
                      className="size-52 cursor-pointer rounded-xl bg-zinc-800"
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
              initial={{
                opacity: 0,
                x: isDesktop ? 10 : 0,
                y: isDesktop ? 0 : 8,
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: isDesktop ? 6 : 0, y: isDesktop ? 0 : 6 }}
              transition={{
                duration: isDesktop ? 0.14 : 0.22,
                ease: "easeOut",
              }}
              ref={menuRef}
              className={cn(
                "z-[130] max-h-[calc(100dvh-320px)] w-full overflow-y-auto rounded-3xl border border-white/15 bg-white/70 px-4 py-2 pb-4 text-black shadow-2xl backdrop-blur-md dark:bg-zinc-950/70 dark:text-white",
                isDesktop
                  ? menuPlacement.desktopSide === "left"
                    ? "absolute right-[calc(100%+8px)] mt-0"
                    : "absolute left-[calc(100%+8px)] mt-0"
                  : "mt-2"
              )}
              style={
                isDesktop
                  ? {
                      top: menuPlacement.desktopMenuTop,
                    }
                  : undefined
              }
            >
              <div className="flex items-end justify-between gap-8 border-b border-black/10 px-1 py-4 dark:border-white/10">
                <button
                  type="button"
                  className="flex flex-col items-center justify-center"
                  onClick={handleAddToQueue}
                >
                  <PlusCircle size={28} weight="fill" />

                  <div className="text-xs font-medium">Add</div>
                </button>

                <div className="flex flex-col items-center justify-center gap-0.5">
                  <LibraryTrackButton music={music} userId={userId} size="sm" />

                  <div className="text-xs font-medium">Favorite</div>
                </div>

                <button
                  type="button"
                  className="flex flex-col items-center justify-center"
                  onClick={handleShare}
                >
                  <Export size={28} weight="fill" />

                  <div className="text-xs font-medium">Share</div>
                </button>
              </div>

              <div className="space-y-2 border-b border-black/10 py-1 dark:border-white/10">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl p-1 text-left text-sm hover:bg-zinc-800/5 dark:hover:bg-white/5"
                  onClick={handlePlayClick}
                >
                  <Play size={16} weight="regular" />

                  <span className="font-medium">Play</span>
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl p-1 text-left text-sm hover:bg-zinc-800/5 dark:hover:bg-white/5"
                  onClick={handleShuffle}
                >
                  <Shuffle size={16} weight="regular" />

                  <span className="font-medium">Shuffle</span>
                </button>
              </div>

              <div className="border-b border-black/10 py-2 dark:border-white/10">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl p-1 text-left text-sm hover:bg-zinc-800/5 dark:hover:bg-white/5"
                  onClick={handlePlaceholderAction}
                >
                  <ListPlus size={16} weight="regular" />

                  <span className="font-medium">Add to a Playlist</span>
                </button>
              </div>

              <div className="border-b border-black/10 py-2 dark:border-white/10">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl p-1 text-left text-sm hover:bg-zinc-800/5 dark:hover:bg-white/5"
                  onClick={handleAddToQueue}
                >
                  <Queue size={16} weight="regular" />

                  <span className="font-medium">Add to Queue</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl p-1 text-left text-sm hover:bg-zinc-800/5 dark:hover:bg-white/5"
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
