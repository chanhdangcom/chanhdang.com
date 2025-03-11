"use client";

import DynamicIslandWave from "@/components/ui/dynamic-island";
import Image from "next/image";
import { useAudio } from "@/components/music-provider";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";

import { Play, Pause, Rewind, FastForward, MusicNotes } from "phosphor-react";

import { useRef, useState } from "react";
import { useScroll as useScrollCustom } from "../hook/use-scroll";
import { MusicTime } from "./music-time";
import { useOutsideClick } from "../hook/use-outside-click";

export const HeaderMotion = () => {
  const { scrollY } = useScroll();
  const _top = useTransform(scrollY, [100, 400], [-80, 0]);
  const top = useSpring(_top);

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

  const [isExpanded, setIsExpanded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(headerRef, () => setIsExpanded(false), isExpanded);

  useScrollCustom(() => setIsExpanded(false), isExpanded);

  const renderExpaned = () => {
    return (
      <AnimatePresence>
        <motion.div
          key={`PauseAudio-${isExpanded ? "expanded" : "compact"}`}
          layoutId="dynamic-island"
          initial={{
            scale: 0.9,
            borderRadius: "40px",
          }}
          animate={{
            scale: 1,
            borderRadius: isExpanded ? "40px" : "55px",
          }}
          exit={{
            scale: 0.9,
            borderRadius: "40px",
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
            mass: 0.6,
            ease: "easeInOut",
          }}
          className="flex items-center justify-center rounded-[40px] bg-zinc-950 shadow-2xl dark:border dark:border-zinc-700"
        >
          <div className="w-[calc(100vw-1rem)] p-4 sm:w-96">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  layoutId="cover-audio"
                  className="flex size-16 shrink-0 items-center justify-center"
                >
                  {!currentMusic?.cover ? (
                    <div className="flex size-16 items-center justify-center rounded-3xl bg-zinc-900">
                      <MusicNotes
                        size={32}
                        weight="fill"
                        className="text-zinc-700"
                      />
                    </div>
                  ) : (
                    <Image
                      src={currentMusic?.cover}
                      alt="Cover"
                      width={192}
                      height={192}
                      className="flex size-16 items-center rounded-2xl"
                    />
                  )}
                </motion.div>

                <motion.div
                  layoutId="title-audio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 20,
                    duration: 1,
                    ease: "easeInOut",
                  }}
                  className="text-base font-semibold leading-5 text-zinc-50"
                >
                  <div className="line-clamp-1">
                    {currentMusic?.title || "TITLE SONG"}
                  </div>

                  <div className="font-sf font-normal text-zinc-400">
                    {currentMusic?.singer || "Singer"}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 20,
                  duration: 1,
                  ease: "easeInOut",
                }}
                layoutId="wave-audio"
                className="mt-3 shrink-0"
              >
                <DynamicIslandWave
                  isPlay={isPlaying}
                  coverUrl={currentMusic?.cover}
                />
              </motion.div>
            </div>

            <MusicTime />

            <div className="mt-3 flex items-center justify-center">
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
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderCollapsed = () => {
    return (
      <motion.div
        key={`PauseAudio-${isExpanded ? "expanded" : "compact"}`}
        layoutId="dynamic-island"
        initial={{
          scale: 0.9,
          borderRadius: "40px",
        }}
        animate={{
          scale: 1,
          borderRadius: isExpanded ? "40px" : "55px",
        }}
        exit={{
          scale: 0.9,
          borderRadius: "40px",
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
          mass: 0.6,
          duration: 4,
          ease: "easeInOut",
        }}
        className="flex rounded-full bg-zinc-950 dark:border dark:border-zinc-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isPlaying && currentMusic && (
          <AnimatePresence>
            <motion.div
              layoutId="compact"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 20,
                duration: 1,
              }}
              className="flex w-[40vh] min-w-[40vh] items-center justify-between p-1"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  layoutId="cover-audio"
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      ease: "linear",
                      duration: 3,
                    }}
                  >
                    <Image
                      src={currentMusic.cover}
                      alt="Cover"
                      width={192}
                      height={192}
                      className="size-10 rounded-full shadow-sm dark:border-zinc-800"
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  layoutId="title-audio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 20,
                    duration: 1,
                    ease: "easeInOut",
                  }}
                  className="line-clamp-1 text-base font-semibold text-zinc-50"
                >
                  {currentMusic.title}
                </motion.div>
              </div>

              <motion.div layoutId="wave-audio" className="mr-2 shrink-0">
                <DynamicIslandWave isPlay coverUrl={currentMusic.cover} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {!isPlaying && (
          <AnimatePresence>
            <motion.div
              key="compact"
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
              }}
              className="flex w-fit items-center gap-2 p-1"
            >
              <motion.div
                layoutId="cover-audio"
                className="shrink-0 rounded-full border border-zinc-800"
              >
                <Image
                  src="/img/avatar.jpeg"
                  alt="Avatar"
                  width={192}
                  height={192}
                  className="size-10 rounded-full"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 20,
                  duration: 1,
                  ease: "easeInOut",
                }}
                layoutId="title-audio"
                className="text-xl font-semibold text-zinc-50"
              >
                Nguyễn Chánh Đang
              </motion.div>

              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 20,
                  duration: 1,
                  ease: "easeInOut",
                }}
                className="mr-2 text-left text-3xl text-blue-600"
                width="0.6em"
                height="0.6em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.3393 0.582135C12.6142 -0.194045 11.3836 -0.194045 10.6584 0.582135L8.88012 2.48429C8.51756 2.8711 8.00564 3.0843 7.47584 3.06515L4.87538 2.97706C3.81324 2.94132 2.94259 3.81197 2.97834 4.87411L3.06642 7.47712C3.0843 8.00691 2.87238 8.51884 2.48429 8.88139L0.582135 10.6584C-0.194045 11.3836 -0.194045 12.6155 0.582135 13.3406L2.48429 15.1189C2.87238 15.4815 3.0843 15.9921 3.06642 16.5232L2.97706 19.1249C2.94259 20.1871 3.81324 21.0577 4.87538 21.022L7.47712 20.9339C8.00691 20.916 8.51884 21.1279 8.88139 21.5148L10.6584 23.4169C11.3848 24.1944 12.6155 24.1944 13.3419 23.4169L15.1202 21.5148C15.4815 21.1279 15.9934 20.9147 16.5232 20.9339L19.1249 21.022C20.1871 21.0577 21.059 20.1871 21.022 19.1249L20.9352 16.5219C20.916 15.9921 21.1292 15.4815 21.516 15.1189L23.4182 13.3406C24.1944 12.6155 24.1944 11.3836 23.4182 10.6584L21.516 8.88012C21.1292 8.51884 20.916 8.00691 20.9352 7.47584L21.022 4.87411C21.059 3.81197 20.1871 2.94132 19.1249 2.97706L16.5232 3.06642C15.9934 3.08302 15.4815 2.8711 15.1189 2.48429L13.3393 0.582135ZM5.91327 12.5402L10.2908 16.9164L17.5458 8.99374L15.8262 7.4018L10.2091 13.5232L7.56393 10.878L5.91327 12.5402Z"
                  fill="currentColor"
                ></path>
              </motion.svg>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    );
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[1000] flex justify-center"
      style={{ top }}
    >
      <div ref={headerRef} className="mt-2">
        {isExpanded ? renderExpaned() : renderCollapsed()}
      </div>
    </motion.header>
  );
};
