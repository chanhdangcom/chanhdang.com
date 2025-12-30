"use client";
import { Input } from "@/components/ui/input";
import { useAudio } from "@/components/music-provider";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioItemOrder } from "./audio-item-order";
import Link from "next/link";
import { SingerItem } from "./singer-item";
import { useParams, useRouter } from "next/navigation";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { ISingerItem } from "../type/singer";

type SearchMotionProps = {
  onQueryChange?: (value: string) => void;
};

export function SearchMotion({ onQueryChange }: SearchMotionProps) {
  const { handlePlayAudio } = useAudio();
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;
  const [data, setData] = useState<IMusic[]>([]);
  const [singers, setSingers] = useState<ISingerItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/musics");
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSingers = async () => {
      const response = await fetch("/api/singers");
      const data = await response.json();
      setSingers(data);
    };
    fetchSingers();
  }, []);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            duration: 0.1,
          }}
          className="inset-x-0 inset-y-0 z-50 flex md:inset-x-60"
        >
          <div className="w-full">
            <motion.div className="border-zinc-800">
              <motion.div
                layout
                className="mx-4 flex items-center gap-4 md:mx-2 md:gap-0"
              >
                <Input
                  type="text"
                  placeholder="Music, Playlist ..."
                  className="z-10 rounded-3xl border-none bg-white shadow-lg dark:bg-zinc-800 md:w-[40vw]"
                  value={value}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setValue(nextValue);
                    onQueryChange?.(nextValue);
                  }}
                  autoFocus
                />
              </motion.div>

              {/* singer */}
              <div className="container mt-4 flex w-full gap-4 overflow-x-auto">
                {singers
                  .filter((singer) => {
                    if (value == "") return;

                    const searchWords = value.toLowerCase().trim().split(" ");
                    const titleWordsRemoveVietnameseTones =
                      removeVietnameseTones(singer.singer).toLowerCase();
                    const titleWords = singer.singer.toLowerCase();

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
                          router.push(
                            `${withLocale("/music/singer")}/${item.id}`
                          );
                        }}
                      />
                    </motion.div>
                  ))}
              </div>

              {/* music */}
              <div className="container mt-4 h-screen space-y-4 overflow-y-auto bg-zinc-50 dark:bg-black">
                {data
                  .filter((music) => {
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
                      <Link href={withLocale("/music")}>
                        <AudioItemOrder
                          music={item}
                          handlePlay={() => handlePlayAudio(item)}
                          className="w-full"
                          border
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
    <div className="">
      <LargerSearch />
    </div>
  );
}
