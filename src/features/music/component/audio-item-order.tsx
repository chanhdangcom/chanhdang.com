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
      <div
        className="flex w-64 items-center justify-start gap-3"
        onClick={handlePlay}
      >
        {music.cover ? (
          <Image
            alt="cover"
            src={music.cover}
            width={300}
            height={300}
            className={cn(
              "size-20 shrink-0 rounded-lg object-cover shadow-sm",
              className
            )}
          />
        ) : (
          <div className="size-18 rounded-lg bg-zinc-800"></div>
        )}

        <div>
          <div
            className={cn(
              "line-clamp-1 w-36 text-base font-semibold",
              classNameOrder
            )}
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
