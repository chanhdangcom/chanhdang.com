"use client";
import Image from "next/image";

import { useAudio } from "@/components/music-provider";
import { MUSICS } from "@/features/music/data/music-page";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { cn } from "@/lib/utils";

export function ChanhdangMusicList() {
  const { handlePlayAudio } = useAudio();

  return (
    <div className="">
      <div className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-48">
        text-4xl pb-8 pt-12
      </div>

      <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

      <div className="mx-4 flex text-balance font-mono text-4xl font-semibold leading-tight tracking-tight md:mx-48">
        <div>ChanhDang Music.</div>
      </div>

      <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

      <div className="my-8">
        <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="mx-0 grid grid-cols-2 md:mx-48 md:grid-cols-4">
          {MUSICS.map((music, index) => {
            return (
              <div key={index} className="shrink-0 cursor-pointer">
                {index < 8 && (
                  <CardSpotlight onClick={() => handlePlayAudio(music)}>
                    <div className="w-full gap-4 space-y-2 p-4">
                      <div className="relative">
                        <Image
                          width={100}
                          height={100}
                          src={music.cover}
                          alt={music.title}
                          className="d mt-1 h-auto w-full rounded-xl object-cover object-top"
                        />

                        <div
                          className={cn(
                            "pointer-events-none absolute inset-0 rounded-xl",
                            "ring-1 ring-inset ring-black/10 dark:ring-white/10"
                          )}
                        />
                      </div>

                      <div className="leading-6">
                        <h3 className="text-left text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                          {music.title}
                        </h3>

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
