/* eslint-disable @next/next/no-img-element */

"use client";

import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { IPlaylistItem } from "../type/playlist";
import { cn } from "@/lib/utils";
import { BorderPro } from "./border-pro";
import { useAudio } from "@/components/music-provider";
import { DynamicIslandWave } from "@/components/ui/dynamic-island";
import { useTheme } from "next-themes";

type IProp = {
  music: IMusic | IPlaylistItem;
  handlePlay?: () => void;
  className?: string;
  classNameOrder?: string;
  item?: React.ReactNode;
  date?: string;
  duration?: string;
  border?: boolean;
};

export function AudioItemOrder({
  music,
  handlePlay,
  className,
  item,
  date,
  duration,
  border,
}: IProp) {
  const { currentMusic, isPlaying } = useAudio();
  const { resolvedTheme } = useTheme();

  if (!music) {
    return <div className="text-rose-500">Dữ liệu nhạc chưa sẵn sàng</div>;
  }

  const isCurrentTrack =
    typeof (music as IMusic).audio === "string" &&
    currentMusic?.id === music?.id;
  const waveColor = resolvedTheme === "dark" ? "#3b82f6" : "#f43f5e";

  const UnClick = () => {
    return (
      <div
        className={cn(`flex w-full items-center gap-3`, className)}
        onClick={handlePlay}
      >
        {music.cover ? (
          <BorderPro roundedSize="rounded-md">
            <img
              src={music.cover}
              alt="cover"
              className="size-12 shrink-0 rounded-md object-cover shadow-sm md:size-14"
            />
          </BorderPro>
        ) : (
          <div className="size-12 rounded-2xl bg-zinc-800"></div>
        )}

        <div
          className={cn(
            "flex-2 flex-1 flex-col pb-2 text-black dark:text-white",
            border && "border-b border-zinc-200 dark:border-zinc-900"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="w-40">
              <div className="flex items-center gap-1 text-sm font-semibold">
                <span className="line-clamp-1">
                  {music.title || "TITLE SONG"}
                </span>
              </div>

              <div className="line-clamp-1 text-sm text-zinc-400">
                {music.singer || "SINGER"}
              </div>
            </div>

            {date && (
              <div className="hidden font-apple text-xs font-medium text-zinc-400 md:flex">
                {new Date(date).toLocaleDateString("vi-VN")}
              </div>
            )}

            {duration && (
              <div className="text-sm text-zinc-400">{duration}</div>
            )}

            {isCurrentTrack ? (
              <DynamicIslandWave
                isPlay={isPlaying}
                coverUrl={music.cover}
                color={waveColor}
              />
            ) : (
              item && <div className="">{item}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return <UnClick />;
}
