/* eslint-disable @next/next/no-img-element */

import { IMusic } from "@/app/[locale]/features/profile /types/music";
import { IPlaylistItem } from "../type/playlist";
import { cn } from "@/lib/utils";
import { BorderPro } from "./border-pro";

type IProp = {
  music: IMusic | IPlaylistItem;
  handlePlay?: () => void;
  className?: string;
  classNameOrder?: string;
  item?: React.ReactNode;
};

export function AudioItemOrder({ music, handlePlay, className, item }: IProp) {
  if (!music) {
    return <div className="text-red-500">Dữ liệu nhạc chưa sẵn sàng</div>;
  }

  const UnClick = () => {
    return (
      <div className="flex w-full items-center gap-3" onClick={handlePlay}>
        {music.cover ? (
          <BorderPro roundedSize="rounded-md">
            <img
              src={music.cover}
              alt="cover"
              className={cn(
                "size-12 shrink-0 rounded-md object-cover shadow-sm md:size-14",
                className
              )}
            />
          </BorderPro>
        ) : (
          <div className="size-12 rounded-2xl bg-zinc-800"></div>
        )}

        <div className="flex-2 flex-1 flex-col border-b border-zinc-200 pb-2 text-black dark:border-zinc-900 dark:text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <span className="line-clamp-1">
                  {music.title || "TITLE SONG"}
                </span>
              </div>

              <div className="line-clamp-1 text-sm text-zinc-400">
                {music.singer || "SINGER"}
              </div>
            </div>

            {/* <DotsThree size={20} weight="bold" /> */}
            <div>{item}</div>
          </div>
        </div>
      </div>
    );
  };

  return <UnClick />;
}
