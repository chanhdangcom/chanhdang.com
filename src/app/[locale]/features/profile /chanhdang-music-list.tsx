"use client";
import { useAudio } from "@/components/music-provider";
import { CardSpotlight } from "@/components/ui";

import { MUSICS } from "@/features/music/data/music-page";

import { motion } from "motion/react";
import { useState } from "react";

export function ChanhdangMusicList() {
  const { handlePlayAudio } = useAudio();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="">
      <div className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-48">
        text-4xl pb-8 pt-12
      </div>

      <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

      <div className="mx-4 flex text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-48 md:text-4xl">
        <div>ChanhDang Music</div>
      </div>

      <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

      <div className="my-8">
        <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="mx-0 grid grid-cols-2 md:mx-48 md:grid-cols-5">
          {MUSICS.map((music, index) => {
            return (
              <div key={index} className="shrink-0 cursor-pointer">
                {index < 10 && (
                  <CardSpotlight
                    onClick={() => handlePlayAudio(music)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="w-full gap-4 space-y-2 p-4">
                      <div className="relative">
                        <motion.img
                          animate={
                            hoveredIndex === index
                              ? { x: 10, y: -10 }
                              : { x: 0, y: 0 }
                          }
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          width={100}
                          height={100}
                          src={music.cover}
                          alt={music.title}
                          className="mt-1 h-auto w-full rounded-xl object-cover object-top"
                        />
                        <motion.div
                          animate={
                            hoveredIndex === index
                              ? { x: 10, y: -10 }
                              : { x: 0, y: 0 }
                          }
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"
                        />
                      </div>

                      <div className="leading-6">
                        <motion.h3
                          animate={
                            hoveredIndex === index
                              ? { x: 10, y: -10 }
                              : { x: 0, y: 0 }
                          }
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="line-clamp-2 text-left text-lg font-semibold text-zinc-800 dark:text-zinc-200"
                        >
                          {music.title}
                        </motion.h3>
                        <p className="line-clamp-1 text-left text-sm text-zinc-600 dark:text-zinc-400">
                          {music.singer}
                        </p>
                      </div>
                    </div>
                  </CardSpotlight>
                )}
              </div>
            );
          })}
        </div>

        <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
