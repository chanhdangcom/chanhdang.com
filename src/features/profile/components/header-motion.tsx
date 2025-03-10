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

import {
  Play,
  Pause,
  Rewind,
  FastForward,
  HeartStraight,
  Airplay,
} from "phosphor-react";

import { useRef, useState } from "react";
import { useOutsideClick } from "../hook/use-outside-click";
import Link from "next/link";
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
    handleAudioSkip,
    handAudioForward,
    songTitle,
    coverImage,
    singerTitle,
    youtubeLink,
  } = useAudio();

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const [isClick, setIsClick] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(headerRef, () => setIsClick(false));

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[1000] flex justify-center bg-background"
      style={{ top }}
    >
      <div
        ref={headerRef}
        onClick={() => setIsClick(!isClick)}
        className="flex w-fit cursor-pointer items-center justify-center space-x-2 py-2 text-2xl font-bold duration-300 md:hover:scale-105"
      >
        <>
          {!isPlaying ? (
            <>
              <motion.div
                style={{ position: "relative" }}
                key={`PauseAudio-${isClick ? "expanded" : "compact"}`}
                layoutId="dynamic-island"
                initial={{
                  opacity: 1,
                  scale: 0.9,
                  borderRadius: "50px",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  borderRadius: isClick ? "32px" : "50px",
                }}
                exit={{
                  opacity: 1,
                  scale: 0.9,
                  borderRadius: "50px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  duration: 1,
                }}
                className="flex items-center justify-center rounded-full border bg-zinc-100 shadow-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                {!isClick ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="compact"
                      initial={{
                        scale: 0.9,
                        borderRadius: "50px",
                      }}
                      animate={{
                        scale: 1,
                        borderRadius: isClick ? "32px" : "50px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 20,
                      }}
                      className="flex w-fit items-center gap-2 p-1"
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
                        className="text-xl"
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
                      borderRadius: "45px",
                    }}
                    animate={{
                      scale: 1,
                      borderRadius: isClick ? "32px" : "45px",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 20,
                    }}
                    className="h-[335px] w-[675px] space-y-4 p-4"
                  >
                    <div className="font-sf flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex size-16 items-center justify-center">
                          {!coverImage ? (
                            <div className="flex size-16 items-center rounded-2xl border shadow-sm dark:border-zinc-950 dark:bg-zinc-900"></div>
                          ) : (
                            <Image
                              src={coverImage}
                              alt="Cover"
                              width={192}
                              height={192}
                              className="flex size-16 items-center rounded-2xl border shadow-sm dark:border-zinc-950"
                            />
                          )}
                        </div>

                        <motion.div
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-center justify-between text-base">
                            {!songTitle ? (
                              <div>TITLE SONG</div>
                            ) : (
                              <div>{songTitle}</div>
                            )}
                          </div>

                          <div className="text-xs text-zinc-400">
                            {!singerTitle ? (
                              <div>Singer</div>
                            ) : (
                              <div>{singerTitle}</div>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      <DynamicIslandWave isPlay={false} />
                    </div>

                    <div className="font-sf mx-auto flex items-center justify-between gap-x-2">
                      <div className="text-xs text-zinc-400">
                        {format(new Date(currentTime * 1000), "mm:ss")}
                      </div>

                      <div className="h-1 w-64 overflow-hidden rounded-full bg-zinc-400 md:w-72">
                        <motion.div
                          className="h-full bg-zinc-500 transition-all duration-300 dark:bg-zinc-50"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="text-xs text-zinc-400">
                        {format(new Date(duration * 1000), "mm:ss")}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <motion.button className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-300 hover:bg-zinc-200 dark:text-zinc-600 dark:hover:bg-zinc-800"></motion.button>

                      <div className="flex gap-4">
                        <motion.button className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                          <Rewind size={32} weight="fill" />
                        </motion.button>

                        <motion.button
                          onClick={
                            isPlaying ? handlePauseAudio : handleResumeAudio
                          }
                          className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        >
                          {isPlaying ? (
                            <Pause size={32} weight="fill" />
                          ) : (
                            <Play size={32} weight="fill" />
                          )}
                        </motion.button>

                        <motion.button className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                          <FastForward size={32} weight="fill" />
                        </motion.button>
                      </div>

                      <motion.button className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-300 hover:bg-zinc-200 dark:text-zinc-600 dark:hover:bg-zinc-800">
                        <Airplay size={32} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </>
          ) : (
            <div>
              <motion.div
                layoutId="dynamic-island"
                initial={{
                  scale: 0.9,
                  borderRadius: "50px",
                }}
                animate={{
                  scale: 1,
                  borderRadius: isClick ? "32px" : "50px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                }}
                className="flex rounded-full border bg-zinc-100 shadow-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                {!isClick ? (
                  <motion.div
                    layoutId="compact"
                    initial={{ scale: 0.9, borderRadius: "50px" }}
                    animate={{ scale: 1, borderRadius: "24px" }}
                    exit={{ scale: 0.9, borderRadius: "50px" }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 20,
                      duration: 1,
                    }}
                    className="flex w-[40vh] min-w-[40vh] items-center justify-between p-1"
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
                          className="size-10 rounded-full border shadow-sm dark:border-zinc-800"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="font-sf text-sm"
                      >
                        {songTitle}
                      </motion.div>
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
                    layoutId="expanded"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 20,
                      duration: 1,
                    }}
                    className="w-[50vh] space-y-4 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="flex size-16 items-center justify-center"
                        >
                          <motion.div
                            animate={{ y: [-1.5, 0, -1.5] }}
                            transition={{
                              duration: 1,
                              ease: "easeInOut",
                              repeat: Infinity,
                            }}
                          >
                            <Image
                              src={coverImage}
                              alt="Cover"
                              width={192}
                              height={192}
                              className="flex size-16 items-center rounded-2xl border shadow-sm dark:border-zinc-950"
                            />
                          </motion.div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-center justify-between text-xl">
                            {songTitle}
                          </div>

                          <div className="text-sm font-thin text-zinc-400">
                            {singerTitle}
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <DynamicIslandWave isPlay={true} />
                      </motion.div>
                    </div>

                    <div className="mx-auto flex items-center justify-between gap-x-2">
                      <div className="ml-4 text-xs font-thin text-zinc-400">
                        {format(new Date(currentTime * 1000), "mm:ss")}
                      </div>

                      <div className="h-1 w-64 overflow-hidden rounded-full bg-zinc-400 md:w-72">
                        <motion.div
                          className="dark:zinc-50 h-full bg-zinc-500 transition-all duration-300 dark:bg-zinc-50"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mr-4 text-xs font-thin text-zinc-400">
                        {format(new Date(duration * 1000), "mm:ss")}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <motion.button className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-300 hover:bg-zinc-200 dark:text-zinc-600 dark:hover:bg-zinc-800">
                        <HeartStraight size={32} />
                      </motion.button>

                      <div className="flex items-center justify-center gap-4">
                        <motion.button
                          onClick={handAudioForward}
                          className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        >
                          <Rewind size={32} weight="fill" />
                        </motion.button>

                        <motion.button
                          onClick={
                            isPlaying ? handlePauseAudio : handleResumeAudio
                          }
                          className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        >
                          {isPlaying ? (
                            <Pause size={32} weight="fill" />
                          ) : (
                            <Play size={32} weight="fill" />
                          )}
                        </motion.button>

                        <motion.button
                          onClick={handleAudioSkip}
                          className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        >
                          <FastForward size={32} weight="fill" />
                        </motion.button>
                      </div>

                      <Link target="_blank" href={youtubeLink}>
                        <motion.button className="flex size-8 cursor-pointer items-center justify-start rounded-full p-1 text-zinc-300 hover:bg-zinc-200 dark:text-zinc-600 dark:hover:bg-zinc-800">
                          <Airplay size={32} />
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
        </>
      </div>
    </motion.header>
  );
};
