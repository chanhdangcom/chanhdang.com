"use client";

import { useEffect, useState } from "react";
import { IMusic } from "@/app/[locale]/features/profile /types/music";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { RecentAuidoListClient } from "./recent-audio-list-client";

type HistoryItem = {
  _id: string;
  userId: string;
  musicId: string;
  musicData: IMusic;
  playedAt: string;
};

export default function RecentCarouselAudio() {
  const [musics, setMusics] = useState<IMusic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      setLoading(false);
      setMusics([]);
      return;
    }
    let userId: string | undefined;
    try {
      const parsed = JSON.parse(userRaw) as { id?: string } | null;
      userId = parsed?.id;
    } catch {
      userId = undefined;
    }
    if (!userId) {
      setLoading(false);
      setMusics([]);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/history?userId=${userId}&limit=30`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch history");
        const items = (await res.json()) as HistoryItem[];
        const list = items
          .map((h) => h.musicData)
          .filter((m) => m && m.id && m.audio);
        // Dedupe theo id, giữ thứ tự mới nhất trước
        const deduped: IMusic[] = [];
        const seen = new Set<string>();
        for (const m of list) {
          if (!seen.has(m.id)) {
            deduped.push(m);
            seen.add(m.id);
          }
        }
        setMusics(deduped);
      } catch (e) {
        console.error("❌ Failed to fetch history:", e);
        setMusics([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="py-8 text-center text-zinc-500">Đang tải...</div>;
  }
  if (musics.length === 0) {
    return;
  }

  return (
    <>
      <div className="w-full rounded-3xl text-black dark:text-white md:max-h-full">
        <div className="flex justify-between">
          <h2 className="ml-2 flex items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]">
            <div>Recently Played</div>

            <CaretRight
              size={20}
              weight="bold"
              className="text-zinc-500 md:mt-1"
            />
          </h2>
        </div>

        <RecentAuidoListClient musics={musics} />
      </div>
    </>
  );
}
