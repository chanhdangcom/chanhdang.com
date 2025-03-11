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

import { Play, Pause, Rewind, FastForward } from "phosphor-react";

import { useRef, useState } from "react";
import { useOutsideClick } from "../hook/use-outside-click";

import { format } from "date-fns";

type IProp = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  songTitle: string;
  coverImage: string;
  singerTitle: string;
  youtubeLink: string;
  audioHref: string;
};

export const HeaderMotion = ({ isPlaying, currentTime, duration }: IProp) => {
  const { scrollY } = useScroll();
  const _top = useTransform(scrollY, [100, 400], [-80, 0]);
  const top = useSpring(_top);

  const {
    handlePauseAudio,
    handleResumeAudio,
    // handleAudioSkip,
    // handAudioForward,
    songTitle,
    coverImage,
    singerTitle,
  } = useAudio();

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const [isClick, setIsClick] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(headerRef, () => setIsClick(false));

  return (
    <motion.header className="in fixed top-0 z-[1000] w-full" style={{ top }}>
      <div ref={headerRef} onClick={() => setIsClick(!isClick)} className="m-2">
        {!isPlaying ? (
          <motion.div
            style={{ position: "relative" }}
            key={`PauseAudio-${isClick ? "expanded" : "compact"}`}
            layoutId="dynamic-island"
            initial={{
              opacity: 1,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 1,
              scale: 0.9,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
              duration: 1,
            }}
          >
            {!isClick ? (
              <AnimatePresence mode="wait">
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
                  }}
                  className="mx-auto flex w-fit items-center gap-2 rounded-full bg-zinc-950 p-1"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src="/img/avatar.jpeg"
                      alt="Avatar"
                      width={192}
                      height={192}
                      className="size-10 rounded-full border shadow-sm dark:border-zinc-800"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-xl text-zinc-50"
                  >
                    Nguyễn Chánh Đang
                  </motion.div>

                  <motion.svg
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
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
            ) : (
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
                }}
                className="w-full rounded-[40px] bg-zinc-950 p-5 dark:border dark:border-zinc-700"
              >
                <div className="font-sf flex justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <>
                      {!coverImage ? (
                        <div className="flex size-16 items-center rounded-2xl border border-zinc-950 bg-zinc-900 shadow-sm"></div>
                      ) : (
                        <Image
                          src={coverImage}
                          alt="Cover"
                          width={192}
                          height={192}
                          className="size-16 rounded-2xl shadow-sm"
                        />
                      )}
                    </>

                    <motion.div
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-sm font-semibold leading-5 text-zinc-50"
                    >
                      {!songTitle ? (
                        <div>TITLE SONG</div>
                      ) : (
                        <div>{songTitle}</div>
                      )}

                      <div className="font-normal text-zinc-400">
                        {!singerTitle ? (
                          <div>Singer</div>
                        ) : (
                          <div>{singerTitle}</div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-3">
                    <DynamicIslandWave isPlay={false} />
                  </div>
                </div>

                <div className="font-sf mx-auto mt-4 flex items-center justify-between gap-2">
                  <div className="text-xs text-zinc-400">
                    {format(new Date(currentTime * 1000), "m:ss")}
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-700 md:w-72">
                    <motion.div
                      className="h-full bg-zinc-50 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="text-xs text-zinc-400">
                    {format(new Date(duration * 1000), "m:ss")}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-center">
                  <div className="flex items-center justify-center gap-10">
                    <motion.button className="flex cursor-pointer items-center justify-center rounded-full text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                      <Rewind size={30} weight="fill" />
                    </motion.button>

                    <motion.button
                      onClick={isPlaying ? handlePauseAudio : handleResumeAudio}
                      className="flex cursor-pointer items-center justify-center rounded-full text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    >
                      {isPlaying ? (
                        <Pause size={36} weight="fill" />
                      ) : (
                        <Play size={36} weight="fill" />
                      )}
                    </motion.button>

                    <motion.button className="flex cursor-pointer items-center justify-center rounded-full text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                      <FastForward size={30} weight="fill" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="">
            <motion.div
              layoutId="dynamic-island"
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
              }}
              className=""
            >
              {!isClick ? (
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
                  className="mx-auto flex w-fit items-center justify-between rounded-[40px] border-zinc-950 bg-zinc-950 p-1 dark:border-zinc-800"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      className="size-10"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 7,
                        ease: "linear",
                      }}
                    >
                      <Image
                        src={coverImage}
                        alt="Cover"
                        width={192}
                        height={192}
                        className="size-10 rounded-full"
                      />
                    </motion.div>
                    <div className="font-sf text-sm font-semibold text-zinc-50">
                      {songTitle}
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {isPlaying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden"
                      >
                        <DynamicIslandWave isPlay={true} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
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
                  }}
                  className="w-full rounded-[40px] border border-zinc-950 bg-zinc-950 p-5 dark:border-zinc-800"
                >
                  <div className="font-sf flex justify-between gap-2">
                    <div className="flex items-center gap-4">
                      <>
                        <Image
                          src={coverImage}
                          alt="Cover"
                          width={192}
                          height={192}
                          className="size-16 rounded-2xl shadow-sm"
                        />
                      </>

                      <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-sm font-semibold leading-5 text-zinc-50"
                      >
                        <div>{songTitle}</div>

                        <div className="font-normal text-zinc-400">
                          <div>{singerTitle}</div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-3">
                      <DynamicIslandWave isPlay={true} />
                    </div>
                  </div>

                  <div className="font-sf mx-auto mt-4 flex items-center justify-between gap-2">
                    <div className="text-xs text-zinc-400">
                      {format(new Date(currentTime * 1000), "m:ss")}
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-700 md:w-72">
                      <motion.div
                        className="h-full bg-zinc-50 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="text-xs text-zinc-400">
                      {format(new Date(duration * 1000), "m:ss")}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-center">
                    <div className="flex items-center justify-center gap-10">
                      <motion.button className="flex cursor-pointer items-center justify-center rounded-full text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                        <Rewind size={30} weight="fill" />
                      </motion.button>

                      <motion.button
                        onClick={
                          isPlaying ? handlePauseAudio : handleResumeAudio
                        }
                        className="flex cursor-pointer items-center justify-center rounded-full text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        {isPlaying ? (
                          <Pause size={36} weight="fill" />
                        ) : (
                          <Play size={36} weight="fill" />
                        )}
                      </motion.button>

                      <motion.button className="flex cursor-pointer items-center justify-center rounded-full text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                        <FastForward size={30} weight="fill" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </motion.header>
  );
};
