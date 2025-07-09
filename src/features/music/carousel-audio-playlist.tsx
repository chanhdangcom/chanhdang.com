"use client";
import * as React from "react";

// import { Playlist } from "@phosphor-icons/react/dist/ssr";
import { MUSICSPLAYLIST } from "./data/music-page-playlist";
import { PlaylistItem } from "./component/playlist-item";

export function CarouselAudioPlaylist() {
  return (
    <div className="w-full md:max-w-7xl">
      <div className="container flex gap-1 text-2xl font-semibold">
        <div className="text-zinc-50">Top Picks for You</div>
      </div>
      <div className="mt-2 flex gap-3 overflow-x-auto md:mx-auto">
        {MUSICSPLAYLIST.map((music) => (
          <div key={music.id} className="shrink-0">
            <PlaylistItem music={music} />
          </div>
        ))}
      </div>
    </div>
  );
}
