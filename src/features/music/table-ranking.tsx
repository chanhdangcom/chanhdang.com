"use client";
import { useAudio } from "@/components/music-provider";
import { TableRankingItem } from "./component/table-ranking-item";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useEffect, useState } from "react";
import { ScrollCarouselItem } from "./component/scroll-carousel-item";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";
import { cn } from "@/utils/cn";

export function TableRanking() {
  const { handlePlayAudio } = useAudio();
  const [musics, setMusics] = useState<IMusic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { scrollRef, scrollLeft, scrollRight, canScrollLeft, canScrollRight } =
    useScrollCarousel();

  useEffect(() => {
    const controller = new AbortController();

    const fetchRanking = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/musics?sort=playCount&limit=50", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const data = (await res.json()) as IMusic[];
        setMusics(Array.isArray(data) ? data : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch ranking:", err);
        setError("Không thể tải bảng xếp hạng.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchRanking();

    return () => controller.abort();
  }, []);

  return (
    <div className="z-[1] rounded-3xl p-1 md:max-w-full">
      <div className="ml-2 px-1 text-xl font-semibold text-black dark:text-white md:ml-[270px]">
        Top Charts
      </div>

      {isLoading && (
        <div className="ml-2 mt-2 text-sm text-zinc-500 md:ml-[270px]">
          Đang tải bảng xếp hạng...
        </div>
      )}

      {!isLoading && error && (
        <div className="ml-2 mt-2 text-sm text-rose-500 md:ml-[270px]">
          {error}
        </div>
      )}

      {!isLoading && !error && musics.length === 0 && (
        <div className="ml-2 mt-2 text-sm text-zinc-500 md:ml-[270px]">
          Chưa có dữ liệu xếp hạng.
        </div>
      )}

      <ScrollCarouselItem
        scrollLeft={scrollLeft}
        scrollRight={scrollRight}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
      >
        <div
          ref={scrollRef}
          className="mt-1 w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide md:snap-none"
        >
          <div className="grid grid-flow-col grid-rows-4 gap-4">
            {musics.map((music, index) => (
              <div key={music.id} className="snap-start p-1">
                <div
                  className={cn(
                    "flex items-center gap-3",
                    index < 4 ? "ml-2 md:ml-[270px]" : ""
                  )}
                >
                  <div
                    className={cn(
                      "text-sm font-medium text-zinc-500",
                      index < 4
                        ? "text-lg font-semibold text-rose-500 dark:text-blue-500"
                        : ""
                    )}
                  >
                    {index + 1}
                  </div>

                  <TableRankingItem
                    music={music}
                    handlePlay={() => handlePlayAudio(music)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollCarouselItem>
    </div>
  );
}
