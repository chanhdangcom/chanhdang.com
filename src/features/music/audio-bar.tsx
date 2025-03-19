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
import ReactMarkdown from "react-markdown";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export function AudioBar() {
  const {
    currentMusic,
    isPlaying,
    isMuted,
    currentLyrics,
    handlePlayRandomAudio,
    handleResumeAudio,
    handlePauseAudio,
    handleAudioSkip,
    handAudioForward,
    handleMute,
  } = useAudio();

  const Show = () => {
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
          className="fixed inset-x-2 bottom-2 z-20 flex justify-center rounded-[30px] border bg-zinc-100/80 px-4 py-2 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 md:inset-x-4 md:bottom-4 md:rounded-[40px] md:px-8 md:py-4"
        >
          <div className="flex w-full items-center justify-between">
            <div className="hidden items-center gap-8 md:flex">
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
              <div className="hidden md:flex">
                <DurationAudio />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              {!currentMusic?.cover ? (
                <motion.div
                  layoutId="Cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex size-16 items-center justify-center rounded-2xl bg-zinc-900"
                >
                  <MusicNotes
                    size={32}
                    weight="fill"
                    className="text-zinc-50"
                  />
                </motion.div>
              ) : (
                <motion.div layoutId="Cover" transition={{ duration: 0.5 }}>
                  <Image
                    alt="cover"
                    width={192}
                    height={192}
                    src={currentMusic?.cover}
                    className="size-14 rounded-2xl border shadow-sm dark:border-zinc-800 md:size-16 md:rounded-2xl"
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
                    className="line-clamp-1 text-lg font-medium"
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
                    className="line-clamp-1 text-base font-medium text-zinc-500"
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
                className="hidden md:flex"
              >
                {currentMusic?.cover && (
                  <DynamicIslandWave
                    isPlay={isPlaying}
                    coverUrl={currentMusic?.cover}
                  />
                )}
              </motion.div>

              <motion.div
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key={currentLyrics}
                className="hidden w-96 justify-center text-sm text-zinc-500 md:flex"
              >
                {currentLyrics ? (
                  <motion.p key={currentLyrics}>{currentLyrics}</motion.p>
                ) : (
                  <p className="text-xl">...</p>
                )}
              </motion.div>
            </div>

            <div className="hidden items-center gap-8 md:flex">
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

            <div className="ml-4 flex items-center gap-4 md:hidden">
              <Link href="/music/player">
                <motion.div layout>
                  {currentMusic?.cover && (
                    <DynamicIslandWave
                      isPlay={isPlaying}
                      coverUrl={currentMusic?.cover}
                    />
                  )}
                </motion.div>
              </Link>

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
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const Small = () => {
    const st =
      "Ta về ta tắm ao ta Dù trong, dù đục, ao nhà vẫn hơn (vẫn hơn)\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ\n\n Tình quê son sắt keo sơn Hương đồng gió nội, cây rơm đợi chờ";

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
          className="fixed inset-44 mx-auto rounded-[40px] border bg-zinc-200/80 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80"
        >
          <div className="flex justify-between">
            <div className="space-y-2 p-2">
              {!currentMusic?.cover ? (
                <motion.div className="flex size-80 items-center justify-center rounded-[24px] bg-zinc-900">
                  <MusicNotes
                    size={32}
                    weight="fill"
                    className="text-zinc-50"
                  />
                </motion.div>
              ) : (
                <motion.div>
                  <Image
                    alt="cover"
                    width={192}
                    height={192}
                    src={currentMusic?.cover}
                    className="size-80 shrink-0 rounded-[24px] border shadow-sm dark:border-zinc-800"
                  />
                </motion.div>
              )}

              <div className="flex items-center justify-center text-2xl font-semibold">
                {currentMusic?.title || "TITLE SONG"}
              </div>

              <div className="flex items-center justify-center text-xl">
                {currentMusic?.singer || "SINGER"}
              </div>
            </div>

            <div className="space-y-2">
              <Tabs defaultValue="lyric" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl">
                  <TabsTrigger value="lyric">Lyric</TabsTrigger>

                  <TabsTrigger value="playlist">Playlist</TabsTrigger>
                </TabsList>

                <TabsContent value="lyric">
                  <div className="h-96 overflow-y-auto rounded-[24px] bg-zinc-100 p-2">
                    <div className="text-96 text-zin-950 text-base text-zinc-950">
                      <ReactMarkdown>{st}</ReactMarkdown>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="playlist">Playlist</TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const [isShow, setIsShow] = useState(false);
  const refDiv = useRef<HTMLDivElement>(null);
  useOutsideClick(refDiv, () => setIsShow(false), isShow);

  return <div>{isShow ? <Small /> : <Show />}</div>;
}
