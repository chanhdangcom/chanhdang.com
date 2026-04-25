"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { BackButton } from "@/features/music/component/back-button";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { HeaderMusicPage } from "@/features/music/header-music-page";
import { LibraryTracksList } from "@/features/music/library/library-tracks-list";
import { MenuBar } from "@/features/music/menu-bar";
import { PlaylistCover } from "@/features/music/component/playlist-cover";
import { buildUserAuthHeaders } from "@/lib/client-auth";
import { useUser } from "@/hooks/use-user";
import { ISingerItem } from "@/features/music/type/singer";
import { IPlaylistItem } from "@/features/music/type/playlist";

type FriendProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  friendCode: string;
  relationshipStatus: "friends" | "self" | "none" | "incoming" | "outgoing";
};

type LibraryArtistEntry = {
  _id: string;
  resourceId: string;
  resourceData?: ISingerItem;
};

type LibraryPlaylistEntry = {
  _id: string;
  resourceId: string;
  resourceData?: IPlaylistItem;
};

type OwnedPlaylist = IPlaylistItem & {
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

export function FriendLibraryPage() {
  const { user } = useUser();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const targetUserId = params?.userId as string;
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [artists, setArtists] = useState<LibraryArtistEntry[]>([]);
  const [playlists, setPlaylists] = useState<LibraryPlaylistEntry[]>([]);
  const [ownedPlaylists, setOwnedPlaylists] = useState<OwnedPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFriendLibrary = async () => {
      if (!targetUserId) {
        setError("Friend library not found.");
        setIsLoading(false);
        return;
      }

      if (!user?.id) {
        setError("Please sign in to view friend libraries.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const [
          profileResponse,
          artistsResponse,
          playlistsResponse,
          ownedPlaylistsResponse,
        ] = await Promise.all([
          fetch(`/api/users/${targetUserId}`, {
            headers: buildUserAuthHeaders(user.id),
          }),
          fetch(`/api/library?userId=${targetUserId}&type=singer`, {
            headers: buildUserAuthHeaders(user.id),
          }),
          fetch(`/api/library?userId=${targetUserId}&type=playlist`, {
            headers: buildUserAuthHeaders(user.id),
          }),
          fetch(
            `/api/playlists?ownerId=${targetUserId}&userId=${encodeURIComponent(user.id)}&lite=1`,
            {
              headers: buildUserAuthHeaders(user.id),
            }
          ),
        ]);

        const profileData = (await profileResponse.json()) as {
          user?: FriendProfile;
          error?: string;
        };

        if (!profileResponse.ok || !profileData.user) {
          throw new Error(
            profileData.error || "Could not load friend profile."
          );
        }

        if (
          profileData.user.relationshipStatus !== "friends" &&
          profileData.user.relationshipStatus !== "self"
        ) {
          throw new Error("You can only view the library of accepted friends.");
        }

        if (
          !artistsResponse.ok ||
          !playlistsResponse.ok ||
          !ownedPlaylistsResponse.ok
        ) {
          const artistsData = (await artistsResponse
            .json()
            .catch(() => ({ error: "Failed to load artists" }))) as {
            error?: string;
          };
          const playlistsData = (await playlistsResponse
            .json()
            .catch(() => ({ error: "Failed to load playlists" }))) as {
            error?: string;
          };
          const ownedPlaylistsData = (await ownedPlaylistsResponse
            .json()
            .catch(() => ({ error: "Failed to load created playlists" }))) as {
            error?: string;
          };
          throw new Error(
            artistsData.error || playlistsData.error || ownedPlaylistsData.error
          );
        }

        setProfile(profileData.user);
        setArtists((await artistsResponse.json()) as LibraryArtistEntry[]);
        setPlaylists(
          (await playlistsResponse.json()) as LibraryPlaylistEntry[]
        );
        setOwnedPlaylists(
          (await ownedPlaylistsResponse.json()) as OwnedPlaylist[]
        );
      } catch (loadError) {
        console.error("Error loading friend library:", loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load this library."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadFriendLibrary();
  }, [targetUserId, user?.id]);

  return (
    <div className="font-apple">
      <MenuBar />

      <MotionHeaderMusic name={profile?.displayName || "Friend Library"} />

      <BackButton />

      <div className="my-4 hidden md:ml-[270px] md:block">
        <HeaderMusicPage name="Friend Library" />
      </div>

      <div className="mx-4 mt-16 space-y-6 md:mx-8 md:ml-[270px] md:mt-0">
        {isLoading ? (
          <div className="text-sm text-zinc-500">Loading friend library...</div>
        ) : error ? (
          <div className="rounded-3xl border border-dashed px-4 py-8 text-sm text-rose-500 dark:border-zinc-800">
            {error}
          </div>
        ) : profile ? (
          <>
            <section className="rounded-3xl border p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="size-16 object-cover"
                    />
                  ) : (
                    <span className="text-xs text-zinc-500">Avatar</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-lg font-semibold">
                    {profile.displayName || profile.username}
                  </div>
                  <div className="truncate text-sm text-zinc-500">
                    @{profile.username}
                  </div>
                  <div className="text-xs text-zinc-400">
                    Friend code: {profile.friendCode}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-lg font-semibold">Favorite songs</div>
              <LibraryTracksList
                userId={targetUserId}
                authUserId={user?.id}
                emptyMessage="This friend has no favorite songs yet."
              />
            </section>

            <section className="rounded-3xl border p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 text-lg font-semibold">Favorite artists</div>

              {artists.length === 0 ? (
                <div className="text-sm text-zinc-500">
                  This friend has no favorite artists yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {artists.map((entry) => {
                    const artist = entry.resourceData;
                    const artistId =
                      artist?.id ?? artist?._id ?? entry.resourceId;

                    if (!artist || !artistId) return null;

                    return (
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

                          <div className="flex-1 flex-row space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">
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
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 text-lg font-semibold">
                Created playlists
              </div>

              {ownedPlaylists.length === 0 ? (
                <div className="text-sm text-zinc-500">
                  This friend has not created any playlist yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {ownedPlaylists.map((playlist) => (
                    <Link
                      key={playlist.id}
                      href={`/${locale}/music/playlist/${playlist.id}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <PlaylistCover
                          cover={playlist.cover}
                          title={playlist.title || "Playlist cover"}
                          className="size-14 rounded-xl md:size-20"
                        />

                        <div className="flex-1 flex-row space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {playlist.title || "Playlist"}
                              </div>
                              <div className="text-sm text-zinc-500">
                                {playlist.singer || profile.displayName}
                              </div>
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
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 text-lg font-semibold">Saved playlists</div>

              {playlists.length === 0 ? (
                <div className="text-sm text-zinc-500">
                  This friend has no saved playlists yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {playlists.map((entry) => {
                    const playlist = entry.resourceData;
                    const playlistId = playlist?.id ?? entry.resourceId;

                    if (!playlist || !playlistId) return null;

                    return (
                      <Link
                        key={entry._id}
                        href={`/${locale}/music/playlist/${playlistId}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex flex-1 items-center gap-2">
                          <PlaylistCover
                            cover={playlist.cover}
                            title={playlist.title || "Playlist cover"}
                            className="size-14 rounded-xl md:size-20"
                          />

                          <div className="flex-1 flex-row space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">
                                  {playlist.title || "Playlist"}
                                </div>
                                <div className="text-sm text-zinc-500">
                                  {playlist.singer || "ChanhDang Music"}
                                </div>
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
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>

      <div className="h-32" />
    </div>
  );
}
