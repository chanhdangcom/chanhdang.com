/* eslint-disable @next/next/no-img-element */
import { IMusic } from "@/features/profile/types/music";
import { FavoriteButton } from "./favorite-button";
import { useUser } from "@/hooks/use-user";
import { useState } from "react";
import { Play } from "phosphor-react";
import { motion } from "framer-motion";

type IProp = {
  music: IMusic;
  handlePlay?: () => void;
};

export function AuidoItem({ music, handlePlay }: IProp) {
  const { user } = useUser();

  const [isEnter, setIsEnter] = useState<boolean>(false);

  return (
    <>
      <div
        onMouseEnter={() => setIsEnter(true)}
        onMouseLeave={() => setIsEnter(false)}
        className="w-44 shrink-0 space-y-1 rounded-xl p-2 text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-900 md:w-52"
      >
        <div className="relative">
          {music.cover ? (
            <img
              src={music.cover}
              alt="cover"
              className="mx-auto size-44 shrink-0 cursor-pointer justify-center rounded-lg object-cover md:size-52"
              onClick={handlePlay}
            />
          ) : (
            <div
              className="size-40 cursor-pointer rounded-2xl bg-zinc-800"
              onClick={handlePlay}
            ></div>
          )}

          {isEnter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="pointer-events-none absolute top-0 h-20 w-full rounded-md bg-gradient-to-b from-zinc-900/80 to-transparent"
            ></motion.div>
          )}

          {isEnter && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="absolute right-2 top-2"
            >
              <FavoriteButton music={music} userId={user?.id} size="sm" />
            </motion.div>
          )}

          {isEnter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="absolute bottom-2 right-2"
            >
              <Play
                className="size-10 rounded-full bg-zinc-900/60 p-2 text-zinc-50 backdrop-blur-sm hover:text-red-500"
                weight="fill"
              />
            </motion.div>
          )}
        </div>

        <div className="text-black dark:text-white">
          <div
            className="line-clamp-1 w-32 cursor-pointer text-sm font-semibold"
            onClick={handlePlay}
          >
            {music.title || "TITLE"}
          </div>

          <div className="line-clamp-1 w-32 text-xs text-zinc-500">
            {music.singer || "SINGER"}
          </div>
        </div>
      </div>
    </>
  );
}
