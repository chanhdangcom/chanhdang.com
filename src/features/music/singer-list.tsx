"use client";
import { Guitar } from "@phosphor-icons/react/dist/ssr";
import { SingerItem } from "./component/singer-item";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { MUSICSSINGER } from "./data/music-page-singer";

export function SingerList() {
  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div layoutId="singer" layout>
        <div className="container w-full rounded-3xl p-8 md:bg-zinc-900">
          <div className="font-bol flex gap-1 text-2xl">
            <Guitar size={32} weight="fill" className="text-zinc-500" />
            <div className="text-zinc-50">Singer</div>
          </div>

          <div className="mt-2 flex w-full items-center gap-4 overflow-auto">
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
