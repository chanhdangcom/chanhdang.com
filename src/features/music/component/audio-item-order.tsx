import { IMusic } from "@/features/profile/types/music";
import Image from "next/image";
import { IPlaylistItem } from "../type/playlist";
import { cn } from "@/lib/utils";
import { DotsThree } from "phosphor-react";

type IProp = {
  music: IMusic | IPlaylistItem;
  handlePlay?: () => void;
  className?: string;
  classNameOrder?: string;
};

export function AudioItemOrder({
  music,
  handlePlay,
  className,
  // classNameOrder,
}: IProp) {
  if (!music) {
    return <div className="text-red-500">Dữ liệu nhạc chưa sẵn sàng</div>;
  }

  const UnClick = () => {
    return (
      <div
        className="flex w-80 items-center gap-3 md:w-[50vh]"
        onClick={handlePlay}
      >
        {music.cover ? (
          <Image
            alt="cover"
            src={music.cover}
            width={300}
            height={300}
            className={cn(
              "size-12 shrink-0 rounded-md object-cover shadow-sm md:size-14",
              className
            )}
          />
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

            <DotsThree size={20} weight="bold" />
          </div>
        </div>
      </div>
    );
  };

  return <UnClick />;
}
