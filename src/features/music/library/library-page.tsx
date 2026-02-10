/* eslint-disable @next/next/no-img-element */
"use client";
import { useUser } from "@/hooks/use-user";
import { HeaderMusicPage } from "@/features/music/header-music-page";
import { MenuBar } from "@/features/music/menu-bar";
import { MenuBarMobile } from "@/features/music/menu-bar-mobile";
import { AudioBar } from "@/features/music/audio-bar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LibraryPlaylistsList } from "@/features/music/library/library-playlists-list";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { Input } from "@/components/ui/input";
import { CaretRight, Star } from "@phosphor-icons/react/dist/ssr";
import { BackButton } from "../component/back-button";

export function LibraryPage() {
  const { user } = useUser();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;

  return (
    <div className="flex font-apple">
      <MenuBar />

      <MotionHeaderMusic name="Library" />

      <div className="pointer-events-none fixed bottom-0 z-50 h-16 w-full bg-gradient-to-t from-white to-transparent dark:from-black" />

      <div className="mx-auto w-full">
        <div className="relative z-10 mt-20 space-y-4 md:mt-0">
          <div className="my-4 hidden md:ml-[270px] md:block">
            <HeaderMusicPage name="Library" />
          </div>

          <BackButton />

          <div className="md mx-4 md:ml-[270px]">
            <Link href={withLocale("/music/search")} className="">
              <Input
                type="text"
                placeholder="Music, Playlist ..."
                className="z-10 rounded-3xl border bg-white dark:border-zinc-800 dark:bg-zinc-800 md:w-[40vw]"
              />
            </Link>
          </div>

          <div className="mx-4 md:ml-[270px]">
            <div className="gap-4 space-y-4 md:space-y-8">
              <Link
                href={withLocale("/music/library/favorites")}
                className="flex items-center justify-between rounded-lg md:mt-8"
              >
                <div className="flex items-center gap-2">
                  <Star weight="fill" className="text-red-500" size={10} />

                  <img
                    src="/img/favorites-icon.jpg"
                    alt="favorites"
                    className="size-14 items-center justify-center rounded-xl border border-zinc-200 hover:scale-105 dark:border-none md:size-24"
                  />

                  <div className="ml-2 font-semibold text-black dark:text-white">
                    Favorite Songs
                  </div>
                </div>

                <CaretRight
                  size={15}
                  weight="bold"
                  className="text-zinc-500 md:hidden"
                />
              </Link>

              <div className="mt-4 md:mt-0">
                <LibraryPlaylistsList userId={user?.id} />
              </div>
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
