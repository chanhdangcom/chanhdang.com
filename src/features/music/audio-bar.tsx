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
import Link from "next/link";

export function AudioBar() {
  const {
    currentMusic,
    isPlaying,
    isMuted,
    currentLyrics,
    handlePlayRandomAudio,
    handleResumeAudio,
    handlePauseAudio,
    handleAudioSkip,
    handAudioForward,
    handleMute,
  } = useAudio();

  const Show = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          layoutId="audio-bar"
          className="fixed inset-x-2 bottom-2 z-20 flex justify-center rounded-[30px] border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-zinc-50 shadow-sm backdrop-blur-md md:inset-x-4 md:bottom-4 md:rounded-[40px] md:px-8 md:py-4"
        >
          <div className="flex w-full items-center justify-between">
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
                <motion.div
                  layoutId="Cover"
                  className="flex size-14 items-center justify-center rounded-2xl bg-zinc-900"
                >
                  <MusicNotes
                    size={32}
                    weight="fill"
                    className="text-zinc-50"
                  />
                </motion.div>
              ) : (
                <motion.div layoutId="Cover">
                  <Image
                    alt="cover"
                    width={192}
                    height={192}
                    src={currentMusic?.cover}
                    className="flex size-14 items-center justify-center rounded-xl md:size-16 md:rounded-2xl"
                  />
                </motion.div>
              )}

              <div>
                <AnimatePresence>
                  <motion.div
                    layoutId="Title"
                    className="line-clamp-1 text-lg font-medium"
                  >
                    {currentMusic?.title || (
                      <motion.div layoutId="Title">TITLE SONG</motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                  <motion.div
                    layoutId="Singer"
                    className="line-clamp-1 text-base font-medium text-zinc-500"
                  >
                    {currentMusic?.singer || (
                      <motion.div layoutId="Singer">SINGER</motion.div>
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

              <motion.div
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key={currentLyrics}
                className="hidden w-96 justify-center text-sm text-zinc-500 md:flex"
              >
                {currentLyrics ? (
                  <motion.p key={currentLyrics}>{currentLyrics}</motion.p>
                ) : (
                  <p className="text-xl">...</p>
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
                <Control size={20} weight="fill" className="cursor-pointer" />
              </motion.div>
            </div>

            <div className="ml-4 flex items-center gap-4 md:hidden">
              <Link href="/music/player">
                <motion.div layout>
                  {currentMusic?.cover && (
                    <DynamicIslandWave
                      isPlay={isPlaying}
                      coverUrl={currentMusic?.cover}
                    />
                  )}
                </motion.div>
              </Link>

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
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return <Show />;
}
