"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowClockwise, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/use-permissions";
import { useUser } from "@/hooks/use-user";
import { buildUserAuthHeaders } from "@/lib/client-auth";
import { MenuBar } from "../menu-bar";
import type { SingerEarningsRow } from "@/app/api/admin/singer-earnings/route";
import Image from "next/image";

type ApiResponse = {
  rows: SingerEarningsRow[];
  config: {
    thresholdPlays: number;
    blockPlays: number;
    vndPerBlock: number;
  };
};

type ChannelKindFilter = "all" | "user" | "system";

/** Chuỗi số có dấu chấm phân cách nghìn (vi) hoặc chỉ chữ số. */
function parseOptionalNonNegativeInt(raw: string): number | null {
  const t = raw
    .trim()
    .replace(/\u00a0/g, "")
    .replace(/\s/g, "");
  if (!t) return null;
  const digits = t.replace(/\./g, "").replace(/,/g, "");
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function SingerChannelEarnings() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const router = useRouter();
  const t = useTranslations("music.singerEarnings");
  const { isAdmin, isLoading: isAuthLoading } = useIsAdmin();
  const { user } = useUser();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameQuery, setNameQuery] = useState("");
  const [channelKind, setChannelKind] = useState<ChannelKindFilter>("all");
  const [minPlays, setMinPlays] = useState("");
  const [maxPlays, setMaxPlays] = useState("");
  const [minVnd, setMinVnd] = useState("");
  const [maxVnd, setMaxVnd] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/singer-earnings", {
        headers: buildUserAuthHeaders(user?.id),
        cache: "no-store",
      });
      const json = (await res.json()) as ApiResponse & { error?: string };
      if (!res.ok) {
        throw new Error(json.error || t("errorGeneric"));
      }
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errorGeneric"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAdmin) {
      router.push(`/${locale}/music`);
      return;
    }
    void load();
  }, [isAdmin, isAuthLoading, locale, load, router]);

  const rowsFromApi = data?.rows;

  const filteredRows = useMemo(() => {
    const allRows = rowsFromApi ?? [];
    const q = nameQuery.trim().toLowerCase();
    const minP = parseOptionalNonNegativeInt(minPlays);
    const maxP = parseOptionalNonNegativeInt(maxPlays);
    const minMoney = parseOptionalNonNegativeInt(minVnd);
    const maxMoney = parseOptionalNonNegativeInt(maxVnd);

    return allRows.filter((row) => {
      const name = (row.singerName || "").toLowerCase();
      if (q && !name.includes(q)) {
        return false;
      }

      if (channelKind === "user" && !row.isUserProfile) {
        return false;
      }
      if (channelKind === "system" && row.isUserProfile) {
        return false;
      }

      if (minP !== null && row.totalPlays < minP) {
        return false;
      }
      if (maxP !== null && row.totalPlays > maxP) {
        return false;
      }

      if (minMoney !== null && row.estimatedVnd < minMoney) {
        return false;
      }
      if (maxMoney !== null && row.estimatedVnd > maxMoney) {
        return false;
      }

      return true;
    });
  }, [rowsFromApi, nameQuery, channelKind, minPlays, maxPlays, minVnd, maxVnd]);

  const totalRowCount = rowsFromApi?.length ?? 0;

  if (isAuthLoading) {
    return (
      <div className="mx-4 flex items-center justify-center py-16 font-apple md:ml-[270px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // const cfg = data?.config;
  // const fmt = (n: number) =>
  //   n.toLocaleString(locale === "vi" ? "vi-VN" : "en-US");
  const formatVnd = (amount: number) =>
    new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="mx-4 py-8 font-apple md:ml-[270px]">
      <MenuBar />

      <div className="w-full space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {/* <h1 className="text-2xl font-bold text-black dark:text-white">
              {t("title")}
            </h1> */}
            {/*             
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {t("description")}
            </p> */}

            {/* {cfg ? (
              <p className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
                {t("configHint", {
                  threshold: fmt(cfg.thresholdPlays),
                  block: fmt(cfg.blockPlays),
                  vndPerBlock: formatVnd(cfg.vndPerBlock),
                })}
              </p>
            ) : null} */}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void load()}
            disabled={loading}
            className="gap-2 rounded-full border-zinc-300 dark:border-zinc-600"
          >
            <ArrowClockwise
              className={`size-4 ${loading ? "animate-spin" : ""}`}
              weight="bold"
            />
            {t("refresh")}
          </Button>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
            {error}
          </div>
        ) : null}

        {loading && !data ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
            {t("loading")}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40 md:grid-cols-2 xl:grid-cols-3">
              <div className="md:col-span-2 xl:col-span-1">
                <label
                  htmlFor="singer-earnings-name"
                  className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  {t("filterChannel")}
                </label>
                <input
                  id="singer-earnings-name"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  placeholder={t("filterChannelPlaceholder")}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>

              <div>
                <label
                  htmlFor="singer-earnings-kind"
                  className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  {t("filterChannelKind")}
                </label>
                <select
                  id="singer-earnings-kind"
                  value={channelKind}
                  onChange={(e) =>
                    setChannelKind(e.target.value as ChannelKindFilter)
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
                >
                  <option value="all">{t("filterKindAll")}</option>
                  <option value="user">{t("filterKindUser")}</option>
                  <option value="system">{t("filterKindSystem")}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="singer-earnings-min-plays"
                  className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  {t("filterMinPlays")}
                </label>
                <input
                  id="singer-earnings-min-plays"
                  inputMode="numeric"
                  value={minPlays}
                  onChange={(e) => setMinPlays(e.target.value)}
                  placeholder={t("filterPlaysPlaceholder")}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>

              <div>
                <label
                  htmlFor="singer-earnings-max-plays"
                  className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  {t("filterMaxPlays")}
                </label>
                <input
                  id="singer-earnings-max-plays"
                  inputMode="numeric"
                  value={maxPlays}
                  onChange={(e) => setMaxPlays(e.target.value)}
                  placeholder={t("filterPlaysPlaceholder")}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>

              <div>
                <label
                  htmlFor="singer-earnings-min-vnd"
                  className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  {t("filterMinVnd")}
                </label>
                <input
                  id="singer-earnings-min-vnd"
                  inputMode="numeric"
                  value={minVnd}
                  onChange={(e) => setMinVnd(e.target.value)}
                  placeholder={t("filterVndPlaceholder")}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>

              <div>
                <label
                  htmlFor="singer-earnings-max-vnd"
                  className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  {t("filterMaxVnd")}
                </label>
                <input
                  id="singer-earnings-max-vnd"
                  inputMode="numeric"
                  value={maxVnd}
                  onChange={(e) => setMaxVnd(e.target.value)}
                  placeholder={t("filterVndPlaceholder")}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>

              <div className="flex items-end md:col-span-2 xl:col-span-3">
                <button
                  type="button"
                  onClick={() => {
                    setNameQuery("");
                    setChannelKind("all");
                    setMinPlays("");
                    setMaxPlays("");
                    setMinVnd("");
                    setMaxVnd("");
                  }}
                  className="text-sm font-medium text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-400"
                >
                  {t("clearFilters")}
                </button>
              </div>
            </div>

            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {t("resultsCount", {
                filtered: filteredRows.length,
                total: totalRowCount,
              })}
            </p>

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/80">
                <span className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                  {t("title")}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/50">
                      <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">
                        {t("colRank")}
                      </th>

                      <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">
                        {t("colChannel")}
                      </th>

                      <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                        {t("colPlays")}
                      </th>

                      <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                        {t("colVnd")}
                      </th>

                      <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">
                        {t("colActions")}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRows.map((row, index) => (
                      <tr
                        key={row.singerId}
                        className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                      >
                        <td className="px-4 py-3 tabular-nums text-zinc-500 dark:text-zinc-400">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 font-medium text-black dark:text-white">
                          <div className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-6">
                              {row.cover ? (
                                <Image
                                  src={row.cover}
                                  alt={row.singerName}
                                  width={32}
                                  height={32}
                                  className="size-12 rounded-full object-cover"
                                />
                              ) : null}

                              {row.singerName || "—"}
                            </span>

                            {row.isUserProfile ? (
                              <span className="text-[11px] font-normal uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                                {t("userChannel")}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                          {row.totalPlays.toLocaleString(
                            locale === "vi" ? "vi-VN" : "en-US"
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                          {formatVnd(row.estimatedVnd)}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/${locale}/music/singer/${row.singerId}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400"
                          >
                            {t("viewChannel")}
                            <ArrowSquareOut
                              className="size-3.5 opacity-80"
                              weight="bold"
                            />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!loading && totalRowCount === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  {t("empty")}
                </p>
              ) : null}
              {!loading && totalRowCount > 0 && filteredRows.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  {t("emptyFiltered")}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
