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
import { Footer } from "@/app/[locale]/features/profile/footer";
import { CaretLeft } from "phosphor-react";

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
        <div className="relative z-10 space-y-4">
          <div className="my-4 hidden md:ml-[270px] md:block">
            <HeaderMusicPage name="Library" />
          </div>

          <div className="sticky top-0 z-10 m-4 flex items-center gap-1 md:hidden">
            <Link href={withLocale("/music")}>
              <div className="pointer-events-auto rounded-full bg-zinc-200 p-2 dark:bg-zinc-900">
                <CaretLeft
                  size={28}
                  weight="regular"
                  className="text-black dark:text-white"
                />
              </div>
            </Link>
          </div>

          <div className="mx-4 md:ml-[270px]">
            <Link href={withLocale("/music/search")} className="">
              <Input
                type="text"
                placeholder="Music, Playlist ..."
                className="z-10 rounded-3xl border-none bg-white shadow-lg dark:bg-zinc-800 md:w-[40vw]"
              />
            </Link>
          </div>

          <div className="mx-4 md:ml-[270px]">
            <div className="gap-4 md:flex">
              <div className="space-y-2">
                <Link
                  href={withLocale("/music/library/favorites")}
                  className=" "
                >
                  <img
                    src="/img/favorites-icon.jpg"
                    alt="favorites"
                    className="flex size-48 items-center justify-center rounded-3xl border border-zinc-200 dark:border-none"
                  />
                </Link>

                <div className="ml-2 font-semibold text-black dark:text-white">
                  Favorite Songs
                </div>
              </div>

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

        <div className="mt-8 md:ml-60">
          <Footer />
        </div>
      </div>
    </div>
  );
}
