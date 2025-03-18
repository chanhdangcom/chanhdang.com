"use client";
import * as React from "react";

import { Playlist } from "@phosphor-icons/react/dist/ssr";
import { MUSICS } from "./data/music-page-playlist";
import { PlaylistItem } from "./component/playlist-item";

export function CarouselAudioPlaylist() {
  return (
    <div className="mx-auto w-full rounded-lg border-b p-2 shadow-sm backdrop-blur-md dark:border-zinc-800 md:max-w-3xl">
      <div className="font-bol mb-2 flex gap-1 text-2xl">
        <Playlist size={32} weight="fill" className="text-zinc-500" />

        <div>Playlist</div>
      </div>

      <div className="flex justify-center overflow-x-auto">
        {MUSICS.map((music) => (
          <div key={music.id} className="shrink-0">
            <PlaylistItem music={music} />
          </div>
        ))}
      </div>
    </div>
  );
}
