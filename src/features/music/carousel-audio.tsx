"use client";

import * as React from "react";
import { AuidoItem } from "./component/audio-item";
import { useAudio } from "@/components/music-provider";
import { useEffect, useState } from "react";
import { IMusic } from "../profile/types/music";

export function CarouselAudio() {
  const { handlePlayAudio } = useAudio();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [musics, setMusics] = useState<IMusic[]>([]);

  useEffect(() => {
    fetch("/api/musics")
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data);

        const mapped = Array.isArray(data)
          ? data.map((item: Record<string, unknown>) => ({
              ...item,
              id:
                typeof item._id === "string" ? item._id : item._id?.toString(),
            }))
          : [];
        setMusics(mapped as IMusic[]);
      });
  }, []);

  return (
    <div className="w-full rounded-3xl text-black dark:text-white md:max-w-6xl">
      <div className="flex justify-between">
        <div className="flex gap-1 text-3xl font-bold">
          <div className="px-1 text-xl text-black dark:text-white">
            Trending Now
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="grid grid-flow-col grid-rows-2 gap-y-2 overflow-x-auto scrollbar-hide"
      >
        {musics.map((music) => (
          <div key={music.id} className="w-full shrink-0">
            <AuidoItem
              music={music}
              handlePlay={() => handlePlayAudio(music)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
