/* eslint-disable @next/next/no-img-element */

import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { IPlaylistItem } from "../type/playlist";
import { cn } from "@/lib/utils";
import { BorderPro } from "./border-pro";

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
  if (!music) {
    return <div className="text-red-500">Dữ liệu nhạc chưa sẵn sàng</div>;
  }

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
              <div className="text-xs text-zinc-400">
                {new Date(date).toLocaleDateString("vi-VN")}
              </div>
            )}

            {duration && (
              <div className="text-sm text-zinc-400">{duration}</div>
            )}

            {item && <div>{item}</div>}
          </div>
        </div>
      </div>
    );
  };

  return <UnClick />;
}
