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
          <div className="flex gap-1 px-1 text-2xl font-semibold">
            <div className="ml-2 text-black dark:text-white md:ml-[270px]">
              Popular Artists
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {MUSICSSINGER.map((music, index) => (
              <div
                key={music.id}
                className={`shrink-0 ${index === 0 ? "ml-4 md:ml-[270px]" : ""}`}
              >
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
