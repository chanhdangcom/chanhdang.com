"use client";
import * as React from "react";

// import { Playlist } from "@phosphor-icons/react/dist/ssr";
import { MUSICSPLAYLIST } from "./data/music-page-playlist";
import { PlaylistItem } from "./component/playlist-item";

export function CarouselAudioPlaylist() {
  return (
    <div className="w-full md:max-w-7xl">
      <div className="flex gap-3 overflow-x-auto md:mx-auto">
        {MUSICSPLAYLIST.map((music) => (
          <div key={music.id} className="shrink-0">
            <PlaylistItem music={music} />
          </div>
        ))}
      </div>
    </div>
  );
}
