"use client";

import { HeaderMusicPage } from "@/features/music/header-music-page";
import { MenuBar } from "@/features/music/menu-bar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { BackButton } from "../component/back-button";
import { usePermissions } from "@/hooks/use-permissions";
import { useMusicAccessRedirect } from "@/hooks/use-music-access-redirect";
import { MusicNote } from "@/components/icon/music-note";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { MusicNoteSquareStackFill } from "@/components/icon/music-note-square-stack-fill";
import { MusicMicrophone } from "@/components/icon/music-microphone";
import { MusicNoteList } from "@/components/icon/music-note-list";

export function LibraryPage() {
  // const { user } = useUser();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;
  const { canUseLibrary, isLoading } = usePermissions();
  const isAccessBlocked = useMusicAccessRedirect(!canUseLibrary, isLoading);

  if (isAccessBlocked) {
    return null;
  }

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

          <div className="mx-4 space-y-6 md:ml-[270px]">
            <Link
              href={withLocale("/music/library/playlists")}
              className="flex items-center justify-between"
            >
              <div className="flex flex-1 items-center gap-2">
                <MusicNoteList className="size-8 text-rose-500 dark:text-rose-600" />

                <div className="flex-1 flex-row space-y-2 font-apple">
                  <div className="flex items-center justify-between">
                    <div>Playlists</div>

                    <CaretRight
                      size={20}
                      weight="bold"
                      className="text-white/30"
                    />
                  </div>

                  <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-900" />
                </div>
              </div>
            </Link>

            <Link
              href={withLocale("/music/library/artists")}
              className="flex items-center justify-between"
            >
              <div className="flex flex-1 items-center gap-2">
                <MusicMicrophone className="size-8 text-rose-500 dark:text-rose-600" />

                <div className="flex-1 flex-row space-y-2 font-apple">
                  <div className="flex items-center justify-between">
                    <div>Artists</div>

                    <CaretRight
                      size={20}
                      weight="bold"
                      className="text-white/30"
                    />
                  </div>

                  <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-900" />
                </div>
              </div>
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex flex-1 items-center gap-2">
                <MusicNoteSquareStackFill className="size-8 text-rose-500 dark:text-rose-600" />

                <div className="flex-1 flex-row space-y-2 font-apple">
                  <div className="flex items-center justify-between">
                    <div>Albums</div>

                    <CaretRight
                      size={20}
                      weight="bold"
                      className="text-white/30"
                    />
                  </div>

                  <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-900" />
                </div>
              </div>
            </div>

            <Link
              href={withLocale("/music/library/favorites")}
              className="flex items-center justify-between"
            >
              <div className="flex flex-1 items-center gap-2">
                <MusicNote className="size-8 text-rose-500 dark:text-rose-600" />

                <div className="flex-1 flex-row space-y-2 font-apple">
                  <div className="flex items-center justify-between">
                    <div>Songs</div>

                    <CaretRight
                      size={20}
                      weight="bold"
                      className="text-white/30"
                    />
                  </div>

                  <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-900" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
