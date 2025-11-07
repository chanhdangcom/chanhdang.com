"use client";
import { SingerItem } from "./component/singer-item";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { ISingerItem } from "./type/singer";

type IProp = {
  home?: boolean;
  addPage?: boolean;
  singers: ISingerItem[];
};

export function SingerListClient({ home, addPage, singers }: IProp) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full">
      <div className="flex gap-1 px-1 text-xl font-semibold">
        <div className="ml-2 text-black dark:text-white md:ml-[270px]">
          Popular Artists
        </div>
      </div>

      <div
        ref={ref}
        className="mt-2 flex snap-x snap-mandatory items-center gap-1 overflow-x-auto scrollbar-hide md:snap-none"
      >
        {singers.map((music, index) => (
          <div key={music.id} className="max-w-full shrink-0 snap-start">
            {home && (
              <div className="shrink-0 snap-start">
                <div
                  className={` ${index === 0 ? "ml-4 md:ml-[270px]" : ""} ml-2`}
                >
                  <SingerItem
                    music={music}
                    onClick={() => {
                      router.push(`/music/singer/${music._id || music.id}`);
                    }}
                  />
                </div>
              </div>
            )}

            {addPage && (
              <div className="shrink-0 snap-start">
                <div
                  className={` ${index === 0 ? "ml-4 md:ml-[510px]" : ""} ml-2`}
                >
                  <SingerItem
                    music={music}
                    onClick={() => {
                      router.push(`/music/singer/${music._id || music.id}`);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
