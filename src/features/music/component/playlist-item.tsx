import Image from "next/image";

type IProp = {
  title: string;
  singer: string;
  cover: string;
};

export function PlaylistItem({ title, singer, cover }: IProp) {
  return (
    <>
      <div className="w-fit transform cursor-pointer space-y-2 rounded-3xl p-4 transition-transform duration-300 hover:scale-105 hover:bg-zinc-100 hover:dark:bg-zinc-900">
        {cover ? (
          <Image
            height={300}
            width={300}
            alt="cover"
            src={cover}
            quality={100}
            className="mx-auto size-32 justify-center rounded-2xl border object-cover shadow-sm dark:border-zinc-800"
          />
        ) : (
          <div className="size-32 rounded-2xl bg-zinc-800"></div>
        )}

        <div className="text-center">
          <div className="line-clamp-1 font-semibold">{title || "TITLE"}</div>
          <div className="line-clamp-1 text-zinc-500">{singer || "SINGER"}</div>
        </div>
      </div>
    </>
  );
}
