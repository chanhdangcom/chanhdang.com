"use client";

import { useAudio } from "@/components/music-provider";
import Image from "next/image";
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
import DynamicIslandWave from "@/components/ui/dynamic-island";
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setScroll(false);
      } else {
        setScroll(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Mini = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          transition={{ duration: 0.3 }}
          layoutId="audio-bar"
          className="fixed inset-x-2 bottom-24 z-20 flex justify-center rounded-[50px] border-2 border-transparent bg-gradient-to-tl from-transparent to-white/10 px-3 py-1 text-zinc-50 shadow-sm backdrop-blur-sm md:inset-x-16 md:bottom-4 md:rounded-[55px] md:px-8 md:py-4"
        >
          <div
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsClick(true);
              }
            }}
            className="flex w-full items-center justify-between"
          >
            <div className="hidden items-center gap-8 md:flex">
              <motion.div whileTap={{ scale: 0.5 }}>
                <Rewind
                  size={32}
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
                    size={30.5}
                    className="cursor-pointer"
                  />
                </motion.div>
              ) : (
                <motion.div whileTap={{ scale: 0.5 }}>
                  <Play
                    onClick={handleResumeAudio}
                    weight="fill"
                    size={32}
                    className="cursor-pointer"
                  />
                </motion.div>
              )}
              <motion.div whileTap={{ scale: 0.5 }}>
                <FastForward
                  onClick={handleAudioSkip}
                  weight="fill"
                  size={32}
                  className="cursor-pointer"
                />
              </motion.div>
              <div className="hidden md:flex">
                <DurationAudio />
              </div>
            </div>

            <div className="flex w-[700px] items-center justify-start gap-3">
              {!currentMusic?.cover ? (
                <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-900">
                  <MusicNotes size={28} weight="fill" className="text-white" />
                </div>
              ) : (
                <div className="shrink-0">
                  <Image
                    alt="cover"
                    width={192}
                    height={192}
                    src={currentMusic?.cover}
                    className="flex size-12 items-center justify-center rounded-2xl object-cover md:size-16 md:rounded-2xl"
                  />
                </div>
              )}

              <div>
                <AnimatePresence>
                  <motion.div className="line-clamp-1 text-sm font-semibold">
                    {currentMusic?.title || (
                      <motion.div className="text-sm font-semibold">
                        Title Song
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                  <motion.div className="line-clamp-1 text-sm font-medium text-zinc-500">
                    {currentMusic?.singer || (
                      <motion.div className="text-sm">Singer</motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
                transition={{ ease: "easeOut", duration: 0.5 }}
                className="hidden md:flex"
              >
                {currentMusic?.cover && (
                  <DynamicIslandWave
                    isPlay={isPlaying}
                    coverUrl={currentMusic?.cover}
                  />
                )}
              </motion.div>
            </div>

            <div className="hidden items-center gap-8 md:flex">
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

              <Repeat size={20} weight="fill" />
              <motion.div whileTap={{ scale: 0.5 }}>
                <Shuffle
                  onClick={() => handlePlayRandomAudio()}
                  size={20}
                  weight="fill"
                  className="cursor-pointer"
                />
              </motion.div>

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
              <motion.div layout>
                {currentMusic?.cover && (
                  <DynamicIslandWave
                    isPlay={isPlaying}
                    coverUrl={currentMusic?.cover}
                  />
                )}
              </motion.div>

              {isPlaying ? (
                <motion.div
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePauseAudio();
                  }}
                  whileTap={{ scale: 0.5 }}
                  className="mr-4"
                >
                  <Pause weight="fill" size={23} className="cursor-pointer" />
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
                  <Play weight="fill" size={23} className="cursor-pointer" />
                </motion.div>
              )}
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
          transition={{ duration: 0.3 }}
          layoutId="audio-bar"
          className="fixed inset-x-20 bottom-4 z-20 flex justify-center rounded-[50px] border-2 border-transparent bg-gradient-to-tl from-transparent to-white/10 px-3 py-1 text-zinc-50 shadow-sm backdrop-blur-sm md:inset-x-16 md:bottom-4 md:rounded-[50px] md:px-8 md:py-4"
        >
          <div
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsClick(true);
              }
            }}
            className="flex w-full items-center justify-between"
          >
            <div className="hidden items-center gap-8 md:flex">
              <motion.div whileTap={{ scale: 0.5 }}>
                <Rewind
                  size={32}
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
                    size={30.5}
                    className="cursor-pointer"
                  />
                </motion.div>
              ) : (
                <motion.div whileTap={{ scale: 0.5 }}>
                  <Play
                    onClick={handleResumeAudio}
                    weight="fill"
                    size={32}
                    className="cursor-pointer"
                  />
                </motion.div>
              )}
              <motion.div whileTap={{ scale: 0.5 }}>
                <FastForward
                  onClick={handleAudioSkip}
                  weight="fill"
                  size={32}
                  className="cursor-pointer"
                />
              </motion.div>
              <div className="hidden md:flex">
                <DurationAudio />
              </div>
            </div>

            <div className="flex w-[700px] items-center justify-start gap-3">
              {!currentMusic?.cover ? (
                <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-900">
                  <MusicNotes size={28} weight="fill" className="text-white" />
                </div>
              ) : (
                <motion.div layoutId="Cover" className="shrink-0">
                  <Image
                    alt="cover"
                    width={192}
                    height={192}
                    src={currentMusic?.cover}
                    className="flex size-12 items-center justify-center rounded-2xl object-cover md:size-16 md:rounded-2xl"
                  />
                </motion.div>
              )}

              <div>
                <AnimatePresence>
                  <motion.div className="line-clamp-1 text-sm font-semibold">
                    {currentMusic?.title || (
                      <motion.div className="text-sm font-semibold">
                        Title Song
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                  <motion.div className="line-clamp-1 text-sm font-medium text-zinc-500">
                    {currentMusic?.singer || (
                      <motion.div className="text-sm">Singer</motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="hidden items-center gap-8 md:flex">
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

              <Repeat size={20} weight="fill" />
              <motion.div whileTap={{ scale: 0.5 }}>
                <Shuffle
                  onClick={() => handlePlayRandomAudio()}
                  size={20}
                  weight="fill"
                  className="cursor-pointer"
                />
              </motion.div>

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
                  <Pause weight="fill" size={23} className="cursor-pointer" />
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
                  <Play weight="fill" size={23} className="cursor-pointer" />
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
