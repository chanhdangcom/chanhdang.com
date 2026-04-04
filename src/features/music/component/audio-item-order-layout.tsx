"use client";

import React from "react";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { IPlaylistItem } from "../type/playlist";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { BorderPro } from "./border-pro";
import { useAudio } from "@/components/music-provider";
import { DynamicIslandWave } from "@/components/ui/dynamic-island";
import { List } from "@phosphor-icons/react/dist/ssr";
import {
  AudioItemContextMenu,
  useAudioItemContextMenu,
} from "./audio-item-context-menu";

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

export function AudioItemOrderLayout({
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
  const { user } = useUser();
  const { currentMusic, isPlaying } = useAudio();
  const menu = useAudioItemContextMenu({
    onTap: handlePlay,
    disabled: draggable,
  });

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

  const UnClick = () => {
    return (
      <>
        <AudioItemContextMenu
          music={music as IMusic}
          userId={user?.id}
          open={menu.showMenu}
          isDesktop={menu.isDesktop}
          desktopOverlayPosition={menu.desktopOverlayPosition}
          menuRef={menu.menuRef}
          overlayRef={menu.overlayRef}
          onClose={menu.closeMenu}
          onPlay={handlePlay}
        />

        <div
          ref={menu.rootRef}
          className={cn(`flex w-full items-center gap-3`, className)}
          onPointerDown={(event) => {
            if (!draggable) {
              menu.handlePointerDown(event);
              return;
            }

            event.preventDefault();
            dragStartedRef.current = false;
            dragTimeoutRef.current = window.setTimeout(() => {
              dragStartedRef.current = true;
              const native = event.nativeEvent as PointerEvent;
              onDragHandlePointerDown?.(native);
            }, 500);
          }}
          onPointerUp={() => {
            if (!draggable) {
              menu.handlePointerUp();
              return;
            }

            if (dragTimeoutRef.current !== null) {
              window.clearTimeout(dragTimeoutRef.current);
              dragTimeoutRef.current = null;
            }

            if (!dragStartedRef.current && handlePlay) {
              handlePlay();
            }

            dragStartedRef.current = false;
          }}
          onPointerLeave={() => {
            if (!draggable) {
              menu.handlePointerLeave();
              return;
            }

            if (dragTimeoutRef.current !== null) {
              window.clearTimeout(dragTimeoutRef.current);
              dragTimeoutRef.current = null;
            }
          }}
          onContextMenu={draggable ? undefined : menu.handleContextMenu}
        >
          {isCurrentTrack ? (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md object-cover md:size-12">
              <DynamicIslandWave isPlay={isPlaying} coverUrl={music.cover} />
            </div>
          ) : (
            <div>
              {music.cover && (
                <BorderPro roundedSize="rounded-md">
                  <img
                    src={music.cover}
                    alt="cover"
                    className="size-10 shrink-0 rounded-md object-cover shadow-sm md:size-12"
                  />
                </BorderPro>
              )}
            </div>
          )}

          <div
            className={cn(
              "flex-2 flex-1 flex-col pb-2 text-black dark:text-white",
              border && "border-b border-black/10 dark:border-white/10"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[5vw] md:gap-[20vw]">
                <span
                  className={cn(
                    "line-clamp-1 w-40 font-apple text-sm font-semibold",
                    titleVariant === "alwaysWhite" && "text-white"
                  )}
                >
                  {music.title || "TITLE SONG"}
                </span>

                <div className="line-clamp-1 w-16 text-left font-apple text-sm text-zinc-400 md:w-40">
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

              <div className="flex items-center gap-8">
                <div className="font-apple text-sm text-zinc-400"> 3:28</div>

                <div className="">{item}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return <UnClick />;
}
