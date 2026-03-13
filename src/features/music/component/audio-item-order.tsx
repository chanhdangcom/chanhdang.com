/* eslint-disable @next/next/no-img-element */

"use client";

import React from "react";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { IPlaylistItem } from "../type/playlist";
import { cn } from "@/lib/utils";
import { BorderPro } from "./border-pro";
import { useAudio } from "@/components/music-provider";
import { DynamicIslandWave } from "@/components/ui/dynamic-island";
import { useTheme } from "next-themes";
import { List } from "@phosphor-icons/react/dist/ssr";

type IProp = {
  music: IMusic | IPlaylistItem;
  handlePlay?: () => void;
  className?: string;
  classNameOrder?: string;
  item?: React.ReactNode;
  date?: string;
  duration?: string;
  border?: boolean;
  titleVariant?: "default" | "alwaysWhite";
  /**
   * Kích hoạt icon handle kéo thả (UI giống Apple Music).
   * Việc drag thực tế sẽ được điều khiển từ component cha (Reorder.Item).
   */
  draggable?: boolean;
  onDragHandlePointerDown?: (event: PointerEvent) => void;
};

export function AudioItemOrder({
  music,
  handlePlay,
  className,
  item,
  date,
  duration,
  border,
  titleVariant = "default",
  draggable = false,
  onDragHandlePointerDown,
}: IProp) {
  const { currentMusic, isPlaying } = useAudio();
  const { resolvedTheme } = useTheme();
  const dragTimeoutRef = React.useRef<number | null>(null);
  const dragStartedRef = React.useRef(false);

  if (!music) {
    return (
      <div className="font-apple text-rose-500">Dữ liệu nhạc chưa sẵn sàng</div>
    );
  }

  const isCurrentTrack =
    typeof (music as IMusic).audio === "string" &&
    currentMusic?.id === music?.id;
  const waveColor = resolvedTheme === "dark" ? "#3b82f6" : "#f43f5e";

  const UnClick = () => {
    return (
      <div
        className={cn(`flex w-full items-center gap-3`, className)}
        onPointerDown={(event) => {
          // Ngăn select text / context default
          event.preventDefault();

          dragStartedRef.current = false;

          if (!draggable) return;

          // Long press ~500ms để kích hoạt drag
          dragTimeoutRef.current = window.setTimeout(() => {
            dragStartedRef.current = true;
            const native = event.nativeEvent as PointerEvent;
            onDragHandlePointerDown?.(native);
          }, 500);
        }}
        onPointerUp={() => {
          if (dragTimeoutRef.current !== null) {
            window.clearTimeout(dragTimeoutRef.current);
            dragTimeoutRef.current = null;
          }

          // Nếu chưa vào drag mode → xử lý như click play
          if (!dragStartedRef.current && handlePlay) {
            handlePlay();
          }

          dragStartedRef.current = false;
        }}
        onPointerLeave={() => {
          if (dragTimeoutRef.current !== null) {
            window.clearTimeout(dragTimeoutRef.current);
            dragTimeoutRef.current = null;
          }
        }}
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
            border && "border-b border-white/10"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="w-40">
              <div className="flex items-center gap-1 font-apple text-sm font-semibold">
                <span
                  className={cn(
                    "line-clamp-1",
                    titleVariant === "alwaysWhite" && "text-white"
                  )}
                >
                  {music.title || "TITLE SONG"}
                </span>
              </div>

              <div className="line-clamp-1 font-apple text-sm text-zinc-400">
                {music.singer || "SINGER"}
              </div>
            </div>

            {date && (
              <div className="hidden font-apple text-xs font-medium text-zinc-400 md:flex">
                {new Date(date).toLocaleDateString("vi-VN")}
              </div>
            )}

            {duration && (
              <div className="font-apple text-sm text-zinc-400">{duration}</div>
            )}

            {draggable && (
              <div className="flex cursor-grab items-center justify-center">
                <List
                  size={22}
                  weight="regular"
                  className="pointer-events-none text-white/20"
                />
              </div>
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
