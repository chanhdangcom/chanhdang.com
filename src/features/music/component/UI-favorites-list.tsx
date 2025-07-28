import { Heart, Play, Shuffle } from "phosphor-react";

export function UIFavoritesList() {
  return (
    <>
      <div className="w-full flex-col items-center md:flex-none">
        {/* Header với icon heart */}
        <div className="flex justify-center">
          <div className="mx-auto my-4 flex size-60 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-pink-500 shadow-2xl">
            <Heart
              weight="fill"
              size={80}
              className="text-white"
              fill="white"
            />
          </div>
        </div>

        {/* Title section */}
        <div className="space-y-2 text-6xl">
          <div className="flex items-center justify-center gap-1">
            <div className="text-2xl font-semibold">Bài hát yêu thích</div>
          </div>

          <div className="text-center text-lg text-zinc-500">
            ChanhDang Music
          </div>

          <div className="mx-4 space-y-4">
            <div className="flex w-full justify-between gap-4">
              <div className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-1 font-semibold text-red-500 dark:bg-zinc-900">
                <Play weight="fill" size={20} />
                <div className="text-xl">Play All</div>
              </div>

              <div className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-2 font-semibold text-red-500 dark:bg-zinc-900">
                <Shuffle size={20} />
                <div className="text-xl">Mix song</div>
              </div>
            </div>
          </div>

          <div className="text-center text-base text-zinc-500">
            <div className="text-balance">
              Tận hưởng bữa tiệc âm nhạc đầy đặc sắc với các bài hát yêu thích
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
