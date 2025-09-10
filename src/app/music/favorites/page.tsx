"use client";

import { FavoritesList } from "@/features/music/component/favorites-list";
import { useUser } from "@/hooks/use-user";
import { HeaderMusicPage } from "@/features/music/header-music-page";
import { MenuBar } from "@/features/music/menu-bar";
import { MenuBarMobile } from "@/features/music/menu-bar-mobile";
import { AudioBar } from "@/features/music/audio-bar";

import { UIFavoritesList } from "@/features/music/component/UI-favorites-list";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { Footer } from "@/app/[locale]/features/profile /footer";

export default function FavoritesPage() {
  const { user } = useUser();

  return (
    <div className="flex font-apple">
      <MenuBar />

      <MotionHeaderMusic name="Library" />

      <div className="mx-auto w-full">
        <div className="relative z-10">
          <div className="fixed top-0 z-50 h-24 w-full bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />

          <div className="md:ml-[270px]">
            <HeaderMusicPage name="Library" />
          </div>

          <div className="md:mx-4 md:ml-[270px]">
            <div className="rounded-3xl from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 md:bg-gradient-to-b md:p-4">
              <UIFavoritesList />
              <FavoritesList userId={user?.id} />

              <Footer />
            </div>
          </div>
        </div>

        <div className="my-40">
          <AudioBar />
          <MenuBarMobile />
        </div>
      </div>
    </div>
  );
}
