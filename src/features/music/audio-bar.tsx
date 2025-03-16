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
import { useRef, useState } from "react";
import { useOutsideClick } from "../profile/hook/use-outside-click";

export function AudioBar() {
  const Show = () => {
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

    return (
      <AnimatePresence>
        <motion.div
          layoutId="audio-bar"
          transition={{
            type: "spring",
            damping: 20,
            duration: 1,
            stiffness: 300,
          }}
          className="fixed inset-x-4 bottom-4 flex justify-center rounded-[40px] border bg-zinc-100/80 px-8 py-4 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80"
        >
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
              <DurationAudio />
            </div>

            <div className="flex items-center gap-3">
              {!currentMusic?.cover ? (
                <motion.div
                  layoutId="Cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ ease: "easeOut", duration: 0.7 }}
                  className="flex size-16 items-center justify-center rounded-2xl bg-zinc-900"
                >
                  <MusicNotes
                    size={32}
                    weight="fill"
                    className="text-zinc-50"
                  />
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
                  onClick={() => setIsShow(!isShow)}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const Small = () => {
    return (
      <AnimatePresence>
        <motion.div
          ref={refDiv}
          layoutId="audio-bar"
          transition={{
            type: "spring",
            damping: 20,
            duration: 1,
            stiffness: 300,
          }}
          className="fixed inset-44 mx-auto rounded-[40px] border border-zinc-800 bg-zinc-900/80 p-2 backdrop-blur-md"
        >
          ssss
        </motion.div>
      </AnimatePresence>
    );
  };

  const [isShow, setIsShow] = useState(false);
  const refDiv = useRef<HTMLDivElement>(null);
  useOutsideClick(refDiv, () => setIsShow(false), isShow);

  return <div>{isShow ? <Small /> : <Show />}</div>;
}
