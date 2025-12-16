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
import { PlayerPage } from "./player-page";
import { useOutsideClick } from "@/app/[locale]/features/profile/hook/use-outside-click";
import { useAudio } from "@/components/music-provider";
import { BorderPro } from "./component/border-pro";

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
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsClick(false), isClick);

  const [scroll, setScroll] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDir = useRef<"up" | "down" | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const ticking = useRef(false);
  const [reactToScroll, setReactToScroll] = useState(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY.current;
        const threshold = 20; // Ngưỡng scroll để trigger
        const scrollOffset = 100; // Offset từ top để tự động hiện

        // Tự động hiện khi scroll về đầu trang
        if (currentScrollY < scrollOffset) {
          if (!scroll) {
            setScroll(true);
            scrollDir.current = "up";
          }
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
            setScroll(false);
            scrollDir.current = "down";
          } else if (delta < -threshold && scrollDir.current !== "up") {
            setScroll(true);
            scrollDir.current = "up";
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false; // Chỉ set false khi timeout hoàn thành
        }, 150); // Debounce 150ms để mượt hơn
      });

      ticking.current = true;
    }
  }, [scroll]);

  // Enable scroll-based behavior only on mobile (<768px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => {
      if (mq.matches) {
        // Desktop → ignore scroll and keep shown
        setReactToScroll(false);
        setScroll(true);
      } else {
        // Mobile → react to scroll
        setReactToScroll(true);
      }
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!reactToScroll) return; // only attach on mobile
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      ticking.current = false;
    };
  }, [handleScroll, reactToScroll]);

  if (isClick) return <PlayerPage setIsClick={() => setIsClick(false)} />;

  return (
    <motion.div
      layoutId="audio-bar"
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeIn",
        layout: { duration: 0.2, ease: "easeInOut" },
      }}
      className={`fixed z-50 flex justify-center md:inset-x-[25vw] md:bottom-4 ${
        scroll ? "inset-x-2 bottom-[82px]" : "inset-x-20 bottom-6"
      }`}
    >
      <div className="relative overflow-hidden rounded-[50px] border border-white/20 bg-zinc-200/70 px-3 py-1 backdrop-blur-sm dark:bg-zinc-900/70 md:rounded-[55px]">
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
            <motion.div
              whileTap={{ opacity: 0.6 }}
              transition={{ duration: 0.15 }}
            >
              <Shuffle
                onClick={(e) => {
                  if (!scroll) e.stopPropagation();
                  handlePlayRandomAudio();
                }}
                size={18}
                weight="bold"
                className="cursor-pointer text-zinc-500"
              />
            </motion.div>

            <motion.div
              whileTap={{ opacity: 0.6 }}
              transition={{ duration: 0.15 }}
            >
              <Rewind
                size={25}
                onClick={(e) => {
                  if (!scroll) e.stopPropagation();
                  handAudioForward();
                }}
                weight="fill"
                className="cursor-pointer"
              />
            </motion.div>
            {isPlaying ? (
              <motion.div
                whileTap={{ opacity: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <Pause
                  onClick={(e) => {
                    if (!scroll) e.stopPropagation();
                    handlePauseAudio();
                  }}
                  weight="fill"
                  size={30}
                  className="cursor-pointer"
                />
              </motion.div>
            ) : (
              <motion.div
                whileTap={{ opacity: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <Play
                  onClick={(e) => {
                    if (!scroll) e.stopPropagation();
                    handleResumeAudio();
                  }}
                  weight="fill"
                  size={25}
                  className="cursor-pointer"
                />
              </motion.div>
            )}
            <motion.div
              whileTap={{ opacity: 0.6 }}
              transition={{ duration: 0.15 }}
            >
              <FastForward
                onClick={(e) => {
                  if (!scroll) e.stopPropagation();
                  handleAudioSkip();
                }}
                weight="fill"
                size={25}
                className="cursor-pointer"
              />
            </motion.div>

            <div onClick={handleToggleRepeat}>
              {isRepeat ? <RepeatOnce size={18} /> : <Repeat size={18} />}
            </div>
          </div>

          <div className="flex w-[700px] items-center justify-start gap-2 md:ml-6 md:gap-2">
            {!currentMusic?.cover ? (
              <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-900 md:rounded-lg">
                <MusicNotes size={20} weight="fill" className="text-white" />
              </div>
            ) : (
              <div className="shrink-0">
                <BorderPro roundedSize="rounded-xl">
                  <img
                    src={currentMusic?.cover}
                    alt="cover"
                    className="flex size-10 items-center justify-center rounded-xl object-cover md:rounded-lg"
                  />
                </BorderPro>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div>
                <motion.div
                  key={currentMusic?.title || "default-title"}
                  layoutId="title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-semibold text-black dark:text-white"
                >
                  {scroll ? (
                    <span className="line-clamp-1">
                      {currentMusic?.title || "Title Song"}
                    </span>
                  ) : (
                    <span className="line-clamp-1">
                      {currentMusic?.title || "Title Song"}
                    </span>
                  )}
                </motion.div>

                <motion.div
                  key={currentMusic?.singer || "default-singer"}
                  layoutId="singer-bar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="line-clamp-1 text-sm font-medium text-zinc-500"
                >
                  {currentMusic?.singer || "Singer"}
                </motion.div>
              </div>

              <div className="hidden md:flex">
                <DurationAudio />
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-4 text-black dark:text-white md:flex">
            {isMuted ? (
              <motion.div
                whileTap={{ opacity: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <SpeakerSlash
                  size={20}
                  weight="fill"
                  onClick={(e) => {
                    if (!scroll) e.stopPropagation();
                    handleMute();
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                whileTap={{ opacity: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <SpeakerHigh
                  size={20}
                  weight="fill"
                  onClick={(e) => {
                    if (!scroll) e.stopPropagation();
                    handleMute();
                  }}
                  className="cursor-pointer"
                />
              </motion.div>
            )}

            <motion.div
              whileTap={{ opacity: 0.6 }}
              transition={{ duration: 0.15 }}
              className="mt-1.5"
            >
              <Control
                size={20}
                weight="fill"
                className="cursor-pointer"
                onClick={(e) => {
                  if (!scroll) e.stopPropagation();
                  setIsClick(true);
                }}
              />
            </motion.div>
          </div>

          <div className="right-2 flex items-center md:hidden md:gap-4">
            {isPlaying ? (
              <motion.div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePauseAudio();
                }}
                whileTap={{ opacity: 0.6 }}
                transition={{ duration: 0.15 }}
                className="mr-2"
              >
                <Pause
                  weight="fill"
                  size={23}
                  className="cursor-pointer text-black dark:text-white"
                />
              </motion.div>
            ) : (
              <motion.div
                onClick={(e) => {
                  e.stopPropagation();
                  handleResumeAudio();
                }}
                whileTap={{ opacity: 0.6 }}
                transition={{ duration: 0.15 }}
                className="mr-2"
              >
                <Play
                  weight="fill"
                  size={23}
                  className="cursor-pointer text-black dark:text-white"
                />
              </motion.div>
            )}

            {scroll && (
              <motion.div
                whileTap={{ opacity: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <FastForward
                  onClick={handleAudioSkip}
                  weight="fill"
                  size={30}
                  className="cursor-pointer text-black dark:text-white"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
