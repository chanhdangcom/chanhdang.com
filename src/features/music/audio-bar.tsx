"use client";

import { useAudio } from "@/components/music-provider";

import {
  FastForward,
  MusicNotes,
  Pause,
  Play,
  Repeat,
  Rewind,
  Shuffle,
} from "phosphor-react";

import { AnimatePresence, motion } from "motion/react";

import { DurationAudio } from "./component/duration-audio";
import {
  Control,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";
import { PlayerPage } from "./player-page";
import { useOutsideClick } from "../profile/hook/use-outside-click";

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
  } = useAudio();

  const [isClick, setIsClick] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsClick(false), isClick);

  const [scroll, setScroll] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDir = useRef<"up" | "down" | null>(null);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const threshold = 15; // chỉ xử lý nếu chênh lệch đủ lớn
    const delay = 10; // debounce nhẹ để phản ứng mượt hơn

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < threshold) return;

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        if (delta > 0 && scrollDir.current !== "down") {
          setScroll(false); // scroll xuống → ẩn
          scrollDir.current = "down";
        } else if (delta < 0 && scrollDir.current !== "up") {
          setScroll(true); // scroll lên → hiện
          scrollDir.current = "up";
        }

        lastScrollY.current = currentScrollY;
      }, delay);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  const Mini = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          transition={{
            type: "spring",
            duration: 1,
            ease: "easeInOut",
          }}
          layout
          layoutId="audio-bar"
          className="d fixed inset-x-2 bottom-[85px] z-20 flex justify-center rounded-[50px] border border-transparent bg-gradient-to-tl from-transparent to-black/10 px-3 py-1 text-zinc-50 shadow-sm backdrop-blur-sm dark:border-2 dark:to-white/10 md:inset-x-96 md:bottom-4 md:rounded-[55px] md:px-4 md:py-2"
        >
          <div
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsClick(true);
              }
            }}
            className="flex w-full items-center justify-between"
          >
            <div className="hidden items-center gap-4 text-black dark:text-white md:flex">
              <motion.div whileTap={{ scale: 0.5 }}>
                <Shuffle
                  onClick={() => handlePlayRandomAudio()}
                  size={18}
                  weight="bold"
                  className="cursor-pointer text-zinc-500"
                />
              </motion.div>

              <motion.div whileTap={{ scale: 0.5 }}>
                <Rewind
                  size={25}
                  onClick={handAudioForward}
                  weight="fill"
                  className="cursor-pointer"
                />
              </motion.div>
              {isPlaying ? (
                <motion.div whileTap={{ scale: 0.5 }}>
                  <Pause
                    onClick={handlePauseAudio}
                    weight="fill"
                    size={30}
                    className="cursor-pointer"
                  />
                </motion.div>
              ) : (
                <motion.div whileTap={{ scale: 0.5 }}>
                  <Play
                    onClick={handleResumeAudio}
                    weight="fill"
                    size={25}
                    className="cursor-pointer"
                  />
                </motion.div>
              )}
              <motion.div whileTap={{ scale: 0.5 }}>
                <FastForward
                  onClick={handleAudioSkip}
                  weight="fill"
                  size={25}
                  className="cursor-pointer"
                />
              </motion.div>

              <Repeat size={18} weight="bold" className="text-zinc-500" />
            </div>

            <div className="flex w-[700px] items-center justify-start gap-2 md:ml-6 md:gap-2">
              {!currentMusic?.cover ? (
                <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-900 md:rounded-lg">
                  <MusicNotes size={20} weight="fill" className="text-white" />
                </div>
              ) : (
                <div className="shrink-0">
                  {/* <Image
                    alt="cover"
                    width={192}
                    height={192}
                    src={currentMusic?.cover}
                    className="flex size-10 items-center justify-center rounded-xl object-cover md:rounded-lg"
                  /> */}
                  <img
                    src={currentMusic?.cover}
                    alt="cover"
                    className="flex size-10 items-center justify-center rounded-xl object-cover md:rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center gap-4">
                <div>
                  <AnimatePresence>
                    <motion.div
                      layoutId="title"
                      layout
                      className="line-clamp-1 text-sm font-semibold text-black dark:text-white"
                    >
                      {currentMusic?.title || (
                        <motion.div className="text-sm font-semibold">
                          Title Song
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence>
                    <motion.div
                      layoutId="singer-bar"
                      layout
                      className="line-clamp-1 text-sm font-medium text-zinc-500"
                    >
                      {currentMusic?.singer || (
                        <motion.div className="text-sm">Singer</motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="hidden md:flex">
                  <DurationAudio />
                </div>
              </div>

              {/* <div>
                {currentMusic?.cover && (
                  <DynamicIslandWave
                    isPlay={isPlaying}
                    coverUrl={currentMusic?.cover}
                  />
                )}
              </div> */}
            </div>

            <div className="hidden items-center gap-4 text-black dark:text-white md:flex">
              {isMuted ? (
                <motion.div whileTap={{ scale: 0.5 }}>
                  <SpeakerSlash
                    size={20}
                    weight="fill"
                    onClick={() => handleMute()}
                  />
                </motion.div>
              ) : (
                <motion.div whileTap={{ scale: 0.5 }}>
                  <SpeakerHigh
                    size={20}
                    weight="fill"
                    onClick={() => handleMute()}
                    className="cursor-pointer"
                  />
                </motion.div>
              )}

              <motion.div whileTap={{ scale: 0.5 }}>
                <Control
                  size={20}
                  weight="fill"
                  className="cursor-pointer"
                  onClick={() => setIsClick(true)}
                />
              </motion.div>
            </div>

            <div className="ml-4 flex items-center md:hidden md:gap-4">
              {/* <motion.div layout>
                {currentMusic?.cover && (
                  <DynamicIslandWave
                    isPlay={isPlaying}
                    coverUrl={currentMusic?.cover}
                  />
                )}
              </motion.div> */}

              {isPlaying ? (
                <motion.div
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePauseAudio();
                  }}
                  whileTap={{ scale: 0.5 }}
                  className="mr-4"
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
                  whileTap={{ scale: 0.5 }}
                  className="mr-4"
                >
                  <Play
                    weight="fill"
                    size={23}
                    className="cursor-pointer text-black dark:text-white"
                  />
                </motion.div>
              )}

              <motion.div whileTap={{ scale: 0.5 }}>
                <FastForward
                  onClick={handleAudioSkip}
                  weight="fill"
                  size={30}
                  className="cursor-pointer text-black dark:text-white"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const MiniScroll = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          transition={{
            type: "spring",
            duration: 1,
            ease: "easeInOut",
          }}
          layout
          layoutId="audio-bar"
          className="fixed inset-x-20 bottom-6 z-20 flex justify-center rounded-[50px] border border-transparent bg-gradient-to-tl from-transparent to-black/10 px-3 py-1 text-zinc-50 shadow-sm backdrop-blur-sm dark:border-2 dark:to-white/10 md:inset-x-96 md:bottom-4 md:rounded-[50px] md:px-4 md:py-2"
        >
          <div
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsClick(true);
              }
            }}
            className="flex w-full items-center justify-between"
          >
            <div className="hidden items-center gap-4 text-black dark:text-white md:flex">
              <motion.div whileTap={{ scale: 0.5 }}>
                <Shuffle
                  onClick={() => handlePlayRandomAudio()}
                  size={18}
                  weight="bold"
                  className="cursor-pointer text-zinc-500"
                />
              </motion.div>

              <motion.div whileTap={{ scale: 0.5 }}>
                <Rewind
                  size={25}
                  onClick={handAudioForward}
                  weight="fill"
                  className="cursor-pointer"
                />
              </motion.div>
              {isPlaying ? (
                <motion.div whileTap={{ scale: 0.5 }}>
                  <Pause
                    onClick={handlePauseAudio}
                    weight="fill"
                    size={30}
                    className="cursor-pointer"
                  />
                </motion.div>
              ) : (
                <motion.div whileTap={{ scale: 0.5 }}>
                  <Play
                    onClick={handleResumeAudio}
                    weight="fill"
                    size={25}
                    className="cursor-pointer"
                  />
                </motion.div>
              )}
              <motion.div whileTap={{ scale: 0.5 }}>
                <FastForward
                  onClick={handleAudioSkip}
                  weight="fill"
                  size={25}
                  className="cursor-pointer"
                />
              </motion.div>

              <Repeat size={18} weight="bold" className="text-zinc-500" />
            </div>

            <div className="flex w-[700px] items-center justify-start gap-2 md:ml-6 md:gap-2">
              {!currentMusic?.cover ? (
                <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-900 md:rounded-lg">
                  <MusicNotes size={20} weight="fill" className="text-white" />
                </div>
              ) : (
                <div className="shrink-0">
                  {/* <Image
                    alt="cover"
                    width={192}
                    height={192}
                    src={currentMusic?.cover}
                    className="flex size-10 items-center justify-center rounded-xl object-cover md:rounded-lg"
                  /> */}

                  <img
                    src={currentMusic?.cover}
                    alt="cover"
                    className="flex size-10 items-center justify-center rounded-xl object-cover md:rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center gap-4">
                <div>
                  <AnimatePresence>
                    <motion.div
                      layoutId="title"
                      layout
                      className="line-clamp-1 text-sm font-semibold text-black dark:text-white"
                    >
                      {currentMusic?.title || (
                        <motion.div className="text-sm font-semibold">
                          Title Song
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence>
                    <motion.div
                      layoutId="singer-bar"
                      layout
                      className="line-clamp-1 text-sm font-medium text-zinc-500"
                    >
                      {currentMusic?.singer || (
                        <motion.div className="text-sm">Singer</motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="hidden md:flex">
                  <DurationAudio />
                </div>
              </div>

              {/* <div>
                {currentMusic?.cover && (
                  <DynamicIslandWave
                    isPlay={isPlaying}
                    coverUrl={currentMusic?.cover}
                  />
                )}
              </div> */}
            </div>

            <div className="hidden items-center gap-4 text-black dark:text-white md:flex">
              {isMuted ? (
                <motion.div whileTap={{ scale: 0.5 }} className="">
                  <SpeakerSlash
                    size={20}
                    weight="fill"
                    onClick={() => handleMute()}
                  />
                </motion.div>
              ) : (
                <motion.div whileTap={{ scale: 0.5 }}>
                  <SpeakerHigh
                    size={20}
                    weight="fill"
                    onClick={() => handleMute()}
                    className="cursor-pointer"
                  />
                </motion.div>
              )}

              <motion.div whileTap={{ scale: 0.5 }}>
                <Control
                  size={20}
                  weight="fill"
                  className="cursor-pointer"
                  onClick={() => setIsClick(true)}
                />
              </motion.div>
            </div>

            <div className="ml-4 flex items-center gap-4 md:hidden">
              {isPlaying ? (
                <motion.div
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePauseAudio();
                  }}
                  whileTap={{ scale: 0.5 }}
                  className="mr-4"
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
                  whileTap={{ scale: 0.5 }}
                  className="mr-4"
                >
                  <Play
                    weight="fill"
                    size={23}
                    className="cursor-pointer text-black dark:text-white"
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div>
      {scroll ? (
        <>
          {!isClick ? (
            <Mini />
          ) : (
            <div ref={ref}>
              <PlayerPage setIsClick={() => setIsClick(false)} />
            </div>
          )}
        </>
      ) : (
        <>
          {!isClick ? (
            <MiniScroll />
          ) : (
            <div ref={ref}>
              <PlayerPage setIsClick={() => setIsClick(false)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
