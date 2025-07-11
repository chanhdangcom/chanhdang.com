"use client";
import { SingerItem } from "./component/singer-item";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { MUSICSSINGER } from "./data/music-page-singer";

export function SingerList() {
  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div layoutId="singer" layout>
        <div className="w-full">
          <div className="flex gap-1 px-1 text-xl font-semibold">
            <div className="text-black dark:text-white">Popular Artists</div>
          </div>

          <div className="scrollbar-hide mt-2 flex items-center gap-3 overflow-x-auto p-1">
            {MUSICSSINGER.map((music) => (
              <div key={music.id} className="shrink-0">
                <SingerItem
                  music={music}
                  onClick={() => {
                    router.push(`/music/singer/${music.id}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
