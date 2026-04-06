"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  CaretRight,
  PencilSimple,
  Plus,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { MenuBar } from "@/features/music/menu-bar";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { BackButton } from "@/features/music/component/back-button";
import { usePermissions } from "@/hooks/use-permissions";
import { useUser } from "@/hooks/use-user";
import { IPlaylistItem } from "../type/playlist";
import { UserPlaylistFormDialog } from "./user-playlist-form-dialog";
import { HeaderMusicPage } from "../header-music-page";
import { BorderPro } from "../component/border-pro";
import { PlaylistCover } from "../component/playlist-cover";
import { useImageHoverColor } from "@/hooks/use-image-hover-color";
import { cn } from "@/lib/utils";
import { getPlaylistCoverPreviewUrl } from "../utils/playlist-cover";

type LibraryPlaylistEntry = {
  _id: string;
  resourceId: string;
  resourceData?: IPlaylistItem;
  createdAt?: string;
};

type OwnedPlaylist = IPlaylistItem & {
  createdAt?: string;
};

type OwnedPlaylistItemProps = {
  playlist: OwnedPlaylist;
  locale: string;
  onEdit: (playlist: IPlaylistItem) => void;
  onDelete: (playlistId: string) => void;
};

function OwnedPlaylistItem({
  playlist,
  locale,
  onEdit,
  onDelete,
}: OwnedPlaylistItemProps) {
  const router = useRouter();
  const [isEnter, setIsEnter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [desktopOverlayPosition, setDesktopOverlayPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const didLongPressRef = useRef(false);
  const instanceId = useId();
  const coverUrl = getPlaylistCoverPreviewUrl(playlist.cover);
  const hoverBg = useImageHoverColor(coverUrl, { alpha: 0.12 });
  const cardLayoutId = `owned-playlist-item-${playlist.id}-${instanceId}`;

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleOpenPlaylist = () => {
    router.push(`/${locale}/music/playlist/${playlist.id}`);
  };

  const handlePointerDown = () => {
    clearLongPressTimer();
    didLongPressRef.current = false;
    longPressTimerRef.current = window.setTimeout(() => {
      didLongPressRef.current = true;
      setShowMenu(true);
    }, 500);
  };

  const handlePointerUp = () => {
    clearLongPressTimer();
    if (!didLongPressRef.current) {
      handleOpenPlaylist();
    }
  };

  const handlePointerLeave = () => {
    clearLongPressTimer();
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    clearLongPressTimer();
    didLongPressRef.current = true;
    setShowMenu(true);
  };

  useEffect(() => {
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    updateIsDesktop();
    window.addEventListener("resize", updateIsDesktop);
    return () => window.removeEventListener("resize", updateIsDesktop);
  }, []);

  useEffect(() => {
    if (!showMenu) return;

    const handleGlobalPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      const clickedInsideRoot = !!(
        rootRef.current &&
        target &&
        rootRef.current.contains(target)
      );
      const clickedInsideMenu = !!(
        menuRef.current &&
        target &&
        menuRef.current.contains(target)
      );
      const clickedInsideOverlay = !!(
        overlayRef.current &&
        target &&
        overlayRef.current.contains(target)
      );

      if (!clickedInsideRoot && !clickedInsideMenu && !clickedInsideOverlay) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleGlobalPointerDown);
    document.addEventListener("touchstart", handleGlobalPointerDown);

    return () => {
      document.removeEventListener("mousedown", handleGlobalPointerDown);
      document.removeEventListener("touchstart", handleGlobalPointerDown);
    };
  }, [showMenu]);

  useEffect(() => {
    if (!showMenu) {
      setDesktopOverlayPosition(null);
      return;
    }

    const updateDesktopOverlayPosition = () => {
      const rect = rootRef.current?.getBoundingClientRect();

      if (!rect || window.innerWidth < 768) {
        setDesktopOverlayPosition(null);
        return;
      }

      setDesktopOverlayPosition({
        left: rect.left,
        top: rect.top,
      });
    };

    updateDesktopOverlayPosition();
    window.addEventListener("resize", updateDesktopOverlayPosition);
    document.addEventListener("scroll", updateDesktopOverlayPosition, true);

    return () => {
      window.removeEventListener("resize", updateDesktopOverlayPosition);
      document.removeEventListener(
        "scroll",
        updateDesktopOverlayPosition,
        true
      );
    };
  }, [showMenu]);

  const closeMenu = () => {
    setShowMenu(false);
  };

  const renderMenuContent = () => (
    <div className="px-4 py-2">
      <div className="space-y-2">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-xl text-left text-sm hover:bg-black/5 dark:hover:bg-white/5"
          onClick={() => {
            closeMenu();
            onEdit(playlist);
          }}
        >
          <PencilSimple size={16} weight="bold" />

          <span className="font-medium">Edit</span>
        </button>
      </div>

      <div className="mt-2 border-t border-black/10 pt-2 dark:border-white/10">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-xl text-left text-sm text-rose-500 hover:bg-rose-500/10"
          onClick={() => {
            closeMenu();
            onDelete(playlist.id);
          }}
        >
          <Trash size={16} weight="bold" />

          <span className="font-medium">Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showMenu &&
        isDesktop &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-[4px]" />,
          document.body
        )}

      {showMenu &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-[4px]">
            <div
              ref={overlayRef}
              className={cn(
                "pointer-events-auto absolute flex scale-105 flex-col items-center",
                isDesktop ? "" : "left-1/2 top-28 -translate-x-1/2"
              )}
              style={
                isDesktop && desktopOverlayPosition
                  ? {
                      left: desktopOverlayPosition.left,
                      top: desktopOverlayPosition.top,
                    }
                  : undefined
              }
            >
              <motion.div
                layoutId={cardLayoutId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                className="w-[min(88vw,28rem)] rounded-3xl md:w-[26rem]"
              >
                <div
                  className="flex items-center gap-3 rounded-2xl bg-white/70 p-2 dark:bg-zinc-950/60"
                  onClick={handleOpenPlaylist}
                >
                  <BorderPro roundedSize="rounded-xl">
                    <PlaylistCover
                      cover={playlist.cover}
                      title={playlist.title || "Playlist cover"}
                      className="size-16 rounded-xl md:size-20"
                    />
                  </BorderPro>

                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-sm font-semibold text-black dark:text-white">
                      {playlist.title || "Playlist"}
                    </div>
                    <div className="line-clamp-1 text-xs text-zinc-500">
                      {playlist.musicIds?.length ?? 0} songs
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut", delay: 0.06 }}
                ref={menuRef}
                className={cn(
                  "z-[130] mt-2 w-[min(88vw,28rem)] rounded-3xl border border-white/15 bg-white/75 text-black shadow-2xl backdrop-blur-md dark:bg-zinc-950/75 dark:text-white md:w-[18rem]",
                  isDesktop ? "absolute left-0 top-[calc(100%+8px)] mt-0" : ""
                )}
              >
                {renderMenuContent()}
              </motion.div>
            </div>
          </div>,
          document.body
        )}

      <motion.div
        layoutId={cardLayoutId}
        animate={{ scale: showMenu ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{
          opacity: showMenu ? 0 : 1,
          pointerEvents: showMenu ? "none" : undefined,
        }}
      >
        <div
          ref={rootRef}
          onMouseEnter={() => setIsEnter(true)}
          onMouseLeave={() => setIsEnter(false)}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onContextMenu={handleContextMenu}
          className="cursor-pointer rounded-2xl transition-colors"
          style={{
            backgroundColor: isEnter ? hoverBg : "transparent",
            transition: "background-color 150ms ease",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
              <PlaylistCover
                cover={playlist.cover}
                title={playlist.title || "Playlist cover"}
                className="size-14 rounded-xl md:size-20"
              />

              <div className="flex-1 flex-row space-y-4 font-apple">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-black dark:text-white">
                    {playlist.title || "Playlist"}
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
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function LibraryFavoritePlaylistsPage() {
  const { user } = useUser();
  const { canUseLibrary } = usePermissions();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [favoritePlaylists, setFavoritePlaylists] = useState<
    LibraryPlaylistEntry[]
  >([]);
  const [ownedPlaylists, setOwnedPlaylists] = useState<OwnedPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<IPlaylistItem | null>(
    null
  );

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchPlaylists = async () => {
      try {
        const [favoriteResponse, ownedResponse] = await Promise.all([
          fetch(`/api/library?userId=${user.id}&type=playlist`),
          fetch(`/api/playlists?ownerId=${user.id}&userId=${user.id}&lite=1`),
        ]);

        if (favoriteResponse.ok) {
          const data =
            (await favoriteResponse.json()) as LibraryPlaylistEntry[];
          setFavoritePlaylists(data);
        }

        if (ownedResponse.ok) {
          const data = (await ownedResponse.json()) as OwnedPlaylist[];
          setOwnedPlaylists(data);
        }
      } catch (error) {
        console.error("Error fetching playlists page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlaylists();
  }, [user?.id]);

  const reloadPlaylists = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const [favoriteResponse, ownedResponse] = await Promise.all([
        fetch(`/api/library?userId=${user.id}&type=playlist`),
        fetch(`/api/playlists?ownerId=${user.id}&userId=${user.id}&lite=1`),
      ]);

      if (favoriteResponse.ok) {
        const data = (await favoriteResponse.json()) as LibraryPlaylistEntry[];
        setFavoritePlaylists(data);
      }

      if (ownedResponse.ok) {
        const data = (await ownedResponse.json()) as OwnedPlaylist[];
        setOwnedPlaylists(data);
      }
    } catch (error) {
      console.error("Error reloading playlists page data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = () => {
    setEditingPlaylist(null);
    setIsDialogOpen(true);
  };

  const handleEditPlaylist = (playlist: IPlaylistItem) => {
    setEditingPlaylist(playlist);
    setIsDialogOpen(true);
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!user?.id) return;
    if (!window.confirm("Delete this playlist?")) return;

    try {
      const response = await fetch(
        `/api/playlists/${playlistId}?userId=${user.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(data.error || "Could not delete playlist.");
        return;
      }

      await reloadPlaylists();
    } catch (error) {
      console.error("Error deleting user playlist:", error);
      alert("Could not delete playlist.");
    }
  };

  const renderPlaylistCard = (
    key: string,
    playlistId: string,
    title: string,
    subtitle: string,
    cover?: string
  ) => (
    <div key={key}>
      <Link
        href={`/${locale}/music/playlist/${playlistId}`}
        className="flex items-center justify-between"
      >
        <div className="flex flex-1 items-center gap-2">
          <PlaylistCover
            cover={cover}
            title={title || "Playlist cover"}
            className="size-14 rounded-xl md:size-20"
          />

          <div className="flex-1 flex-row space-y-4 font-apple">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-black dark:text-white">
                  {title || "Playlist"}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {subtitle}
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
    </div>
  );

  return (
    <div className="font-apple">
      <MenuBar />

      <MotionHeaderMusic name="Favorite Playlists" />

      <BackButton />

      <div className="my-4 hidden md:ml-[270px] md:block">
        <HeaderMusicPage name="Favorite Playlists" />
      </div>

      <div className="mx-4 mt-16 md:mx-8 md:ml-[270px] md:mt-0">
        {!canUseLibrary ? (
          <div className="py-8 text-center text-zinc-500">
            You need Premium to use your playlist library.
            <Link
              href={`/${locale}/music/premium`}
              className="ml-1 font-semibold text-amber-700 underline"
            >
              Upgrade now
            </Link>
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center text-zinc-500">Loading...</div>
        ) : (
          <div className="space-y-4">
            <section className="space-y-2">
              <div className="absolute right-4 top-2 z-50 md:right-8 md:top-8">
                {user?.id ? (
                  <button
                    type="button"
                    onClick={handleCreatePlaylist}
                    className="rounded-md bg-black/10 p-1.5 shadow-sm dark:bg-white/10"
                  >
                    <Plus size={25} weight="bold" className="text-rose-600" />
                  </button>
                ) : null}
              </div>

              {ownedPlaylists.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-zinc-300 px-4 py-8 text-center text-zinc-500 dark:border-zinc-800">
                  You have not created any playlist yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {ownedPlaylists.map((playlist) => (
                    <OwnedPlaylistItem
                      key={playlist.id}
                      playlist={playlist}
                      locale={locale}
                      onEdit={handleEditPlaylist}
                      onDelete={handleDeletePlaylist}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4">
              {favoritePlaylists.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-zinc-300 px-4 py-8 text-center text-zinc-500 dark:border-zinc-800">
                  You have not favorited any playlists yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {favoritePlaylists.map((entry) => {
                    const playlist = entry.resourceData;
                    const playlistId = playlist?.id ?? entry.resourceId;

                    if (!playlist || !playlistId) {
                      return null;
                    }

                    return renderPlaylistCard(
                      entry._id,
                      playlistId,
                      playlist.title || "Playlist",
                      playlist.singer || "ChanhDang Music",
                      playlist.cover
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      <div className="h-32" />

      <UserPlaylistFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSaved={reloadPlaylists}
        user={
          user
            ? {
                id: user.id,
                username: user.username,
                displayName: user.displayName ?? undefined,
                avatarUrl: user.avatarUrl,
              }
            : null
        }
        playlist={editingPlaylist}
      />
    </div>
  );
}
