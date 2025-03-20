"use client";
import { useAudio } from "@/components/music-provider";

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
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { AudioTimeLine } from "./component/audio-time-line";
import AverageColorBackground from "./component/average-color-background";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

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

  const Player = () => {
    return (
      <AnimatePresence mode="wait">
        <AverageColorBackground imageUrl={currentMusic?.cover}>
          <motion.div
            layoutId="audio-bar"
            className="container z-10 space-y-4 py-2"
          >
            <header className="flex items-center justify-between">
              <AlertDialogTrigger>
                <CaretDown size={20} className="text-zinc-50" />
              </AlertDialogTrigger>

              <ChanhdangLogotype className="w-24" />

              <Screencast size={20} className="text-zinc-50" />
            </header>

            <div className="mx-3 space-y-6">
              {currentMusic?.cover ? (
                <motion.div layoutId="Cover" key={currentMusic?.cover}>
                  <Image
                    src={currentMusic?.cover}
                    alt="Cover"
                    width={500}
                    height={500}
                    className="flex h-[45vh] w-full shrink-0 justify-center rounded-2xl object-cover"
                  />
                </motion.div>
              ) : (
                <div className="flex h-[45vh] w-full shrink-0 justify-center rounded-2xl bg-zinc-700"></div>
              )}

              <div>
                <div className="text-2xl font-semibold">
                  {currentMusic?.title || "TITLE SONG"}
                </div>

                <div className="text-lg text-zinc-500">
                  {currentMusic?.singer || "SINGER"}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <AudioTimeLine />
              </div>

              <div className="jus flex items-center justify-between">
                <Shuffle
                  onClick={() => handlePlayRandomAudio()}
                  size={25}
                  className="cursor-pointer text-zinc-50"
                />

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

                <Repeat size={25} className="text-zinc-50" />
              </div>

              <div className="flex justify-between text-base text-zinc-500">
                <div>UP NEXT</div>
                <div>LYRIC</div>
                <div>RELATED</div>
              </div>
            </div>
          </motion.div>
        </AverageColorBackground>
      </AnimatePresence>
    );
  };

  return <Player />;
}
