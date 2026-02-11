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
import { Drawer } from "vaul";
import { motion } from "framer-motion";

const PlayerPage = dynamic(
  () => import("./player-page").then((mod) => mod.PlayerPage),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-3xl" />
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
  const [shouldRenderPlayer, setShouldRenderPlayer] = useState(false);
  const tapFeedbackClass =
    "cursor-pointer transition-opacity duration-150 active:opacity-60";
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleMeasureRef = useRef<HTMLSpanElement>(null);
  const [shouldMarqueeTitle, setShouldMarqueeTitle] = useState(false);
  const playerUnmountTimerRef = useRef<number | null>(null);

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
    if (isClick) {
      if (playerUnmountTimerRef.current !== null) {
        clearTimeout(playerUnmountTimerRef.current);
      }
      setShouldRenderPlayer(true);
      return;
    }

    // Keep mounted briefly so close animation finishes before unmount.
    playerUnmountTimerRef.current = window.setTimeout(() => {
      setShouldRenderPlayer(false);
      playerUnmountTimerRef.current = null;
    }, 220);

    return () => {
      if (playerUnmountTimerRef.current !== null) {
        clearTimeout(playerUnmountTimerRef.current);
        playerUnmountTimerRef.current = null;
      }
    };
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

  useEffect(() => {
    const checkOverflow = () => {
      const container = titleContainerRef.current;
      const text = titleMeasureRef.current;
      if (!container || !text) return;

      setShouldMarqueeTitle(text.scrollWidth > container.clientWidth + 8);
    };

    checkOverflow();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(checkOverflow);
      if (titleContainerRef.current)
        observer.observe(titleContainerRef.current);
      if (titleMeasureRef.current) observer.observe(titleMeasureRef.current);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [currentMusic?.title, scroll]);

  useEffect(() => {
    return () => {
      if (playerUnmountTimerRef.current !== null) {
        clearTimeout(playerUnmountTimerRef.current);
      }
    };
  }, []);

  const handleDrawerOpenChange = useCallback((open: boolean) => {
    setIsClick(open);
  }, []);

  return (
    <Drawer.Root
      open={isClick}
      onOpenChange={handleDrawerOpenChange}
      shouldScaleBackground={false}
    >
      <motion.div
        layout
        initial={false}
        animate={{ opacity: 1 }}
        transition={{
          layout: {
            type: "spring",
            stiffness: 380,
            damping: 34,
            mass: 0.7,
          },
          opacity: { duration: 0.12 },
        }}
        className={`fixed z-50 flex justify-center md:inset-x-[25vw] md:bottom-4 ${
          scroll ? "inset-x-4 bottom-[88px]" : "inset-x-24 bottom-[32px]"
        }`}
      >
        <div className="bg-zinc-200/72 dark:bg-zinc-900/72 relative w-full overflow-hidden rounded-[50px] border border-white/20 px-3 py-1 shadow-[0_16px_34px_-14px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.55)_inset,0_-1px_0_rgba(0,0,0,0.06)_inset] backdrop-blur-lg dark:border-white/10 dark:shadow-[0_18px_38px_-14px_rgba(0,0,0,0.78),0_1px_0_rgba(255,255,255,0.12)_inset,0_-1px_0_rgba(0,0,0,0.45)_inset] md:rounded-[55px]">
          <div className="via-white/8 dark:from-white/12 pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 to-transparent dark:via-transparent dark:to-transparent" />
          <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-black/10 dark:bg-white/10" />
          <div
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsClick(true);
              }
            }}
            className={`relative z-10 flex w-full items-center justify-between ${
              scroll ? "" : "cursor-pointer"
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

              <div
                onClick={handleToggleRepeat}
                className={`${tapFeedbackClass} text-zinc-500`}
              >
                {isRepeat ? (
                  <RepeatOnce size={18} weight="bold" />
                ) : (
                  <Repeat size={18} weight="bold" />
                )}
              </div>
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-start gap-2 pr-1 md:ml-6 md:gap-2">
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
                      className="flex size-8 transform-gpu items-center justify-center rounded-lg object-cover [backface-visibility:hidden] md:rounded-lg"
                    />
                  </BorderPro>
                </div>
              )}

              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div
                    ref={titleContainerRef}
                    className="relative w-full overflow-hidden whitespace-nowrap text-sm font-semibold text-black dark:text-white"
                  >
                    <span
                      ref={titleMeasureRef}
                      className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
                    >
                      {currentMusic?.title || "Title Song"}
                    </span>

                    {shouldMarqueeTitle ? (
                      <motion.div
                        className="flex w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "loop",
                          duration: 18,
                          ease: "linear",
                        }}
                      >
                        <span className="pr-4">
                          {currentMusic?.title || "Title Song"}
                        </span>

                        <span aria-hidden="true" className="pr-4">
                          {currentMusic?.title || "Title Song"}
                        </span>
                      </motion.div>
                    ) : (
                      <span className="block truncate">
                        {currentMusic?.title || "Title Song"}
                      </span>
                    )}
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

            <div className="right-2 z-10 ml-0.5 flex shrink-0 items-center md:hidden md:gap-4">
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

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/65" />

        <Drawer.Content
          className="fixed inset-x-0 bottom-0 z-50 h-screen border-none bg-transparent p-0 outline-none"
          style={{
            contain: "layout paint size",
            willChange: isClick ? "transform" : "auto",
          }}
        >
          <Drawer.Title className="sr-only">
            {currentMusic?.title
              ? `Now playing: ${currentMusic.title}`
              : "Music player"}
          </Drawer.Title>

          {shouldRenderPlayer ? (
            <PlayerPage setIsClick={() => setIsClick(false)} />
          ) : null}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
