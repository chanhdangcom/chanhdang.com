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

type IProp = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
};
export const HeaderMotion = ({ isPlaying, currentTime, duration }: IProp) => {
  const { scrollY } = useScroll();
  const _top = useTransform(scrollY, [100, 400], [-80, 0]);
  const top = useSpring(_top);
  const {
    handlePauseAudio,
    handleResumeAudio,
    songTitle,
    coverImage,
    singerTitle,
  } = useAudio();
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.header
      className="group fixed left-0 right-0 top-0 z-[1000] mx-auto flex h-16 w-fit justify-center bg-background pt-2 transition-[height] duration-300 ease-in-out hover:h-36"
      style={{ top }}
    >
      <div className="transform rounded-3xl border bg-zinc-100 shadow-sm transition-transform hover:scale-105 hover:rounded-3xl dark:border-zinc-700 dark:bg-zinc-950">
        <div className="flex w-fit items-center justify-center space-x-2 rounded-full py-2 pl-2 pr-4 text-2xl font-bold">
          <>
            <div className="flex items-center justify-center">
              {!isPlaying ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="not-playing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex items-center gap-4"
                  >
                    <motion.div
                      animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                      transition={{
                        duration: isPlaying ? 5 : 0.5,
                        repeat: isPlaying ? Infinity : 0,
                        ease: "linear",
                      }}
                      className="size-10"
                    >
                      <Image
                        src="/img/avatar.jpeg"
                        alt="Avatar"
                        width={192}
                        height={192}
                        className="size-10 rounded-full border shadow-sm dark:border-zinc-800"
                      />
                    </motion.div>

                    <div className="text-xl md:text-2xl">Nguyễn Chánh Đang</div>
                  </motion.div>
                  <svg
                    className="ml-2 text-left text-3xl text-blue-600"
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
                  </svg>
                </AnimatePresence>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="not-playing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex w-fit items-center gap-4"
                  >
                    <motion.div className="size-10">
                      <Image
                        src={coverImage}
                        alt="Avatar"
                        width={192}
                        height={192}
                        className="size-10 rounded-full border shadow-sm hover:size-16 hover:rounded-xl dark:border-zinc-800"
                      />
                    </motion.div>
                    <div className="md:text-md text-xl">{songTitle}</div>
                  </motion.div>
                </AnimatePresence>
              )}

              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 1 }}
                    transition={{
                      width: { duration: 0.4, ease: "easeInOut" },
                      opacity: { duration: 0.2, ease: "easeInOut" },
                    }}
                    className="overflow-hidden"
                  >
                    <DynamicIslandWave />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-2 scale-90 transform items-center justify-center gap-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="text-sm font-thin text-zinc-400">
                    {singerTitle}
                  </div>
                </div>

                <div className="h-1 w-56 overflow-hidden rounded-full bg-zinc-400 md:w-56">
                  <div
                    className="h-full bg-zinc-50 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-center space-x-4">
                  <button className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                    <Rewind size={32} weight="fill" />
                  </button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={isPlaying ? handlePauseAudio : handleResumeAudio}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  >
                    {isPlaying ? (
                      <Pause size={32} weight="fill" />
                    ) : (
                      <Play size={32} weight="fill" />
                    )}
                  </motion.button>

                  <button className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                    <FastForward size={32} weight="fill" />
                  </button>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </motion.header>
  );
};
