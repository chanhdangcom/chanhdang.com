"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { AudioBar } from "@/features/music/audio-bar";
import { MenuBar } from "@/features/music/menu-bar";
import { MenuBarMobile } from "@/features/music/menu-bar-mobile";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { BackButton } from "@/features/music/component/back-button";
import { usePermissions } from "@/hooks/use-permissions";
import { useUser } from "@/hooks/use-user";
import { useMusicAccessRedirect } from "@/hooks/use-music-access-redirect";
import { ISingerItem } from "../type/singer";
import { HeaderMusicPage } from "../header-music-page";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

type LibrarySingerEntry = {
  _id: string;
  resourceId: string;
  resourceData?: ISingerItem;
  createdAt?: string;
};

const getCoverUrl = (cover?: string) => {
  if (!cover) return "/img/Logomark.png";

  try {
    new URL(cover);
    return cover;
  } catch {
    return cover.startsWith("/") ? cover : "/img/Logomark.png";
  }
};

export function LibraryFavoriteArtistsPage() {
  const { user } = useUser();
  const { canUseLibrary, isLoading: isPermissionsLoading } = usePermissions();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isAccessBlocked = useMusicAccessRedirect(
    !canUseLibrary,
    isPermissionsLoading
  );
  const [artists, setArtists] = useState<LibrarySingerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canUseLibrary) {
      setIsLoading(false);
      return;
    }
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchArtists = async () => {
      try {
        const response = await fetch(
          `/api/library?userId=${user.id}&type=singer`
        );
        if (!response.ok) return;

        const data = (await response.json()) as LibrarySingerEntry[];
        setArtists(data);
      } catch (error) {
        console.error("Error fetching favorite artists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchArtists();
  }, [user?.id]);

  if (isAccessBlocked) {
    return null;
  }

  return (
    <div className="font-apple">
      <MenuBar />

      <MotionHeaderMusic name="Favorite Artists" />

      <BackButton />

      <div className="my-4 hidden md:ml-[270px] md:block">
        <HeaderMusicPage name="Library" />
      </div>

      <div className="mx-4 mt-16 py-6 md:mx-8 md:ml-[270px] md:mt-0">
        {isLoading ? (
          <div className="py-8 text-center text-zinc-500">Loading...</div>
        ) : artists.length === 0 ? (
          <div className="py-8 text-center text-zinc-500">
            You have not favorited any artists yet.
          </div>
        ) : (
          <div className="space-y-4">
            {artists.map((entry) => {
              const artist = entry.resourceData;
              const artistId = artist?.id ?? artist?._id ?? entry.resourceId;

              if (!artist || !artistId) {
                return null;
              }

              return (
                <>
                  <Link
                    key={entry._id}
                    href={`/${locale}/music/singer/${artistId}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-1 items-center gap-2">
                      <Image
                        src={getCoverUrl(artist.cover)}
                        alt={artist.singer || "Artist cover"}
                        width={200}
                        height={200}
                        className="size-14 rounded-full object-cover md:size-20"
                      />

                      <div className="flex-1 flex-row space-y-4 font-apple">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-black dark:text-white">
                            {artist.singer || "Artist"}
                          </div>

                          <CaretRight
                            size={20}
                            weight="bold"
                            className="text-black/30 dark:text-white/30"
                          />
                        </div>

                        <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-900" />
                      </div>
                    </div>
                  </Link>
                </>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-32" />

      <AudioBar />
      <MenuBarMobile />
    </div>
  );
}
