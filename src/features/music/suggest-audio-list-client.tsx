"use client";

import { useEffect, useMemo, useState } from "react";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { AuidoItem } from "./component/audio-item";
import { useAudio } from "@/components/music-provider";
import { ScrollCarouselItem } from "./component/scroll-carousel-item";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";
import { useUser } from "@/hooks/use-user";

type SuggestionItem = { value: string; count: number };

const normalizeList = (value?: string | null) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const createRng = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffleArray = <T,>(items: T[], rng: () => number) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export function SuggestAuidoListClient({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();
  const { scrollRef, scrollLeft, scrollRight, canScrollLeft, canScrollRight } =
    useScrollCarousel();
  const { user } = useUser();
  const [topics, setTopics] = useState<SuggestionItem[]>([]);
  const [types, setTypes] = useState<SuggestionItem[]>([]);
  const [singers, setSingers] = useState<SuggestionItem[]>([]);
  const [totalPlays, setTotalPlays] = useState(0);
  const minHistoryForSuggestions = 5;
  const [seed] = useState(() => Date.now());

  useEffect(() => {
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      if (!user?.id) {
        setTopics([]);
        setTypes([]);
        setSingers([]);
        setTotalPlays(0);
        return;
      }

      try {
        const res = await fetch(
          `/api/history-suggest?userId=${user.id}&limit=120`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const data = (await res.json()) as {
          topics?: SuggestionItem[];
          types?: SuggestionItem[];
          singers?: SuggestionItem[];
          totalPlays?: number;
        };
        setTopics(Array.isArray(data?.topics) ? data.topics : []);
        setTypes(Array.isArray(data?.types) ? data.types : []);
        setSingers(Array.isArray(data?.singers) ? data.singers : []);
        setTotalPlays(
          typeof data?.totalPlays === "number" && Number.isFinite(data.totalPlays)
            ? data.totalPlays
            : 0
        );
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch history suggestions:", err);
        setTopics([]);
        setTypes([]);
        setSingers([]);
        setTotalPlays(0);
      }
    };

    fetchSuggestions();

    return () => controller.abort();
  }, [user?.id]);

  const topSinger = useMemo(
    () => singers[0]?.value?.trim().toLowerCase() ?? "",
    [singers]
  );
  const topTopic = useMemo(
    () => topics[0]?.value?.trim().toLowerCase() ?? "",
    [topics]
  );
  const topType = useMemo(
    () => types[0]?.value?.trim().toLowerCase() ?? "",
    [types]
  );

  const displayMusics = useMemo(() => {
    if (totalPlays < minHistoryForSuggestions) return [];

    const matchedBySinger = topSinger
      ? musics.filter((music) => {
          const singerValues = normalizeList(music.singer).map((singer) =>
            singer.toLowerCase()
          );
          return singerValues.includes(topSinger);
        })
      : [];

    const matchedByTopic = topTopic
      ? musics.filter((music) => {
          const topicValues = normalizeList(music.topic).map((topic) =>
            topic.toLowerCase()
          );
          return topicValues.includes(topTopic);
        })
      : [];

    const matchedByType = topType
      ? musics.filter((music) => {
          const typeValue = music.type?.trim().toLowerCase();
          return typeValue ? typeValue === topType : false;
        })
      : [];

    const rng = createRng(seed);
    const pools = [
      shuffleArray(matchedBySinger, rng),
      shuffleArray(matchedByTopic, rng),
      shuffleArray(matchedByType, rng),
    ];
    const interleaved: IMusic[] = [];
    const seen = new Set<string>();

    while (pools.some((pool) => pool.length > 0)) {
      const available = pools.filter((pool) => pool.length > 0);
      const pool = available[Math.floor(rng() * available.length)];
      const item = pool.shift();
      if (item && !seen.has(item.id)) {
        seen.add(item.id);
        interleaved.push(item);
      }
    }

    return interleaved;
  }, [musics, topSinger, topTopic, topType, totalPlays, seed]);

  return (
    <ScrollCarouselItem
      scrollLeft={scrollLeft}
      scrollRight={scrollRight}
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
    >
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-hide md:snap-none"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {displayMusics
          .slice(-8)
          .reverse()
          .map((music, index) => (
            <div key={music.id} className="snap-start">
              <div
                className={`w-full shrink-0 ${
                  index === 0 ? "ml-2 md:ml-[270px]" : ""
                }`}
              >
                <AuidoItem
                  music={music}
                  handlePlay={() => handlePlayAudio(music)}
                />
              </div>
            </div>
          ))}
      </div>
    </ScrollCarouselItem>
  );
}
