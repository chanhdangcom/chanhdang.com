import { IMusic } from "@/features/profile/types/music";
import { FavoriteButton } from "./favorite-button";
import { useUser } from "@/hooks/use-user";

type IProp = {
  music: IMusic;
  handlePlay?: () => void;
};

export function AuidoItem({ music, handlePlay }: IProp) {
  const { user } = useUser();

  return (
    <>
      <div className="w-40 shrink-0 space-y-2 rounded-xl p-1.5 text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:w-52">
        <div className="relative">
          {music.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={music.cover}
              alt="cover"
              className="mx-auto h-40 w-40 shrink-0 cursor-pointer justify-center rounded-lg object-cover md:size-52"
              onClick={handlePlay}
            />
          ) : (
            <div
              className="size-40 cursor-pointer rounded-2xl bg-zinc-800"
              onClick={handlePlay}
            ></div>
          )}

          {/* Nút yêu thích */}
          <div className="absolute right-2 top-2">
            <FavoriteButton music={music} userId={user?.id} size="sm" />
          </div>
        </div>

        <div className="text-black dark:text-white">
          <div
            className="line-clamp-1 w-32 cursor-pointer text-sm font-semibold"
            onClick={handlePlay}
          >
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
