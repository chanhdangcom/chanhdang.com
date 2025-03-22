"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "./hook/use-outside-click";
import { ExperienceInfoItem } from "./components/experience-info-item";
import { ListMusicIcon } from "lucide-react";
import { useAudio } from "@/components/music-provider";
import { MUSICS } from "./data/music";
import { IMusic } from "./types/music";

import { Play as PlayIcon, Pause as PauseIcon } from "phosphor-react";
import { cn } from "@/lib/utils";
import { useEscapePress } from "./hook/use-escape-press";
import { useUserEmail } from "@/store/user";

export function MusicList() {
  const [musicView, setMusicView] = useState<IMusic | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const {
    currentMusic,
    isPaused,
    handlePlayAudio,
    handlePauseAudio,
    handleResumeAudio,
  } = useAudio();

  useEscapePress(() => setMusicView(null), !!musicView);

  useOutsideClick(ref, () => setMusicView(null), !!musicView);

  console.log("Render Music List");

  const [email] = useUserEmail();

  return (
    <div className="rounded-3xl border-b shadow-sm dark:border-zinc-800">
      <div className="space-y-8">
        <div className="my-2 flex items-center space-x-2 font-mono text-sm">
          <ExperienceInfoItem
            icon={<ListMusicIcon />}
            content="Music Gallery"
          />
        </div>
      </div>

      <div>{email}</div>

      <AnimatePresence>
        {musicView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-zinc/50 fixed inset-0 z-10 h-[50vh] w-full"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {musicView ? (
          <div className="fixed inset-0 z-[1001] m-4 grid place-items-center rounded-xl">
            <motion.button
              key={`button-close-${musicView.id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 lg:hidden"
              onClick={() => setMusicView(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${musicView.id}`}
              ref={ref}
              className="flex h-full w-full max-w-md flex-col overflow-hidden rounded-xl border bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-3xl md:max-h-[85%]"
            >
              <motion.div layoutId={`cover-${musicView.id}`}>
                <Image
                  priority
                  width={300}
                  height={300}
                  src={musicView.cover}
                  alt={musicView.title}
                  className="h-[50vh] w-full rounded-xl object-cover object-top p-1 md:rounded-3xl lg:h-[50vh]"
                />
              </motion.div>

              <div>
                <div className="flex items-start justify-between p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${musicView.id}`}
                      className="text-2xl font-bold text-zinc-700 dark:text-zinc-200"
                    >
                      {musicView.title}
                    </motion.h3>

                    <motion.p
                      layoutId={`singer-${musicView.id}`}
                      className="text-zinc-600 dark:text-zinc-400"
                    >
                      {musicView.singer}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-play-${musicView.id}`}
                    target="_blank"
                    className="mt-4 cursor-pointer rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 md:mt-0"
                    onClick={() => handlePlayAudio(musicView)}
                  >
                    {musicView.id === currentMusic?.id ? "Current" : "Play"}
                  </motion.a>
                </div>

                <div className="relative px-4 pt-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-72 flex-col items-start gap-4 overflow-auto pb-10 text-xs text-zinc-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] dark:text-zinc-400 md:text-sm lg:text-base"
                  >
                    <p className="flex-wrap text-lg">{musicView.content}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="mx-auto w-full max-w-2xl gap-4">
        {MUSICS.map((music) => {
          const isPlayThisMusic = music.id === currentMusic?.id;

          return (
            <motion.div
              key={`card-${music.id}`}
              layoutId={`card-${music.id}`}
              onClick={() => setMusicView(music)}
              className="flex cursor-pointer flex-row items-center justify-between rounded-xl p-4 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <div className="flex flex-row gap-4">
                <motion.div layoutId={`cover-${music.id}`}>
                  <Image
                    width={100}
                    height={100}
                    src={music.cover}
                    alt={music.title}
                    className="size-14 rounded-xl border object-cover object-top shadow-sm dark:border-zinc-800"
                  />
                </motion.div>

                <div>
                  <motion.h3
                    layoutId={`title-${music.id}`}
                    className="text-left font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    {music.title}
                  </motion.h3>

                  <motion.p
                    layoutId={`singer-${music.id}`}
                    className="text-left text-zinc-600 dark:text-zinc-400"
                  >
                    {music.singer}
                  </motion.p>
                </div>
              </div>

              <motion.button
                layoutId={`button-play-${music.id}`}
                className={cn(
                  "mt-4 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-black hover:bg-green-500 hover:text-white md:mt-0",
                  isPlayThisMusic && "bg-green-500 text-white"
                )}
                onClick={(event) => {
                  event.stopPropagation();

                  if (isPlayThisMusic) {
                    if (isPaused) {
                      handleResumeAudio();
                    } else {
                      handlePauseAudio();
                    }
                  } else {
                    handlePlayAudio(music);
                  }
                }}
              >
                {isPlayThisMusic ? (
                  <>
                    {isPaused ? (
                      <PlayIcon weight="fill" />
                    ) : (
                      <PauseIcon weight="fill" />
                    )}
                  </>
                ) : (
                  <PlayIcon weight="fill" />
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </ul>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
