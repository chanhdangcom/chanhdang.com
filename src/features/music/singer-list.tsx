"use client";
import { SingerItem } from "./component/singer-item";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ISingerItem } from "./type/singer";

type IProp = {
  home?: boolean;
  addPage?: boolean;
};

export function SingerList({ home, addPage }: IProp) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [singers, setSingers] = useState<ISingerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/singers")
      .then((res) => res.json())
      .then((data) => {
        console.log("SINGERS API DATA:", data);
        setSingers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching singers:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex gap-1 px-1 text-2xl font-semibold">
          <div className="ml-2 text-black dark:text-white md:ml-[270px]">
            Popular Artists
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center py-8">
          <div className="text-zinc-500">Loading singers...</div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div layoutId="singer" layout>
        <div className="w-full">
          <div className="flex gap-1 px-1 text-2xl font-semibold">
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
      </motion.div>
    </AnimatePresence>
  );
}
