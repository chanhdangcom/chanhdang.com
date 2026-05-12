/* eslint-disable @next/next/no-img-element */

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
  const { user } = useUser();
  const { currentMusic, isPlaying } = useAudio();
  const menu = useAudioItemContextMenu({
    onTap: handlePlay,
    disabled: draggable,
  });

  if (!music) {
    return (
      <div className="font-apple text-rose-500">Dữ liệu nhạc chưa sẵn sàng</div>
    );
  }

  const isCurrentTrack =
    typeof (music as IMusic).audio === "string" &&
    currentMusic?.id === music?.id;
  const waveColor = "#f43f5e";

  const coverBlock = music.cover ? (
    <BorderPro roundedSize="rounded-md">
      <img
        src={music.cover}
        alt=""
        className="size-12 shrink-0 rounded-md object-cover shadow-sm md:size-14"
      />
    </BorderPro>
  ) : (
    <div className="size-12 rounded-2xl bg-zinc-800 md:size-14" />
  );

  const titleBlock = (
    <div
      className={cn(
        "flex-2 min-w-0 flex-1 flex-col pb-2 text-black dark:text-white",
        border && "border-b border-white/10"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
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

        <div className="flex shrink-0 items-center gap-2">
          {date && (
            <div className="hidden font-apple text-xs font-medium text-zinc-400 md:flex">
              {new Date(date).toLocaleDateString("vi-VN")}
            </div>
          )}

          {duration && (
            <div className="font-apple text-sm text-zinc-400">{duration}</div>
          )}

          {isCurrentTrack ? (
            <DynamicIslandWave
              isPlay={isPlaying}
              coverUrl={music.cover}
              color={waveColor}
            />
          ) : (
            item && (
              <button
                type="button"
                className="flex items-center"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onPointerUp={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  menu.openMenu();
                }}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );

  /** Hàng đợi player: kéo chỉ từ handle (touch-friendly), tap phần còn lại để phát. */
  if (draggable) {
    return (
      <>
        <AudioItemContextMenu
          music={music as IMusic}
          userId={user?.id}
          open={menu.showMenu}
          isDesktop={menu.isDesktop}
          desktopOverlayPosition={menu.desktopOverlayPosition}
          menuPlacement={menu.menuPlacement}
          menuRef={menu.menuRef}
          overlayRef={menu.overlayRef}
          onClose={menu.closeMenu}
          onPlay={handlePlay}
        />

        <div
          className={cn("flex w-full items-center gap-2 md:gap-3", className)}
        >
          <div
            role="button"
            tabIndex={0}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            onClick={() => handlePlay?.()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handlePlay?.();
              }
            }}
          >
            {coverBlock}
            {titleBlock}
          </div>

          <button
            type="button"
            aria-label="Kéo để sắp xếp trong hàng đợi"
            data-queue-drag-handle
            className={cn(
              "flex size-11 shrink-0 cursor-grab touch-none items-center justify-center rounded-xl active:cursor-grabbing",
              "text-white/35 hover:text-white/55"
            )}
            style={{ touchAction: "none" }}
            onPointerDown={(event) => {
              event.stopPropagation();
              onDragHandlePointerDown?.(event.nativeEvent as PointerEvent);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <List size={22} weight="bold" className="pointer-events-none" />
          </button>
        </div>
      </>
    );
  }

  const UnClick = () => {
    return (
      <>
        <AudioItemContextMenu
          music={music as IMusic}
          userId={user?.id}
          open={menu.showMenu}
          isDesktop={menu.isDesktop}
          desktopOverlayPosition={menu.desktopOverlayPosition}
          menuPlacement={menu.menuPlacement}
          menuRef={menu.menuRef}
          overlayRef={menu.overlayRef}
          onClose={menu.closeMenu}
          onPlay={handlePlay}
        />

        <div
          ref={menu.rootRef}
          className={cn(`flex w-full items-center gap-3`, className)}
          onPointerDown={(event) => {
            menu.handlePointerDown(event);
          }}
          onPointerUp={() => {
            menu.handlePointerUp();
          }}
          onPointerLeave={() => {
            menu.handlePointerLeave();
          }}
          onContextMenu={menu.handleContextMenu}
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
                <div className="font-apple text-sm text-zinc-400">
                  {duration}
                </div>
              )}

              {isCurrentTrack ? (
                <DynamicIslandWave
                  isPlay={isPlaying}
                  coverUrl={music.cover}
                  color={waveColor}
                />
              ) : (
                item && (
                  <button
                    type="button"
                    className="flex items-center"
                    onPointerDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onPointerUp={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      menu.openMenu();
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return <UnClick />;
}
