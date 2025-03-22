"use client";

import * as React from "react";

import { AuidoItem } from "./component/audio-item";

import { useAudio } from "@/components/music-provider";
// import { MUSICS } from "./data/music-page";
import { MusicNotesSimple } from "@phosphor-icons/react/dist/ssr";
import { IMusic } from "../profile/types/music";

export function CarouselAudio({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();

  React.useEffect(() => {
    console.log("ENV on client", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  return (
    <div className="mx-auto w-full rounded-lg border-b border-zinc-800 text-zinc-50 backdrop-blur-md md:max-w-5xl">
      <div className="font-bol container mb-2 flex gap-1 text-2xl">
        <MusicNotesSimple size={32} weight="fill" className="text-pink-500" />

        <div>Single song</div>
      </div>

      <div className="flex overflow-x-auto">
        {musics.map((music) => (
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
