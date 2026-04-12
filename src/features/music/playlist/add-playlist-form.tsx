"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useIsAdmin } from "@/hooks/use-permissions";
import { useParams, useRouter } from "next/navigation";
import { HeaderMusicPage } from "@/features/music/header-music-page";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { MenuBar } from "@/features/music/menu-bar";
import { Button } from "@/components/ui/button";

type Music = {
  id: string;
  title: string;
  singer: string;
  type?: string;
};

type PlaylistItem = {
  id: string;
  title: string;
  cover: string;
  singer: string;
  musicIds: string[];
};

const inputClass =
  "w-full rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950";

export function AddPlaylistForm() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const { isAdmin } = useIsAdmin();
  const router = useRouter();
  const t = useTranslations("music.playlist");
  const tMusic = useTranslations("musicForm.addMusic");
  const tError = useTranslations("music.player");

  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [singer, setSinger] = useState("");

  const [musics, setMusics] = useState<Music[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [filterTitle, setFilterTitle] = useState("");
  const [filterSinger, setFilterSinger] = useState("");
  const [filterGenre, setFilterGenre] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSynchronized, setIsSynchronized] = useState(true);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(
    null
  );

  const fetchPresignedUrl = useCallback(async (file: File) => {
    const presignedRes = await fetch(
      `/api/upload-music?fileName=${encodeURIComponent(
        file.name
      )}&contentType=${encodeURIComponent(
        file.type || "application/octet-stream"
      )}`
    );
    if (!presignedRes.ok) {
      const errorData = await presignedRes.json().catch(() => ({}));
      throw new Error(
        (errorData as { error?: string }).error || "Unknown error"
      );
    }
    const presignedData = await presignedRes.json();
    if (presignedData.error) {
      throw new Error(presignedData.error);
    }
    return presignedData as { presignedUrl: string; publicUrl: string };
  }, []);

  const uploadFileToR2 = useCallback(
    async (file: File, errorPrefix: string) => {
      const { presignedUrl, publicUrl } = await fetchPresignedUrl(file);
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(`${errorPrefix} ${errorText}`);
      }
      return publicUrl;
    },
    [fetchPresignedUrl]
  );

  const genreOptions = useMemo(() => {
    const set = new Set<string>();
    for (const m of musics) {
      const g = (m.type || "").trim();
      if (g) set.add(g);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [musics]);

  const filteredMusics = useMemo(() => {
    const tq = filterTitle.trim().toLowerCase();
    const sq = filterSinger.trim().toLowerCase();
    return musics.filter((m) => {
      const titleOk = !tq || m.title.toLowerCase().includes(tq);
      const singerOk =
        !sq || (m.singer || "").toLowerCase().includes(sq);
      const genreOk =
        !filterGenre || (m.type || "").trim() === filterGenre;
      return titleOk && singerOk && genreOk;
    });
  }, [musics, filterTitle, filterSinger, filterGenre]);

  const normalizeId = (value: unknown) => {
    if (typeof value === "string") return value;
    if (
      value &&
      typeof (value as { toString?: () => string }).toString === "function"
    ) {
      return (value as { toString: () => string }).toString();
    }
    return "";
  };

  const resetForm = () => {
    setTitle("");
    setCover("");
    setImageFile(null);
    setSinger("");
    setSelectedIds([]);
    setEditingPlaylistId(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const fetchMusics = async () => {
    const res = await fetch("/api/musics", { cache: "no-store" });
    if (!res.ok) {
      setMusics([]);
      setIsSynchronized(false);
      return;
    }
    const data = await res.json();
    const normalized = Array.isArray(data)
      ? data.map((m: Record<string, unknown> & { _id?: unknown }) => {
          let idValue = "";
          if (m.id && typeof m.id === "string") {
            idValue = m.id;
          } else if (m._id) {
            if (typeof m._id === "string") {
              idValue = m._id;
            } else if (typeof m._id === "object" && m._id !== null) {
              const idObj = m._id as Record<string, unknown>;
              if (typeof idObj.toString === "function") {
                idValue = idObj.toString();
              } else if ("$oid" in idObj) {
                idValue = String(idObj.$oid);
              } else if ("_str" in idObj) {
                idValue = String(idObj._str);
              }
            }
          }
          return {
            id: idValue,
            title: String(m.title ?? ""),
            singer: String(m.singer ?? ""),
            type: typeof m.type === "string" ? m.type : undefined,
          };
        })
      : [];
    setMusics(normalized.filter((x) => x.id && x.title));
    setIsSynchronized(true);
  };

  const fetchPlaylists = async () => {
    const res = await fetch("/api/playlists", { cache: "no-store" });
    if (!res.ok) {
      setIsSynchronized(false);
      return;
    }
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
      router.push(`/${locale}/music`);
      return;
    }

    (async () => {
      try {
        await Promise.all([fetchMusics(), fetchPlaylists()]);
      } catch (err) {
        console.error(err);
        setMessage(`❌ ${t("errorLoadData")}`);
        setIsSynchronized(false);
      }
    })();
  }, [isAdmin, locale, router]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAdmin) {
    return null;
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const canSubmit =
    Boolean(title.trim()) && Boolean(cover.trim() || imageFile);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setMessage(null);

    if (!isSynchronized) {
      setMessage(`❌ ${t("errorNotSynced")}`);
      setLoading(false);
      return;
    }

    try {
      let finalCover = cover.trim();
      if (imageFile) {
        try {
          finalCover = await uploadFileToR2(imageFile, t("errorUploadCover"));
        } catch (err) {
          console.error(err);
          setMessage(
            `❌ ${err instanceof Error ? err.message : t("errorUploadCover")}`
          );
          setLoading(false);
          return;
        }
      }
      if (!finalCover) {
        setMessage(`⚠️ ${t("coverRequired")}`);
        setLoading(false);
        return;
      }

      const payload = {
        title: title.trim(),
        cover: finalCover,
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
    setImageFile(null);
    setSinger(playlist.singer);
    setSelectedIds(playlist.musicIds);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm(t("confirmDelete"))) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/playlists/${playlistId}`, {
        method: "DELETE",
      });
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
    <div>
      <MotionHeaderMusic name={t("addPlaylist")} />

      <div className="md:ml-6">
        <HeaderMusicPage name={t("addPlaylist")} />
      </div>

      <MenuBar />

      <div className="">
        <form
          className="left-6 z-30 mx-4 space-y-4 rounded-3xl border border-zinc-300 p-4 font-apple backdrop-blur-2xl dark:border-zinc-700 dark:to-white/10 md:ml-[270px]"
          onSubmit={onSubmit}
        >
          <div className="text-center text-2xl font-bold">
            {editingPlaylistId ? t("editPlaylist") : t("addPlaylist")}
          </div>

          {!isSynchronized && (
            <p className="text-center text-amber-600 dark:text-amber-400">
              {t("errorNotSynced")}
            </p>
          )}

          <div className="flex w-full flex-col space-y-4">
            <div className="mx-auto flex w-full flex-col justify-between gap-4">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                {t("titleLabel")}
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("titlePlaceholder")}
                disabled={loading}
                className={inputClass}
              />

              <div className="flex flex-col gap-2 rounded-2xl border border-zinc-300 p-1 dark:border-zinc-700">
                <label className="px-3 pt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  {tMusic("coverImage")}
                </label>

                {imageFile ? (
                  <div className="px-3 font-semibold text-green-600 dark:text-green-400">
                    {tMusic("selectedImageFile")} {imageFile.name}
                  </div>
                ) : (
                  <input
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                    placeholder={tMusic("selectSongImageBelow")}
                    required={!imageFile}
                    disabled={loading}
                    className="mx-3 rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  className="mx-3 mb-2 rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-800"
                />
              </div>

              {cover.trim() && !imageFile && (
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover.trim()}
                    alt=""
                    className="max-h-40 rounded-xl border border-zinc-200 object-cover dark:border-zinc-700"
                  />
                </div>
              )}

              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                {t("editorNoteLabel")}
              </label>
              <input
                value={singer}
                onChange={(e) => setSinger(e.target.value)}
                placeholder={t("editorNotePlaceholder")}
                disabled={loading}
                className={inputClass}
              />

              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                {t("selectSongsLabel")}
              </label>

              {musics.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("noSongsYet")}
                </p>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        {t("filterByTitle")}
                      </span>
                      <input
                        value={filterTitle}
                        onChange={(e) => setFilterTitle(e.target.value)}
                        disabled={loading}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        {t("filterBySinger")}
                      </span>
                      <input
                        value={filterSinger}
                        onChange={(e) => setFilterSinger(e.target.value)}
                        disabled={loading}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        {t("filterByGenre")}
                      </span>
                      <select
                        value={filterGenre}
                        onChange={(e) => setFilterGenre(e.target.value)}
                        disabled={loading}
                        className={inputClass}
                      >
                        <option value="">{t("allGenres")}</option>
                        {genreOptions.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <ul className="max-h-64 list-none space-y-2 overflow-y-auto rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                    {filteredMusics.map((m) => {
                      const checked = selectedIds.includes(m.id);
                      return (
                        <li key={m.id}>
                          <label className="flex cursor-pointer items-start gap-2 text-sm">
                            <input
                              type="checkbox"
                              className="mt-1 rounded"
                              checked={checked}
                              onChange={() => toggleSelect(m.id)}
                              disabled={loading}
                            />
                            <span>
                              {m.title} – {m.singer}
                              {m.type ? (
                                <span className="text-zinc-500 dark:text-zinc-400">
                                  {" "}
                                  ({m.type})
                                </span>
                              ) : null}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  {filteredMusics.length === 0 && (
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {t("noMatchFilter")}
                    </p>
                  )}
                </>
              )}

              <div className="space-y-2">
                <Button
                  type="submit"
                  variant="liquid"
                  size="lg"
                  loading={loading}
                  loadingText={t("saving")}
                  disabled={loading || !canSubmit || !isSynchronized}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-50 font-semibold text-black"
                >
                  {editingPlaylistId ? t("saveChanges") : t("createPlaylist")}
                </Button>
                {editingPlaylistId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl border border-zinc-600 px-8 py-2 font-semibold"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    {t("cancelEdit")}
                  </Button>
                )}
              </div>

              {message && (
                <p className="text-center font-semibold">{message}</p>
              )}
            </div>
          </div>
        </form>

        <div className="left-6 z-30 mx-4 mt-4 space-y-4 rounded-3xl border border-zinc-300 p-4 font-apple backdrop-blur-2xl dark:border-zinc-700 dark:to-white/10 md:ml-[270px]">
          <h3 className="text-center text-xl font-bold">{t("playlistList")}</h3>
          {playlists.length === 0 ? (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              {t("noPlaylistsYet")}
            </p>
          ) : (
            <ul className="list-none space-y-3 p-0">
              {playlists.map((playlist) => (
                <li
                  key={playlist.id}
                  className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {playlist.title}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {t("songsCount", { count: playlist.musicIds.length })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border border-blue-600 px-6 font-semibold"
                      onClick={() => handleEditPlaylist(playlist)}
                      disabled={loading}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border border-rose-600 font-semibold text-rose-600"
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      disabled={loading}
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
