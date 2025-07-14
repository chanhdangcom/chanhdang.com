import { IMusic } from "@/features/profile/types/music";
// import Image from "next/image";

type IProp = {
  music: IMusic;
  handlePlay?: () => void;
};

export function AuidoItem({ music, handlePlay }: IProp) {
  return (
    <>
      <div
        className="w-40 shrink-0 cursor-pointer space-y-2 rounded-xl p-1.5 text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:w-52"
        onClick={handlePlay}
      >
        {music.cover ? (
          // <Image
          //   height={300}
          //   width={300}
          //   alt="cover"
          //   src={music.cover}
          //   quality={100}
          //   className="mx-auto h-40 w-40 justify-center rounded-lg object-cover md:size-44"
          // />

          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={music.cover}
            alt="cover"
            className="mx-auto h-40 w-40 shrink-0 justify-center rounded-lg object-cover md:size-52"
          />
        ) : (
          <div className="size-40 rounded-2xl bg-zinc-800"></div>
        )}

        <div className="text-black dark:text-white">
          <div className="line-clamp-1 w-32 text-sm font-semibold">
            {music.title || "TITLE"}
          </div>

          <div className="line-clamp-1 w-32 text-sm text-zinc-500">
            {music.singer || "SINGER"}
          </div>
        </div>
      </div>
    </>
  );
}
