/* eslint-disable @next/next/no-img-element */
"use client";
import {
  FastForward,
  MusicNotes,
  Pause,
  Play,
  Repeat,
  Rewind,
  Shuffle,
} from "phosphor-react";

import { motion } from "motion/react";
import { DurationAudio } from "./component/duration-audio";
import {
  Control,
  RepeatOnce,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react/dist/ssr";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "@/components/music-provider";
import { BorderPro } from "./component/border-pro";
import dynamic from "next/dynamic";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

const PlayerPage = dynamic(
  () => import("./player-page").then((mod) => mod.PlayerPage),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-xl" />
    ),
  }
);

export function AudioBar() {
  const {
    currentMusic,
    isPlaying,
    isMuted,
    handlePlayRandomAudio,
    handleResumeAudio,
    handlePauseAudio,
    handleAudioSkip,
    handAudioForward,
    handleMute,
    handleToggleRepeat,
    isRepeat,
  } = useAudio();

  const [isClick, setIsClick] = useState(false);

  const [scroll, setScroll] = useState(true);
  const scrollStateRef = useRef(true);
  const lastScrollY = useRef(0);
  const scrollDir = useRef<"up" | "down" | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const ticking = useRef(false);
  const [reactToScroll, setReactToScroll] = useState(false);
  const [hasOpenedPlayerPage, setHasOpenedPlayerPage] = useState(false);
  const tapFeedbackClass = "cursor-pointer transition-opacity duration-150 active:opacity-60";

  const updateScrollVisibility = useCallback((isVisible: boolean) => {
    if (scrollStateRef.current === isVisible) return;
    scrollStateRef.current = isVisible;
    setScroll(isVisible);
  }, []);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY.current;
        const threshold = 20; // Ngưỡng scroll để trigger
        const scrollOffset = 100; // Offset từ top để tự động hiện

        // Tự động hiện khi scroll về đầu trang
        if (currentScrollY < scrollOffset) {
          updateScrollVisibility(true);
          scrollDir.current = "up";
          lastScrollY.current = currentScrollY;
          ticking.current = false;
          return;
        }

        // Chỉ xử lý khi scroll đủ lớn
        if (Math.abs(delta) < threshold) {
          lastScrollY.current = currentScrollY;
          ticking.current = false;
          return;
        }

        // Clear timeout cũ
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }

        // Debounce để tránh toggle quá nhanh
        timeoutRef.current = window.setTimeout(() => {
          if (delta > threshold && scrollDir.current !== "down") {
            updateScrollVisibility(false);
            scrollDir.current = "down";
          } else if (delta < -threshold && scrollDir.current !== "up") {
            updateScrollVisibility(true);
            scrollDir.current = "up";
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false; // Chỉ set false khi timeout hoàn thành
        }, 150); // Debounce 150ms để mượt hơn
      });

      ticking.current = true;
    }
  }, [updateScrollVisibility]);

  // Enable scroll-based behavior only on mobile (<768px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => {
      if (mq.matches) {
        // Desktop → ignore scroll and keep shown
        setReactToScroll(false);
        updateScrollVisibility(true);
      } else {
        // Mobile → react to scroll
        setReactToScroll(true);
        lastScrollY.current = window.scrollY;
      }
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [updateScrollVisibility]);

  useEffect(() => {
    if (!isClick) return;
    setHasOpenedPlayerPage(true);
  }, [isClick]);

  useEffect(() => {
    const preloadPlayer = () => {
      void import("./player-page");
    };

    const win = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const isLowBandwidth =
      connection?.saveData || connection?.effectiveType === "2g";

    // Avoid eager preload on low bandwidth mobile networks.
    if (isLowBandwidth) return;

    if (typeof win.requestIdleCallback === "function") {
      const idleId = win.requestIdleCallback(preloadPlayer, { timeout: 1500 });
      return () => {
        if (typeof win.cancelIdleCallback === "function") {
          win.cancelIdleCallback(idleId);
        }
      };
    }

    const timeoutId = setTimeout(preloadPlayer, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!reactToScroll) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      ticking.current = false;
    };
  }, [handleScroll, reactToScroll]);

  return (
    <Drawer
      open={isClick}
      onOpenChange={setIsClick}
      shouldScaleBackground={false}
    >
      <motion.div
        layoutId="audio-bar"
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={`fixed z-50 flex justify-center md:inset-x-[25vw] md:bottom-4 ${
          scroll ? "inset-x-4 bottom-[88px]" : "inset-x-24 bottom-[32px]"
        }`}
      >
        <div className="relative overflow-hidden rounded-[50px] border border-white/10 bg-zinc-200/70 px-3 py-1 backdrop-blur-xl dark:bg-zinc-900/70 md:rounded-[55px]">
          <div
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsClick(true);
              }
            }}
            className={`flex items-center justify-between ${
              scroll ? "" : "w-full cursor-pointer"
            }`}
          >
          <div className="hidden items-center gap-4 text-black dark:text-white md:flex">
            <Shuffle
              onClick={(e) => {
                if (!scroll) e.stopPropagation();
                handlePlayRandomAudio();
              }}
              size={18}
              weight="bold"
              className={`${tapFeedbackClass} text-zinc-500`}
            />

            <Rewind
              size={20}
              onClick={(e) => {
                if (!scroll) e.stopPropagation();
                handAudioForward();
              }}
              weight="fill"
              className={tapFeedbackClass}
            />

            {isPlaying ? (
              <Pause
                onClick={(e) => {
                  if (!scroll) e.stopPropagation();
                  handlePauseAudio();
                }}
                weight="fill"
                size={25}
                className={tapFeedbackClass}
              />
            ) : (
              <Play
                onClick={(e) => {
                  if (!scroll) e.stopPropagation();
                  handleResumeAudio();
                }}
                weight="fill"
                size={25}
                className={tapFeedbackClass}
              />
            )}

            <FastForward
              onClick={(e) => {
                if (!scroll) e.stopPropagation();
                handleAudioSkip();
              }}
              weight="fill"
              size={20}
              className={tapFeedbackClass}
            />

            <div onClick={handleToggleRepeat} className={`${tapFeedbackClass} text-zinc-500`}>
              {isRepeat ? (
                <RepeatOnce size={18} weight="bold" />
              ) : (
                <Repeat size={18} weight="bold" />
              )}
            </div>
          </div>

          <div className="flex w-[700px] items-center justify-start gap-2 md:ml-6 md:gap-2">
            {!currentMusic?.cover ? (
              <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-500 md:rounded-lg">
                <MusicNotes size={18} weight="fill" className="text-white" />
              </div>
            ) : (
              <div className="shrink-0">
                <BorderPro roundedSize="rounded-lg">
                  <img
                    src={currentMusic?.cover}
                    alt="cover"
                    className="flex size-8 items-center justify-center rounded-lg object-cover md:rounded-lg"
                  />
                </BorderPro>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div>
                <div className="line-clamp-1 text-sm font-semibold text-black dark:text-white">
                  {currentMusic?.title || "Title Song"}
                </div>

                <div className="line-clamp-1 text-sm font-medium text-zinc-500">
                  {currentMusic?.singer || "Singer"}
                </div>
              </div>

              <div className="hidden md:flex">
                <DurationAudio />
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-4 text-black dark:text-white md:flex">
            {isMuted ? (
              <SpeakerSlash
                size={20}
                weight="fill"
                onClick={(e) => {
                  if (!scroll) e.stopPropagation();
                  handleMute();
                }}
                className={tapFeedbackClass}
              />
            ) : (
              <SpeakerHigh
                size={20}
                weight="fill"
                onClick={(e) => {
                  if (!scroll) e.stopPropagation();
                  handleMute();
                }}
                className={tapFeedbackClass}
              />
            )}

            <Control
              size={20}
              weight="fill"
              className={`mt-1.5 ${tapFeedbackClass}`}
              onClick={(e) => {
                if (!scroll) e.stopPropagation();
                setIsClick(true);
              }}
            />
          </div>

          <div className="right-2 flex items-center md:hidden md:gap-4">
            {isPlaying ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePauseAudio();
                }}
                className={`mr-2 ${tapFeedbackClass}`}
              >
                <Pause
                  weight="fill"
                  size={23}
                  className="text-black dark:text-white"
                />
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleResumeAudio();
                }}
                className={`mr-2 ${tapFeedbackClass}`}
              >
                <Play
                  weight="fill"
                  size={23}
                  className="text-black dark:text-white"
                />
              </div>
            )}

            {scroll && (
              <div className={tapFeedbackClass}>
                <FastForward
                  onClick={handleAudioSkip}
                  weight="fill"
                  size={23}
                  className="text-black dark:text-white"
                />
              </div>
            )}
          </div>
          </div>
        </div>
      </motion.div>

      <DrawerContent className="h-screen border-none bg-transparent p-0 will-change-transform [&>div:first-child]:hidden">
        <DrawerTitle className="sr-only">
          {currentMusic?.title ? `Now playing: ${currentMusic.title}` : "Music player"}
        </DrawerTitle>
        {hasOpenedPlayerPage ? <PlayerPage setIsClick={() => setIsClick(false)} /> : null}
      </DrawerContent>
    </Drawer>
  );
}
