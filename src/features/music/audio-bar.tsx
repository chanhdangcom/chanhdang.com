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
  SpeakerSimpleHigh,
} from "phosphor-react";

import { AnimatePresence, motion } from "motion/react";
import DynamicIslandWave from "@/components/ui/dynamic-island";
import { DurationAudio } from "./component/duration-audio";

export function AudioBar() {
  const {
    currentMusic,
    isPlaying,
    handlePlayRandomAudio,
    handleResumeAudio,
    handlePauseAudio,
    handleAudioSkip,
    handAudioForward,
  } = useAudio();
  return (
    <div className="fixed inset-x-16 bottom-4 flex justify-center rounded-[40px] border bg-zinc-100 px-8 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex w-full items-center justify-between">
        <div className="im flex items-center gap-8">
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
              <Pause onClick={handlePauseAudio} weight="fill" size={30.5} />
            </motion.div>
          ) : (
            <motion.div whileTap={{ scale: 0.5 }}>
              <Play onClick={handleResumeAudio} weight="fill" size={32} />
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

          <DurationAudio />
        </div>

        <div className="flex items-center gap-3">
          {/* <HeartStraight size={20} className="text-red-500" weight="fill" /> */}
          {!currentMusic?.cover ? (
            <motion.div
              layoutId="Cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeOut", duration: 0.7 }}
              className="flex size-16 items-center justify-center rounded-2xl bg-zinc-900"
            >
              <MusicNotes size={32} weight="fill" className="text-zinc-50" />
            </motion.div>
          ) : (
            <motion.div
              layoutId="Cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeOut", duration: 0.7 }}
            >
              <Image
                alt="cover"
                width={192}
                height={192}
                src={currentMusic?.cover}
                className="size-16 rounded-2xl border shadow-sm dark:border-zinc-800"
              />
            </motion.div>
          )}

          <div>
            <AnimatePresence>
              <motion.div
                layoutId="Title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "easeOut", duration: 0.7 }}
                className="text-lg font-medium"
              >
                {currentMusic?.title || (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layoutId="Title"
                    transition={{ ease: "easeOut", duration: 0.7 }}
                  >
                    TITLE SONG
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layoutId="Singer"
                transition={{ ease: "easeOut", duration: 0.5 }}
                className="text-base font-medium text-zinc-500"
              >
                {currentMusic?.singer || (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layoutId="Singer"
                    transition={{ ease: "easeOut", duration: 0.5 }}
                  >
                    SINGER
                  </motion.div>
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
          >
            {currentMusic?.cover && (
              <DynamicIslandWave
                isPlay={isPlaying}
                coverUrl={currentMusic?.cover}
              />
            )}
          </motion.div>
        </div>

        <div className="flex items-center gap-8">
          <SpeakerSimpleHigh size={20} weight="fill" />
          <Repeat size={20} weight="fill" />
          <Shuffle onClick={handlePlayRandomAudio} size={20} weight="fill" />
        </div>
      </div>
    </div>
  );
}
