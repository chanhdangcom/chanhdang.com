"use client";

import * as React from "react";

import { AuidoItem } from "./component/audio-item";

import { useAudio } from "@/components/music-provider";
import { MUSICS } from "./data/music-page";
import { MusicNotesSimple } from "@phosphor-icons/react/dist/ssr";

export function CarouselAudio() {
  const { handlePlayAudio } = useAudio();

  return (
    <div className="mx-auto w-full rounded-lg border-b shadow-sm backdrop-blur-md dark:border-zinc-800 md:max-w-5xl">
      <div className="font-bol container mb-2 flex gap-1 text-2xl">
        <MusicNotesSimple size={32} weight="fill" className="text-zinc-500" />

        <div>Single song</div>
      </div>

      <div className="flex overflow-x-auto">
        {MUSICS.map((music) => (
          <div key={music.id} className="shrink-0">
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
