"use client";
import { Input } from "@/components/ui/input";
import { MUSICS } from "../data/music-page";
import { useAudio } from "@/components/music-provider";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { AudioItemOrder } from "./audio-item-order";

import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { MusicType } from "../music-type";
import { MUSICSSINGER } from "../data/music-page-singer";
import { SingerItem } from "./singer-item";
import { useRouter } from "next/navigation";

export function SearchMotion() {
  const { handlePlayAudio } = useAudio();
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const LargerSearch = () => {
    return (
      <AnimatePresence>
        <motion.div
          layout
          ref={ref}
          initial={{ borderRadius: 20 }}
          exit={{ borderRadius: 20 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            duration: 0.1,
          }}
          className="fixed inset-0 z-50 flex"
        >
          <div className="w-full">
            <motion.div className="container border-zinc-800 bg-zinc-50 p-2 dark:bg-zinc-950">
              <motion.div
                layoutId="Search"
                layout
                className="mb-2 flex items-center gap-4"
              >
                <div className="sticky top-0 z-10 flex items-center gap-1">
                  <Link
                    href={"/music"}
                    className="rounded-full bg-zinc-200 p-2 dark:bg-zinc-900"
                  >
                    <CaretLeft
                      size={28}
                      weight="bold"
                      className="text-black dark:text-white"
                    />
                  </Link>
                </div>

                <Input
                  type="text"
                  placeholder="Music, Playlist ..."
                  className="z-10 rounded-2xl border-none bg-zinc-200 dark:bg-zinc-800"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoFocus
                />
              </motion.div>

              <MusicType />

              {/* singer */}
              <div className="container mt-4 flex gap-4 overflow-x-auto">
                {MUSICSSINGER.filter((music) => {
                  if (value == "") return null;

                  const searchWords = value.toLowerCase().trim().split(" ");
                  const titleWordsRemoveVietnameseTones = removeVietnameseTones(
                    music.singer
                  ).toLowerCase();
                  const titleWords = music.singer.toLowerCase();

                  return searchWords.every(
                    (word) =>
                      titleWordsRemoveVietnameseTones.includes(word) ||
                      titleWords.includes(word)
                  );
                })
                  .slice(0, 5)
                  .map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="h shrink-0 rounded-2xl p-1"
                    >
                      <SingerItem
                        music={item}
                        onClick={() => {
                          router.push(`/music/singer/${item.id}`);
                        }}
                      />
                    </motion.div>
                  ))}
              </div>
              {/* singer */}

              <div className="container mt-4 h-screen space-y-4 overflow-y-auto">
                {MUSICS.filter((music) => {
                  if (value == "") return null;

                  const searchWords = value.toLowerCase().trim().split(" ");
                  const titleWordsRemoveVietnameseTones = removeVietnameseTones(
                    music.title
                  ).toLowerCase();
                  const titleWords = music.title.toLowerCase();

                  return searchWords.every(
                    (word) =>
                      titleWordsRemoveVietnameseTones.includes(word) ||
                      titleWords.includes(word)
                  );
                })
                  .slice(0, 3)
                  .map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="rounded-2xl p-1"
                    >
                      <Link href="/music">
                        <AudioItemOrder
                          music={item}
                          handlePlay={() => handlePlayAudio(item)}
                          className="size-20"
                          classNameOrder="w-96"
                        />
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="justify-centeri flex items-center">
      <LargerSearch />
    </div>
  );
}
