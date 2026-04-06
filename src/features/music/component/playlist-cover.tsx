/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import {
  DEFAULT_PLAYLIST_COVER,
  getPlaylistCoverTiles,
} from "../utils/playlist-cover";

type PlaylistCoverProps = {
  cover?: string;
  title?: string;
  className?: string;
  imageClassName?: string;
};

const fiveTileLayout = [
  "col-span-3 row-span-3",
  "col-start-4 col-span-3 row-span-2",
  "col-start-4 col-span-3 row-start-3 row-span-2",
  "col-span-2 row-start-4 row-span-3",
  "col-start-3 col-span-4 row-start-5 row-span-2",
];

export function PlaylistCover({
  cover,
  title,
  className,
  imageClassName,
}: PlaylistCoverProps) {
  const tiles = getPlaylistCoverTiles(cover);

  if (tiles.length <= 1) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <img
          src={tiles[0] || DEFAULT_PLAYLIST_COVER}
          alt={title || "Playlist cover"}
          className={cn("size-full object-cover", imageClassName)}
        />
      </div>
    );
  }

  if (tiles.length === 2) {
    return (
      <div
        className={cn(
          "grid size-full grid-cols-2 gap-px overflow-hidden",
          className
        )}
      >
        {tiles.map((tile, index) => (
          <img
            key={`${tile}-${index}`}
            src={tile}
            alt={`${title || "Playlist cover"} ${index + 1}`}
            className={cn("size-full object-cover", imageClassName)}
          />
        ))}
      </div>
    );
  }

  if (tiles.length <= 4) {
    return (
      <div
        className={cn(
          "grid size-full grid-cols-2 grid-rows-2 gap-px overflow-hidden",
          className
        )}
      >
        {tiles.slice(0, 4).map((tile, index) => (
          <img
            key={`${tile}-${index}`}
            src={tile}
            alt={`${title || "Playlist cover"} ${index + 1}`}
            className={cn("size-full object-cover", imageClassName)}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid size-full grid-cols-6 grid-rows-6 gap-px overflow-hidden",
        className
      )}
    >
      {tiles.slice(0, 5).map((tile, index) => (
        <img
          key={`${tile}-${index}`}
          src={tile}
          alt={`${title || "Playlist cover"} ${index + 1}`}
          className={cn(
            "size-full shrink-0 object-cover",
            fiveTileLayout[index],
            imageClassName
          )}
        />
      ))}
    </div>
  );
}
