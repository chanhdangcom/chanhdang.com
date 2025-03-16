"use client";
import { Input } from "@/components/ui/input";
import { MUSICS } from "../data/music-page";
import { AuidoItem } from "./audio-item";
import { useAudio } from "@/components/music-provider";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/features/profile/hook/use-outside-click";

export function SearchMotion() {
  const { handlePlayAudio } = useAudio();
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const [isSearch, setIsSearch] = useState(false);

  useOutsideClick(ref, () => setIsSearch(false), isSearch);

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const MiniSearch = () => {
    return (
      <AnimatePresence>
        {!isSearch && (
          <motion.div
            layoutId="Search"
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
              duration: 0.1,
            }}
            className="z-10"
          >
            <Input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Music, Playlist ..."
              className="w-[80vh] rounded-2xl bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              onClick={() => setIsSearch(true)}
            ></Input>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const LargerSearch = () => {
    return (
      <AnimatePresence>
        {isSearch && (
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
            className="fixed inset-x-80 top-16 z-10 flex rounded-3xl"
          >
            <div className="w-full">
              <motion.div layout layoutId="Search">
                <Input
                  type="text"
                  placeholder="Music, Playlist ..."
                  className="z-10 h-14 rounded-2xl bg-zinc-100/80 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoFocus
                />
              </motion.div>

              <motion.div className="mt-2 rounded-3xl bg-zinc-100/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="grid w-full grid-cols-5 gap-3">
                  {MUSICS.filter((music) => {
                    if (value == "") return null;

                    const searchWords = value.toLowerCase().trim().split(" ");
                    const titleWordsRemoveVietnameseTones =
                      removeVietnameseTones(music.title).toLowerCase();
                    const titleWords = music.title.toLowerCase();

                    return searchWords.every(
                      (word) =>
                        titleWordsRemoveVietnameseTones.includes(word) ||
                        titleWords.includes(word)
                    );
                  }).map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      transition={{
                        duration: 0.5,
                      }}
                    >
                      <AuidoItem
                        title={item.title}
                        singer={item.singer}
                        cover={item.cover}
                        handlePlay={() => handlePlayAudio(item)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="flex items-center justify-center">
      {isSearch ? <LargerSearch /> : <MiniSearch />}
    </div>
  );
}
