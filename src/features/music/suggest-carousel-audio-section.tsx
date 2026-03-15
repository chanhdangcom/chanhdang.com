"use client";

import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useUser } from "@/hooks/use-user";
import type { IMusic } from "@/app/[locale]/features/profile/types/music";
import { SuggestAuidoListClient } from "./suggest-audio-list-client";

type Props = {
  musics: IMusic[];
  locale?: string;
};

export function SuggestCarouselAudioSection({ musics, locale = "vi" }: Props) {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative w-full rounded-3xl text-black dark:text-white md:max-h-full">
      <div className="flex justify-between">
        <Link
          href={`/${locale}/music/new-release`}
          className="ml-2 flex items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]"
        >
          <div>Suggest for you</div>

          <CaretRight
            size={20}
            weight="bold"
            className="text-zinc-500 md:mt-1"
          />
        </Link>
      </div>

      <SuggestAuidoListClient musics={musics} />
    </div>
  );
}
