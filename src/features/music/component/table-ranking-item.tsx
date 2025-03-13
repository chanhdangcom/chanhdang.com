import Image from "next/image";

type Iprop = {
  title: string;
  singer: string;
  cover: string;
  content: string;
  handlePlay: () => void;
};

export function TableRankingItem({
  title,
  singer,
  cover,
  content,
  handlePlay,
}: Iprop) {
  return (
    <div className="w-[100vh] cursor-pointer" onClick={handlePlay}>
      <div className="flex items-center justify-between">
        <div className="flex w-64 items-center justify-start gap-3">
          {cover ? (
            <Image
              alt="cover"
              src={cover}
              width={300}
              height={300}
              className="size-16 rounded-2xl border border-zinc-900"
            />
          ) : (
            <div className="size-16 rounded-2xl bg-zinc-800"></div>
          )}

          <div>
            <div className="font-semibold">{title || "TITLE SONG"}</div>
            <div className="text-zinc-500">{singer || "SINGER"}</div>
          </div>
        </div>

        <div className="text-zinc-500">{content}</div>

        <div className="text-zinc-500">3:00</div>
      </div>
    </div>
  );
}
