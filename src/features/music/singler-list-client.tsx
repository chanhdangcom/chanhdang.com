"use client";
import { SingerItem } from "./component/singer-item";
import { useParams, useRouter } from "next/navigation";
import { ISingerItem } from "./type/singer";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";
import { ScrollCarouselItem } from "./component/scroll-carousel-item";

type IProp = {
  singers: ISingerItem[];
};

export function SingerListClient({ singers }: IProp) {
  const router = useRouter();
  const { scrollRef, scrollLeft, scrollRight, canScrollLeft, canScrollRight } =
    useScrollCarousel();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";

  return (
    <div className="relative w-full font-apple">
      <div className="flex gap-1 px-1 text-xl font-semibold">
        <div className="ml-2 text-black dark:text-white md:ml-[270px]">
          Popular Artists
        </div>
      </div>

      <ScrollCarouselItem
        scrollLeft={scrollLeft}
        scrollRight={scrollRight}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
      >
        <div
          ref={scrollRef}
          className="mt-2 flex snap-x snap-mandatory items-center gap-1 overflow-x-auto scrollbar-hide md:snap-none"
        >
          {singers.map((music, index) => (
            <div key={music.id} className="max-w-full shrink-0 snap-start">
              <div className="shrink-0 snap-start">
                <div
                  className={`${index === 0 ? "ml-4 md:ml-[270px]" : "ml-2"}`}
                >
                  <SingerItem
                    music={music}
                    onClick={() => {
                      router.push(
                        `/${locale}/music/singer/${music._id || music.id}`
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollCarouselItem>
    </div>
  );
}
