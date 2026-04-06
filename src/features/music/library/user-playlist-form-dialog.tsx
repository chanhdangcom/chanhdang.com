"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { IPlaylistItem } from "../type/playlist";
import { PlaylistCover } from "../component/playlist-cover";
import {
  DEFAULT_PLAYLIST_COVER,
  createPlaylistCoverValue,
} from "../utils/playlist-cover";

type MusicLite = {
  id: string;
  title: string;
  singer?: string;
  cover?: string;
};

type UserLite = {
  id: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
};

type UserPlaylistFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  user: UserLite | null;
  playlist?: IPlaylistItem | null;
};

export function UserPlaylistFormDialog({
  open,
  onClose,
  onSaved,
  user,
  playlist,
}: UserPlaylistFormDialogProps) {
  const [title, setTitle] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [allMusics, setAllMusics] = useState<MusicLite[]>([]);
  const [search, setSearch] = useState("");
  const [isLoadingMusics, setIsLoadingMusics] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setTitle(playlist?.title ?? "");
    setSelectedIds(playlist?.musicIds ?? []);
    setSearch("");
    setError(null);
  }, [open, playlist]);

  useEffect(() => {
    if (!open) return;

    const fetchMusics = async () => {
      setIsLoadingMusics(true);
      try {
        const response = await fetch("/api/musics");
        if (!response.ok) {
          throw new Error("Failed to fetch musics");
        }

        const data = (await response.json()) as Array<Record<string, unknown>>;
        const normalized = data
          .map((music) => ({
            id:
              typeof music.id === "string"
                ? music.id
                : typeof music._id === "string"
                  ? music._id
                  : "",
            title: String(music.title ?? ""),
            singer: String(music.singer ?? ""),
            cover: String(music.cover ?? ""),
          }))
          .filter((music) => music.id && music.title);

        setAllMusics(normalized);
      } catch (fetchError) {
        console.error("Error fetching musics for playlist form:", fetchError);
        setError("Could not load songs.");
      } finally {
        setIsLoadingMusics(false);
      }
    };

    void fetchMusics();
  }, [open]);

  const filteredMusics = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return allMusics;

    return allMusics.filter((music) => {
      const haystack = `${music.title} ${music.singer ?? ""}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [allMusics, search]);

  const selectedMusicCovers = useMemo(() => {
    const coversById = new Map(
      allMusics.map((music) => [music.id, music.cover])
    );

    return selectedIds
      .map((musicId) => coversById.get(musicId))
      .filter((cover): cover is string => Boolean(cover));
  }, [allMusics, selectedIds]);

  const generatedCover = useMemo(
    () =>
      createPlaylistCoverValue(
        selectedMusicCovers,
        playlist?.cover || user?.avatarUrl || DEFAULT_PLAYLIST_COVER
      ),
    [playlist?.cover, selectedMusicCovers, user?.avatarUrl]
  );

  const toggleMusic = (musicId: string) => {
    setSelectedIds((prev) =>
      prev.includes(musicId)
        ? prev.filter((id) => id !== musicId)
        : [...prev, musicId]
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.id) {
      setError("Please sign in first.");
      return;
    }

    if (!title.trim()) {
      setError("Playlist name is required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        userId: user.id,
        ownerName: user.displayName || user.username || "You",
        ownerAvatar: user.avatarUrl || "",
        title: title.trim(),
        cover: generatedCover,
        singer: user.displayName || user.username || "Created by you",
        musicIds: selectedIds,
      };

      const isEditing = Boolean(playlist?.id);
      const response = await fetch(
        isEditing ? `/api/playlists/${playlist?.id}` : "/api/playlists",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not save playlist.");
      }

      onSaved();
      onClose();
    } catch (submitError) {
      console.error("Error saving user playlist:", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save playlist."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/55 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl border bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b px-4 py-2 dark:border-zinc-800">
          <div className="font-semibold">
            {playlist ? "Edit Playlist" : "Create Playlist"}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white"
            aria-label="Close"
          >
            <X size={15} weight="bold" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="grid min-h-0 flex-1 gap-2 overflow-hidden p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Playlist name
                </label>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="My playlist"
                  className="mt-1 w-full rounded-2xl border border-zinc-200 bg-transparent bg-zinc-50 px-4 py-2 outline-none transition placeholder:text-sm focus:border-rose-400 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Playlist cover
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-3xl border border-zinc-200 bg-white/60 p-2 dark:border-zinc-800 dark:bg-zinc-950">
                  <PlaylistCover
                    cover={generatedCover}
                    title={title || playlist?.title || "Playlist cover"}
                    className="size-20 rounded-2xl"
                  />

                  <div className="min-w-0 text-sm text-zinc-500 dark:text-zinc-400">
                    {selectedMusicCovers.length >= 2
                      ? "Cover will be generated automatically from the selected songs."
                      : "Select at least 2 songs to create a collage cover."}
                  </div>
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col overflow-hidden">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Search songs
                </label>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title or singer"
                  className="mt-1 w-full rounded-2xl border border-zinc-200 bg-transparent bg-zinc-50 px-4 py-2 outline-none transition focus:border-rose-400 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>

              <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-zinc-200 p-2 dark:border-zinc-800">
                {isLoadingMusics ? (
                  <div className="px-3 py-4 text-sm text-zinc-500">
                    Loading songs...
                  </div>
                ) : filteredMusics.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-zinc-500">
                    No songs found.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredMusics.map((music) => {
                      const checked = selectedIds.includes(music.id);

                      return (
                        <label
                          key={music.id}
                          className="flex cursor-pointer items-start gap-3 rounded-2xl px-3 py-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleMusic(music.id)}
                            className="mt-1"
                          />

                          <div className="min-w-0">
                            <div className="line-clamp-1 text-sm font-medium">
                              {music.title}
                            </div>

                            <div className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                              {music.singer || "Unknown singer"}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t px-4 py-2 shadow-sm dark:border-zinc-800">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {selectedIds.length} song{selectedIds.length === 1 ? "" : "s"}{" "}
              selected
            </div>

            <div className="flex gap-4">
              {" "}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : playlist ? "Save changes" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
