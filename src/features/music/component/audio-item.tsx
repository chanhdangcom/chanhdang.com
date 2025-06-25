import { IMusic } from "@/features/profile/types/music";
import Image from "next/image";

type IProp = {
  music: IMusic;
  handlePlay: () => void;
};

export function AuidoItem({ music, handlePlay }: IProp) {
  return (
    <>
      <div
        className="w-fit shrink-0 cursor-pointer space-y-2 rounded-3xl p-4 text-zinc-50 hover:bg-zinc-900"
        onClick={handlePlay}
      >
        {music.cover ? (
          <Image
            height={300}
            width={300}
            alt="cover"
            src={music.cover}
            quality={100}
            className="mx-auto size-36 justify-center rounded-3xl object-cover md:size-44"
          />
        ) : (
          <div className="size-32 rounded-2xl bg-zinc-800"></div>
        )}

        <div className="">
          <div className="line-clamp-1 w-32 font-semibold">
            {music.title || "TITLE"}
          </div>
          <div className="line-clamp-1 w-32 text-zinc-500">
            {music.singer || "SINGER"}
          </div>
        </div>
      </div>
    </>
  );
}
