"use client";
// import { Guitar } from "@phosphor-icons/react/dist/ssr";
import { SingerItem } from "./component/singer-item";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { MUSICSSINGER } from "./data/music-page-singer";

export function SingerList() {
  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div layoutId="singer" layout>
        <div className="w-fulll">
          <div className="flex gap-1 text-2xl font-semibold">
            {/* <Guitar size={32} weight="fill" className="text-zinc-500" /> */}
            <div className="text-zinc-50">Popular artists</div>
          </div>

          <div className="mt-2 flex w-full max-w-6xl items-center gap-4 overflow-auto">
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
