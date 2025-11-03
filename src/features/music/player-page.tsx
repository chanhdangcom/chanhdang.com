/* eslint-disable @next/next/no-img-element */
"use client";
import { useAudio } from "@/components/music-provider";
import {
  CaretDown,
  DotsThreeVertical,
  FastForward,
  Pause,
  Play,
  Repeat,
  RepeatOnce,
  Rewind,
  Shuffle,
} from "@phosphor-icons/react/dist/ssr";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { AudioTimeLine } from "./component/audio-time-line";
import DynamicIslandWave from "@/components/ui/dynamic-island";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { BorderPro } from "./component/border-pro";

type IProp = {
  setIsClick: () => void;
};

export function PlayerPage({ setIsClick }: IProp) {
  const {
    currentMusic,
    isPlaying,
    isPaused,
    handlePlayRandomAudio,
    handlePauseAudio,
    handleResumeAudio,
    handleAudioSkip,
    handAudioForward,
    handleToggleRepeat,
    currentSubtitleId,
    subtitles,
    isRepeat,
  } = useAudio();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [isClickLyric, setIsClickLyric] = useState(false);

  if (isClickLyric)
    return (
      <AnimatePresence mode="wait">
        <motion.div
          layoutId="audio-bar"
          className="fixed inset-0 z-50 flex justify-between space-y-4 px-4 md:rounded-3xl md:border md:border-white/10"
        >
          <div className="w-full">
            <div className="absolute inset-0 -z-10 flex justify-center gap-8 bg-zinc-300 backdrop-blur-sm dark:bg-zinc-950">
              <img
                src={currentMusic?.cover || ""}
                alt="cover"
                className="md:3/4 0 mt-8 h-screen w-full opacity-80 blur-2xl md:mt-24 md:h-screen md:w-full md:blur-3xl"
              />
            </div>

            <header className="flex items-center justify-between border-b border-white/10 p-1 text-black dark:text-white md:py-4">
              <CaretDown
                size={20}
                className="cursor-pointer"
                onClick={() => setIsClick()}
              />

              <div className="flex justify-center gap-4 rounded-full p-1 font-semibold">
                <ChanhdangLogotype className="w-28" />
              </div>

              <DotsThreeVertical size={20} weight="bold" className="" />
            </header>

            <div className="absolute inset-x-4 z-10 mt-2 rounded-2xl p-1">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentMusic?.cover ? (
                      <motion.div
                        layoutId="Cover"
                        key={currentMusic?.cover}
                        className="flex justify-center gap-8"
                      >
                        <BorderPro roundedSize="rounded-xl">
                          <motion.img
                            src={currentMusic?.cover}
                            alt="cover"
                            transition={{
                              duration: 0.2,
                              ease: "easeInOut",
                              type: "spring",
                              damping: 15,
                            }}
                            className="flex size-16 shrink-0 justify-center rounded-xl object-cover"
                          />
                        </BorderPro>
                      </motion.div>
                    ) : (
                      <div className="flex h-[45vh] w-full shrink-0 justify-center rounded-xl bg-zinc-700" />
                    )}

                    <div>
                      <div className="line-clamp-1 font-semibold">
                        {currentMusic?.title || "TITLE SONG"}
                      </div>

                      <div className="line-clamp-1">
                        {currentMusic?.singer || "SINGER"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex space-x-8 text-black dark:text-white">
                      <motion.button
                        whileTap={{ scale: 0.5 }}
                        onClick={
                          isPlaying
                            ? handlePauseAudio
                            : isPaused
                              ? handleResumeAudio
                              : handlePlayRandomAudio
                        }
                        className="flex cursor-pointer items-center justify-center"
                      >
                        {isPlaying ? (
                          <Pause size={36} weight="fill" />
                        ) : (
                          <Play size={36} weight="fill" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 mx-1 mt-2 flex justify-between rounded-full text-sm font-semibold md:hidden">
                  <div>UP NEXT</div>

                  <div onClick={() => setIsClickLyric(!isClickLyric)}>
                    HIDDEN LYRIC
                  </div>

                  <div>RELATED</div>
                </div>
              </div>
            </div>

            <div className="ml-4 h-full w-full overflow-y-auto scrollbar-hide">
              <div className="text-balance px-4 pt-32 font-apple text-3xl font-bold leading-loose text-zinc-300">
                {subtitles.map((line) => (
                  <p
                    key={line.id}
                    id={`subtitle-${line.id}`}
                    className={`transition-all duration-300 ${
                      currentSubtitleId === line.id
                        ? "font-semibold leading-snug text-white"
                        : "text-zinc-500 [filter:blur(2px)]"
                    }`}
                  >
                    {line.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        layoutId="audio-bar"
        className="fixed inset-0 z-50 flex justify-between space-y-4 px-4 md:rounded-3xl md:border md:border-white/10"
      >
        <div className="w-full">
          <div className="absolute inset-0 -z-10 flex justify-center gap-8 bg-zinc-300 backdrop-blur-sm dark:bg-zinc-950">
            <img
              src={currentMusic?.cover || ""}
              alt="cover"
              className="md:3/4 0 mt-8 h-1/2 w-full blur-2xl md:mt-24 md:h-screen md:w-full md:blur-3xl"
            />
          </div>

          <header className="flex items-center justify-between p-1 text-black dark:text-white md:py-4">
            <CaretDown
              size={20}
              className="cursor-pointer"
              onClick={() => setIsClick()}
            />

            <div className="flex justify-center gap-4 rounded-full p-1 font-semibold">
              <ChanhdangLogotype className="w-28" />
            </div>

            <DotsThreeVertical size={20} weight="bold" className="" />
          </header>

          <div className="relative mx-3 space-y-4 md:space-y-10">
            {currentMusic?.cover ? (
              <motion.div
                layoutId="Cover"
                key={currentMusic?.cover}
                className="flex justify-center gap-8"
              >
                <div className="relative">
                  <motion.img
                    src={currentMusic?.cover}
                    alt="cover"
                    animate={{ scale: isPaused ? 0.8 : 1 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      type: "spring",
                      damping: 15,
                    }}
                    className="flex h-[50vh] w-full shrink-0 justify-center rounded-2xl object-cover md:h-[70vh] md:w-[80vh]"
                  />

                  <div
                    className={
                      isPaused
                        ? ""
                        : "pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 duration-300 dark:ring-white/10"
                    }
                  />
                </div>
              </motion.div>
            ) : (
              <div className="flex h-[45vh] w-full shrink-0 justify-center rounded-2xl bg-zinc-700" />
            )}

            <div className="space-y-4 rounded-3xl md:absolute md:inset-x-8 md:-bottom-20 md:border md:border-white/10 md:bg-zinc-950/40 md:px-4 md:py-3 md:backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="line-clamp-1 text-xl font-semibold">
                    {currentMusic?.title || "TITLE SONG"}
                  </div>

                  <div className="line-clamp-1 text-lg text-zinc-400">
                    {currentMusic?.singer || "SINGER"}
                  </div>
                </div>

                <DynamicIslandWave
                  isPlay={isPlaying}
                  coverUrl={currentMusic?.cover}
                />
              </div>

              <div className="flex items-center justify-center">
                <AudioTimeLine />
              </div>

              <div className="flex items-center justify-between">
                <motion.div whileTap={{ scale: 0.5 }}>
                  <Shuffle
                    onClick={() => handlePlayRandomAudio()}
                    size={25}
                    className="cursor-pointer"
                  />
                </motion.div>

                <div className="flex space-x-8 text-black dark:text-white">
                  <motion.button
                    onClick={handAudioForward}
                    whileTap={{ scale: 0.5 }}
                    className="flex cursor-pointer items-center justify-center"
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
                    className="flex cursor-pointer items-center justify-center"
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
                    className="flex cursor-pointer items-center justify-center"
                  >
                    <FastForward size={32} weight="fill" />
                  </motion.button>
                </div>

                <div onClick={handleToggleRepeat}>
                  {isRepeat ? <RepeatOnce size={25} /> : <Repeat size={25} />}
                </div>
              </div>
            </div>

            <div className="flex justify-between px-4 text-base text-zinc-500 md:hidden">
              <div>UP NEXT</div>

              <div onClick={() => setIsClickLyric(!isClickLyric)}>LYRIC</div>

              <div>RELATED</div>
            </div>
          </div>
        </div>

        <div className="ml-8 mr-20 hidden h-full w-full overflow-y-auto scrollbar-hide md:block">
          <div className="text-balance px-4 pt-12 font-apple text-4xl font-bold leading-loose text-zinc-300">
            {subtitles.map((line) => (
              <p
                key={line.id}
                id={`subtitle-${line.id}`}
                className={`transition-all duration-300 ${
                  currentSubtitleId === line.id
                    ? "font-semibold leading-snug text-white"
                    : "text-zinc-500 [filter:blur(2px)]"
                }`}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
