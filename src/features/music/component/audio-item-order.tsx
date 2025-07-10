import { IMusic } from "@/features/profile/types/music";
import Image from "next/image";
import { IPlaylistItem } from "../type/playlist";
import { cn } from "@/lib/utils";

type IProp = {
  music: IMusic | IPlaylistItem;
  handlePlay: () => void;
  className?: string;
  classNameOrder?: string;
};

export function AudioItemOrder({
  music,
  handlePlay,
  className,
  classNameOrder,
}: IProp) {
  if (!music) {
    return <div className="text-red-500">Dữ liệu nhạc chưa sẵn sàng</div>;
  }

  const UnClick = () => {
    return (
      <div className="flex w-60 items-center gap-3" onClick={handlePlay}>
        {music.cover ? (
          <Image
            alt="cover"
            src={music.cover}
            width={300}
            height={300}
            className={cn(
              "size-12 shrink-0 rounded-md object-cover shadow-sm md:size-20",
              className
            )}
          />
        ) : (
          <div className="size-12 rounded-2xl bg-zinc-800"></div>
        )}

        <div className="w-80">
          <div
            className={cn("line-clamp-1 text-sm font-semibold", classNameOrder)}
          >
            {music.title || "TITLE SONG"}
          </div>
          <div className="line-clamp-1 text-sm text-zinc-500">
            {music.singer || "SINGER"}
          </div>
        </div>
      </div>
    );
  };

  return <UnClick />;
}
