"use client";
import { Input } from "@/components/ui/input";
import { MUSICS } from "../data/music-page";
import { AuidoItem } from "./audio-item";
import { useAudio } from "@/components/music-provider";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOutsideClick } from "@/features/profile/hook/use-outside-click";

export function Search() {
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

  return (
    <div className="z-10">
      <Input
        type="text"
        placeholder="Music, Playlist ..."
        className="w-[84vh] transform rounded-2xl bg-zinc-100 shadow-sm transition-transform duration-300 focus:scale-105 dark:border-zinc-800 dark:bg-zinc-900"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClick={() => setIsSearch(true)}
      />

      {isSearch && (
        <div className="">
          <div
            ref={ref}
            className="fixed top-20 rounded-3xl border bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="grid w-full grid-cols-4">
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
              }).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="w-44"
                >
                  <AuidoItem
                    music={item}
                    handlePlay={() => handlePlayAudio(item)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
