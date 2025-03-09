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
import { useState } from "react";

type IProp = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  songTitle: string;
  coverImage: string;
  singerTitle: string;
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
  const [isClick, setIsClick] = useState(false);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[1000] flex justify-center bg-background"
      style={{ top }}
      onClick={() => setIsClick(!isClick)}
    >
      <div className="flex w-fit cursor-pointer items-center justify-center space-x-2 rounded-full py-2 text-2xl font-bold duration-300 md:hover:scale-105">
        <>
          {!isPlaying ? (
            <>
              <motion.div
                style={{ position: "relative" }}
                key={`PauseAudio-${isClick ? "expanded" : "compact"}`}
                layoutId="dynamic-island"
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  clipPath: "inset(40% 50% 40% 50%)",
                  borderRadius: "50px",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0%)",
                  borderRadius: isClick ? "32px" : "50px",
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  clipPath: "inset(40% 50% 40% 50%)",
                  borderRadius: "50px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  duration: 0.5,
                }}
                className="flex items-center justify-center rounded-full border bg-zinc-100 p-1 pr-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                {!isClick ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="compact"
                      layoutId="compact"
                      initial={{ scale: 0.9, borderRadius: "50px" }}
                      animate={{ scale: 1, borderRadius: "24px" }}
                      exit={{ scale: 0.9, borderRadius: "50px" }}
                      transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 20,
                        duration: 0.5,
                      }}
                      className="flex w-[30vh] items-center gap-4"
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

                      <div className="text-xl md:text-2xl">
                        Nguyễn Chánh Đang
                      </div>
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
                  <motion.div
                    key="compact"
                    layoutId="expanded"
                    initial={{ scale: 0.9, borderRadius: "50px" }}
                    animate={{ scale: 1, borderRadius: "24px" }}
                    exit={{ scale: 0.9, borderRadius: "50px" }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 20,
                      duration: 0.5,
                    }}
                    className="w-[50vh] space-y-4 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <motion.div
                          layoutId="image-large"
                          className="flex size-16 items-center justify-center"
                        >
                          {!coverImage ? (
                            <div className="flex size-16 items-center rounded-2xl border shadow-sm dark:border-zinc-950 dark:bg-zinc-800"></div>
                          ) : (
                            <Image
                              src={coverImage}
                              alt="Cover"
                              width={192}
                              height={192}
                              className="flex size-16 items-center rounded-2xl border shadow-sm dark:border-zinc-950"
                            />
                          )}
                        </motion.div>

                        <div>
                          <motion.div
                            layoutId="text-large"
                            className="flex items-center justify-between text-lg"
                          >
                            {!songTitle ? (
                              <div>TITLE SONG</div>
                            ) : (
                              <div>{songTitle}</div>
                            )}
                          </motion.div>

                          <div className="text-sm font-thin text-zinc-400">
                            {!singerTitle ? (
                              <div>Singer</div>
                            ) : (
                              <div>{singerTitle}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <DynamicIslandWave isPlay={false} />
                    </div>

                    <motion.div
                      layoutId="progress-bar"
                      className="mx-auto h-1 w-72 overflow-hidden rounded-full bg-zinc-400"
                    >
                      <motion.div
                        className="h-full bg-zinc-50 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </motion.div>

                    <motion.div
                      layout
                      className="mt-3 flex items-center justify-center space-x-4"
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <Rewind size={32} weight="fill" />
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
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
                        whileTap={{ scale: 0.95 }}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <FastForward size={32} weight="fill" />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </>
          ) : (
            <div>
              <motion.div
                style={{ position: "relative" }}
                key={`PlayAudio-${isClick ? "expanded" : "compact"}`}
                layoutId="dynamic-island"
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  clipPath: "inset(40% 50% 40% 50%)",
                  borderRadius: "50px",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0%)",
                  borderRadius: isClick ? "32px" : "50px",
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  clipPath: "inset(40% 50% 40% 50%)",
                  borderRadius: "50px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  duration: 0.5,
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
                      duration: 0.5,
                    }}
                    className="flex w-[40vh] min-w-[40vh] items-center justify-between p-1"
                  >
                    <div className="flex items-center gap-2">
                      {/* Ảnh xoay tròn */}
                      <motion.div
                        layoutId="image-small"
                        className="size-10"
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 5,
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

                      <motion.div layoutId="text-small" className="text-base">
                        {songTitle}
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isPlaying && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "auto", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
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
                    initial={{ scale: 0.9, borderRadius: "50px" }}
                    animate={{ scale: 1, borderRadius: "24px" }}
                    exit={{ scale: 0.9, borderRadius: "50px" }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 20,
                      duration: 0.5,
                    }}
                    className="w-[50vh] min-w-[50vh] space-y-4 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <motion.div
                          layoutId="image-large"
                          className="flex size-16 items-center justify-center"
                        >
                          <Image
                            src={coverImage}
                            alt="Cover"
                            width={192}
                            height={192}
                            className="flex size-16 items-center rounded-2xl border shadow-sm dark:border-zinc-950"
                          />
                        </motion.div>

                        <div>
                          <motion.div
                            layoutId="text-large"
                            className="md:text-md flex items-center justify-between text-base"
                          >
                            {songTitle}
                          </motion.div>

                          <div className="text-sm font-thin text-zinc-400">
                            {singerTitle}
                          </div>
                        </div>
                      </div>

                      <div className="">
                        <DynamicIslandWave isPlay={true} />
                      </div>
                    </div>

                    <motion.div
                      layoutId="progress-bar"
                      className="mx-auto h-1 w-72 overflow-hidden rounded-full bg-zinc-400"
                    >
                      <motion.div
                        className="h-full bg-zinc-50 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </motion.div>

                    <motion.div
                      layout
                      className="mt-3 flex items-center justify-center space-x-4"
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <Rewind size={32} weight="fill" />
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
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
                        whileTap={{ scale: 0.95 }}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-full p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <FastForward size={32} weight="fill" />
                      </motion.button>
                    </motion.div>
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
