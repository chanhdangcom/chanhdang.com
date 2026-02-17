"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useIsAdmin } from "@/hooks/use-permissions";
import { useRouter } from "next/navigation";

type MusicLite = {
  id: string;
  title: string;
};

type PlaylistItem = {
  id: string;
  title: string;
  cover: string;
  singer: string;
  musicIds: string[];
};

export function AddPlaylistForm() {
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const t = useTranslations("music.playlist");
  const tError = useTranslations("music.player");
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [singer, setSinger] = useState("");
  const [allMusics, setAllMusics] = useState<MusicLite[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);

  const normalizeId = (value: unknown) => {
    if (typeof value === "string") return value;
    if (value && typeof (value as { toString?: () => string }).toString === "function") {
      return (value as { toString: () => string }).toString();
    }
    return "";
  };

  const resetForm = () => {
    setTitle("");
    setCover("");
    setSinger("");
    setSelectedIds([]);
    setEditingPlaylistId(null);
  };

  const fetchMusics = async () => {
    const res = await fetch("/api/musics", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const mapped = Array.isArray(data)
      ? data
          .map((m: Record<string, unknown>) => ({
              id: normalizeId(m._id) || normalizeId(m.id),
              title: String(m.title ?? ""),
            }))
          .filter((x: MusicLite) => x.id && x.title)
      : [];
    setAllMusics(mapped);
  };

  const fetchPlaylists = async () => {
    const res = await fetch("/api/playlists", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const mapped = Array.isArray(data)
      ? data.map((item: Record<string, unknown>) => {
          const rawMusicIds = Array.isArray(item.musicIds)
            ? item.musicIds
            : Array.isArray(item.musics)
              ? item.musics
              : [];

          const musicIds = rawMusicIds
            .map((entry) => {
              if (typeof entry === "string") return entry;
              if (entry && typeof entry === "object") {
                const record = entry as Record<string, unknown>;
                return (
                  normalizeId(record.id) ||
                  normalizeId(record._id) ||
                  normalizeId(record.musicId)
                );
              }
              return "";
            })
            .filter(Boolean);

          return {
            id: normalizeId(item.id) || normalizeId(item._id),
            title: String(item.title ?? ""),
            singer: String(item.singer ?? ""),
            cover: String(item.cover ?? ""),
            musicIds,
          };
        })
      : [];
    setPlaylists(mapped.filter((item: PlaylistItem) => item.id));
  };

  useEffect(() => {
    if (!isAdmin) {
      router.push("/music");
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        await Promise.all([fetchMusics(), fetchPlaylists()]);
      } catch {
        // ignore
      }
      if (!isMounted) return;
    })();
    return () => {
      isMounted = false;
    };
  }, [isAdmin, router]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAdmin) {
    return (
      <div className="p-4 md:ml-[270px]">
        <h1 className="text-xl font-semibold text-black dark:text-white">
          Không có quyền truy cập
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Chỉ admin mới có quyền quản lý playlist.
        </p>
      </div>
    );
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const canSubmit = title.trim() && cover.trim();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        title: title.trim(),
        cover: cover.trim(),
        singer: singer.trim(),
        musicIds: selectedIds,
      };
      const endpoint = editingPlaylistId
        ? `/api/playlists/${editingPlaylistId}`
        : "/api/playlists";
      const method = editingPlaylistId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage(
          editingPlaylistId ? t("updateSuccess") : t("createSuccess")
        );
        resetForm();
        await fetchPlaylists();
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data?.error || t("saveFailed"));
      }
    } catch {
      setMessage(tError("errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlaylist = (playlist: PlaylistItem) => {
    setEditingPlaylistId(playlist.id);
    setTitle(playlist.title);
    setCover(playlist.cover);
    setSinger(playlist.singer);
    setSelectedIds(playlist.musicIds);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm(t("confirmDelete"))) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/playlists/${playlistId}`, { method: "DELETE" });
      if (res.ok) {
        setMessage(t("deleteSuccess"));
        if (editingPlaylistId === playlistId) {
          resetForm();
        }
        await fetchPlaylists();
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data?.error || t("deleteFailed"));
      }
    } catch {
      setMessage(tError("errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:ml-[270px]">
      <h1 className="mb-4 text-xl font-semibold text-black dark:text-white">
        {editingPlaylistId ? t("editPlaylist") : t("addPlaylist")}
      </h1>

      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm text-zinc-500">{t("titleLabel")}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent p-2 outline-none dark:border-zinc-800"
            placeholder={t("titlePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-500">{t("coverLabel")}</label>
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent p-2 outline-none dark:border-zinc-800"
            placeholder={t("coverPlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-500">
            {t("editorNoteLabel")}
          </label>
          <input
            value={singer}
            onChange={(e) => setSinger(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent p-2 outline-none dark:border-zinc-800"
            placeholder={t("editorNotePlaceholder")}
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-500">
            {t("selectSongsLabel")}
          </label>
          <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-zinc-300 p-2 dark:border-zinc-800">
            {allMusics.length === 0 && (
              <div className="text-sm text-zinc-500">{t("noSongsYet")}</div>
            )}
            {allMusics.map((m) => {
              const checked = selectedIds.includes(m.id);
              return (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelect(m.id)}
                  />
                  <span className="text-sm">{m.title}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="rounded-2xl bg-zinc-200 px-4 py-2 font-semibold text-blue-600 disabled:opacity-50 dark:bg-zinc-900 dark:text-blue-400"
        >
          {loading
            ? t("saving")
            : editingPlaylistId
              ? t("saveChanges")
              : t("createPlaylist")}
        </button>
        {editingPlaylistId && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-2 rounded-2xl border border-zinc-300 px-4 py-2 font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            {t("cancelEdit")}
          </button>
        )}
      </form>

      {message && (
        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {message}
        </div>
      )}

      <div className="mt-8 max-w-3xl">
        <h2 className="mb-3 text-lg font-semibold text-black dark:text-white">
          {t("playlistList")}
        </h2>
        <div className="space-y-2">
          {playlists.length === 0 && (
            <div className="text-sm text-zinc-500">{t("noPlaylistsYet")}</div>
          )}
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center justify-between rounded-xl border border-zinc-300 p-3 dark:border-zinc-800"
            >
              <div>
                <div className="font-medium">{playlist.title}</div>
                <div className="text-sm text-zinc-500">
                  {t("songsCount", { count: playlist.musicIds.length })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEditPlaylist(playlist)}
                  className="rounded-xl border border-blue-500 px-3 py-1 text-sm text-blue-600 dark:text-blue-400"
                >
                  {t("edit")}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePlaylist(playlist.id)}
                  className="rounded-xl border border-rose-500 px-3 py-1 text-sm text-rose-600 dark:text-rose-400"
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
