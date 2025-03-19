"use client";
import { useAudio } from "@/components/music-provider";
import { AudioTimeLine } from "./component/audio-time-line";

import {
  CaretDown,
  FastForward,
  Pause,
  Play,
  Repeat,
  Rewind,
  Screencast,
  Shuffle,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Image from "next/image";

import { AnimatePresence, motion } from "motion/react";

export function PlayerPage() {
  const {
    currentMusic,
    isPlaying,
    isPaused,

    handlePlayRandomAudio,
    handlePauseAudio,
    handleResumeAudio,
    handleAudioSkip,
    handAudioForward,
  } = useAudio();

  return (
    <AnimatePresence>
      <motion.div
        transition={{
          type: "spring",
          damping: 20,
          duration: 1,
          stiffness: 300,
        }}
        layoutId="audio-bar"
        className="m-4 space-y-8"
      >
        <header className="flex items-center justify-between">
          <Link href="/music">
            <CaretDown size={20} />
          </Link>

          <div className="flex gap-3 rounded-2xl border border-zinc-800 p-2">
            <div>Music</div>
            <div>video</div>
          </div>

          <Screencast size={20} />
        </header>

        <AnimatePresence>
          <div className="mx-8 space-y-8">
            {currentMusic?.cover ? (
              <motion.div
                layoutId="Cover"
                layout
                initial={{
                  scale: 0.9,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  ease: "easeInOut",
                  duration: 0.3,
                }}
              >
                <Image
                  src={currentMusic?.cover}
                  alt="Cover"
                  width={500}
                  height={500}
                  className="flex h-[450px] w-full justify-center rounded-2xl"
                />
              </motion.div>
            ) : (
              <div className="flex h-[450px] w-full justify-center rounded-2xl bg-zinc-600"></div>
            )}

            <div className="space-y-2">
              <div className="text-3xl">
                {currentMusic?.title || "TITLE SONG"}
              </div>
              <div className="text-xl text-zinc-600">
                {currentMusic?.singer || "SINGER"}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <AudioTimeLine />
            </div>

            <div className="jus flex items-center justify-between">
              <Shuffle size={25} />

              <div className="flex gap-8">
                <motion.button
                  onClick={handAudioForward}
                  whileTap={{ scale: 0.5 }}
                  className="flex cursor-pointer items-center justify-center text-zinc-50"
                >
                  <Rewind size={30} weight="fill" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.5 }}
                  onClick={
                    isPlaying
                      ? handlePauseAudio
                      : isPaused
                        ? handleResumeAudio
                        : handlePlayRandomAudio
                  }
                  className="flex cursor-pointer items-center justify-center text-zinc-50"
                >
                  {isPlaying ? (
                    <Pause size={36} weight="fill" />
                  ) : (
                    <Play size={36} weight="fill" />
                  )}
                </motion.button>

                <motion.button
                  onClick={handleAudioSkip}
                  whileTap={{ scale: 0.5 }}
                  className="flex cursor-pointer items-center justify-center text-zinc-50"
                >
                  <FastForward size={32} weight="fill" />
                </motion.button>
              </div>

              <Repeat size={25} />
            </div>

            <div className="m-4 flex justify-between text-zinc-500">
              <div>UP NEXT</div>
              <div>UP NEXT</div>
              <div>UP NEXT</div>
            </div>
          </div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
