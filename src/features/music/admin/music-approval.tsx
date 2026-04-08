/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useIsAdmin } from "@/hooks/use-permissions";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { MenuBar } from "../menu-bar";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/components/music-provider";

type MusicWithMeta = IMusic & {
  addedBy?: string | null;
};

export function MusicApproval() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const t = useTranslations("music.pendingApproval");
  const { isAdmin, isLoading: isAuthLoading } = useIsAdmin();
  const router = useRouter();
  const [musics, setMusics] = useState<MusicWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [titleQuery, setTitleQuery] = useState("");
  const [singerQuery, setSingerQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const { handlePlayAudio } = useAudio();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAdmin) {
      router.push(`/${locale}/music`);
      return;
    }
    void fetchPendingMusics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isAuthLoading, locale]);

  const fetchPendingMusics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/musics?status=pending", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(t("loadFailed"));
      }
      const data = (await res.json()) as MusicWithMeta[];
      setMusics(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loadError"));
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    music: MusicWithMeta,
    status: "approved" | "rejected"
  ) => {
    if (status === "rejected") {
      const confirmed = window.confirm(
        t("confirmReject", { title: music.title })
      );
      if (!confirmed) return;
    }

    try {
      setUpdatingId(music.id);
      const res = await fetch(`/api/musics/${music.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || t("updateFailed"));
      }
      setMusics((prev) => prev.filter((item) => item.id !== music.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("updateError"));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredMusics = useMemo(() => {
    const normalizedTitleQuery = titleQuery.trim().toLowerCase();
    const normalizedSingerQuery = singerQuery.trim().toLowerCase();
    const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const toDate = dateTo ? new Date(`${dateTo}T23:59:59.999`) : null;

    return musics.filter((music) => {
      const title = String(music.title || "").toLowerCase();
      const singer = String(music.singer || "").toLowerCase();

      if (normalizedTitleQuery && !title.includes(normalizedTitleQuery)) {
        return false;
      }

      if (normalizedSingerQuery && !singer.includes(normalizedSingerQuery)) {
        return false;
      }

      if (fromDate || toDate) {
        if (!music.createdAt) {
          return false;
        }

        const createdAt = new Date(music.createdAt);
        if (Number.isNaN(createdAt.getTime())) {
          return false;
        }

        if (fromDate && createdAt < fromDate) {
          return false;
        }

        if (toDate && createdAt > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [dateFrom, dateTo, musics, singerQuery, titleQuery]);

  if (isAuthLoading) {
    return (
      <div className="mx-4 flex items-center justify-center py-16 md:ml-[270px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="mx-4 py-8 md:ml-[270px]">
      <MenuBar />

      <div className="w-full max-w-4xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={titleQuery}
            onChange={(event) => setTitleQuery(event.target.value)}
            placeholder={t("filterTitle")}
            className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
          />
          <input
            value={singerQuery}
            onChange={(event) => setSingerQuery(event.target.value)}
            placeholder={t("filterSinger")}
            className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
          />
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
            aria-label={t("filterDateFrom")}
            className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
            aria-label={t("filterDateTo")}
            className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
            {t("loading")}
          </div>
        ) : musics.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
            {t("empty")}
          </div>
        ) : filteredMusics.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
            {t("emptyFiltered")}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMusics.map((music) => (
              <div
                key={music.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={music.cover}
                      alt={music.title}
                      className="size-20 rounded-lg object-cover"
                    />

                    <div>
                      <div className="text-base font-semibold text-black dark:text-white">
                        {music.title}
                      </div>

                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {music.singer}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-2 md:mt-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={updatingId === music.id}
                      onClick={() => handlePlayAudio(music)}
                      className="rounded-full border border-zinc-300 px-4 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
                    >
                      {t("preview")}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={updatingId === music.id}
                      onClick={() => updateStatus(music, "rejected")}
                      className="rounded-full border border-rose-500 px-4 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400"
                    >
                      {t("reject")}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      disabled={updatingId === music.id}
                      onClick={() => updateStatus(music, "approved")}
                      className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white hover:bg-emerald-600"
                    >
                      {updatingId === music.id ? t("updating") : t("approve")}
                    </Button>
                  </div>
                </div>

                {music.addedBy && (
                  <div className="mt-1 text-xs text-zinc-500">
                    {t("addedBy")}{" "}
                    <span className="font-mono">{music.addedBy}</span>
                  </div>
                )}

                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("meta", {
                    topic: music.topic || t("none"),
                    genre: music.type || t("none"),
                  })}
                </div>

                {music.createdAt ? (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t("submittedAt", {
                      date: new Date(music.createdAt).toLocaleString(locale),
                    })}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
