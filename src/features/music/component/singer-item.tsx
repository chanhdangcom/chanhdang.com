"use client";
import Image from "next/image";
import { ISingerItem } from "../type/singer";
import { BorderPro } from "./border-pro";
import { motion } from "framer-motion";

type IProp = {
  music: ISingerItem;
  onClick: (id: string) => void;
};

export function SingerItem({ music, onClick }: IProp) {
  const handleClick = () => {
    const id = music.id ?? music._id;
    if (id) {
      onClick(id);
    }
  };

  // Validate cover URL to prevent "Failed to construct 'URL': Invalid URL" error
  const isValidUrl = (url: string | undefined | null): boolean => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      return false;
    }
    try {
      new URL(url);
      return true;
    } catch {
      // If it's a relative URL, check if it starts with /
      return url.startsWith("/");
    }
  };

  const hasValidCover = music.cover && isValidUrl(music.cover);

  return (
    <motion.div whileTap={{ scale: 0.8 }} onClick={handleClick}>
      {hasValidCover ? (
        <BorderPro roundedSize="rounded-full">
          <Image
            alt="singer cover"
            width={300}
            height={300}
            src={music.cover}
            className="size-44 rounded-full object-cover md:size-52"
          />
        </BorderPro>
      ) : (
        <div className="size-44 rounded-full bg-zinc-600 md:size-44"></div>
      )}

      <div className="mt-2 line-clamp-1 flex justify-center font-semibold text-black dark:text-white">
        {music.singer}
      </div>
    </motion.div>
  );
}
