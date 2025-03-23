"use client";
import { Guitar } from "@phosphor-icons/react/dist/ssr";
import { SingerItem } from "./component/singer-item";
import { MUSICS } from "./data/music-page-singer";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export function SingerList() {
  const router = useRouter();

  return (
    <motion.div layoutId="singer" layout>
      <div className="container w-full">
        <div className="font-bol flex gap-1 text-2xl">
          <Guitar size={32} weight="fill" className="text-zinc-500" />
          <div className="text-zinc-50">Singer</div>
        </div>

        <div className="mt-2 flex w-full items-center gap-4 overflow-auto">
          {MUSICS.map((music) => (
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
  );
}
