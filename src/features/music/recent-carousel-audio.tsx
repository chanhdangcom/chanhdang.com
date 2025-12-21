"use client";

import { useEffect, useState } from "react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useUser } from "@/hooks/use-user";
import { RecentAuidoListClient } from "./recent-audio-list-client";

type HistoryItem = {
  _id?: string;
  userId?: string;
  musicId?: string;
  musicData?: IMusic;
  playedAt?: string;
  playCount?: number;
};

export function RecentCarouselAudio() {
  const { user } = useUser();
  const [musics, setMusics] = useState<IMusic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchHistory = async () => {
      if (!user?.id) {
        setMusics([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/history?userId=${user.id}&limit=8`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const data = (await res.json()) as HistoryItem[];
        const parsed = Array.isArray(data)
          ? data
              .map((item) => item.musicData)
              .filter((music): music is IMusic => Boolean(music?.id))
          : [];

        setMusics(parsed);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch recent history:", err);
        setError("Không thể tải lịch sử phát. Thử lại sau nhé.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();

    return () => controller.abort();
  }, [user?.id]);

  return (
    <div className="relative w-full rounded-3xl text-black dark:text-white md:max-h-full">
      <div className="flex justify-between">
        {!isLoading && user?.id && (
          <h2 className="ml-2 flex items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]">
            <div>Recently Played</div>

            <CaretRight
              size={20}
              weight="bold"
              className="text-zinc-500 md:mt-1"
            />
          </h2>
        )}
      </div>

      {isLoading && (
        <div className="ml-2 mt-2 text-sm text-zinc-500 md:ml-[270px]">
          Đang tải lịch sử...
        </div>
      )}

      {!isLoading && !user?.id && <div />}

      {!isLoading && user?.id && error && (
        <div className="ml-2 mt-2 text-sm text-red-500 md:ml-[270px]">
          {error}
        </div>
      )}

      {!isLoading && user?.id && !error && musics.length === 0 && (
        <div className="ml-2 mt-2 text-sm text-zinc-500 md:ml-[270px]">
          Chưa có bài hát nào trong lịch sử phát.
        </div>
      )}

      {musics.length > 0 && <RecentAuidoListClient musics={musics} />}
    </div>
  );
}
