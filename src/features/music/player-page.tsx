"use client";
import { useTranslations } from "next-intl";
import { useAudio } from "@/components/music-provider";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import {
  DotsThree,
  Infinity,
  FastForward,
  ListBullets,
  ListStar,
  Pause,
  Play,
  Repeat,
  Rewind,
  Shuffle,
  Exclude,
  MagicWand,
  RepeatOnce,
  ChatTeardropText,
  Heart,
  ArrowsInSimple,
  ArrowsCounterClockwise,
} from "@phosphor-icons/react/dist/ssr";

import { useCallback, useEffect, useState, useRef, memo } from "react";
import { useSpringScroll } from "@/hooks/use-spring-scroll";
import { useRouter, useParams } from "next/navigation";
import { AudioTimeLine } from "./component/audio-time-line";
import { BorderPro } from "./component/border-pro";
import { ISingerItem } from "./type/singer";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { VolumeBar } from "./volume-bar";
import { AudioItemOrder } from "./component/audio-item-order";
import Link from "next/link";
import { useImageHoverColor } from "@/hooks/use-image-hover-color";
import { cn } from "@/utils/cn";

type IProp = {
  setIsClick: () => void;
};

type MusicActionsMenuProps = {
  isInFavorites: boolean;
  isLoadingFavorite: boolean;
  isKaraokeMode: boolean;
  hasBeat: boolean;
  onToggleFavorites: () => void;
  onToggleKaraoke: (checked: boolean) => void;
  onShare: () => void;
  onOpenFavorites: () => void;
};

type SharedMusicActionsProps = {
  isInFavorites: boolean;
  isLoadingFavorite: boolean;
  onToggleFavorites: () => void;
  onShare: () => void;
  onOpenFavorites: () => void;
};

type LibraryEntry = {
  resourceId: string;
};

const FAVORITES_CACHE_TTL_MS = 45_000;
const favoritesCache = new Map<
  string,
  { expiresAt: number; ids: Set<string> }
>();
const favoritesInFlight = new Map<string, Promise<Set<string>>>();

const RANDOM_MUSIC_CACHE_TTL_MS = 30_000;
let randomMusicCache: { expiresAt: number; items: IMusic[] } | null = null;
let randomMusicInFlight: Promise<IMusic[]> | null = null;

let singersInFlight: Promise<ISingerItem[]> | null = null;
const singerIdByNameCache = new Map<string, string | null>();
const COVER_LAYOUT_SPRING = {
  type: "spring" as const,
  stiffness: 240,
  damping: 30,
  mass: 0.7,
};

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isDesktop;
};

const useDeferredRender = (isDesktop: boolean, delayMs = 220) => {
  const [isReady, setIsReady] = useState(isDesktop);

  useEffect(() => {
    if (isDesktop) {
      setIsReady(true);
      return;
    }

    setIsReady(false);
    const timeoutId = window.setTimeout(() => {
      setIsReady(true);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [delayMs, isDesktop]);

  return isReady;
};

const QueueItem = ({
  music,
  onPlay,
  scrollContainerRef,
  onDragStateChange,
}: {
  music: IMusic;
  onPlay: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onDragStateChange?: (dragging: boolean) => void;
}) => {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Reorder.Item
      key={music.id}
      value={music}
      dragControls={controls}
      dragListener={false}
      dragElastic={0.08}
      dragMomentum={false}
      onDragStart={() => {
        setIsDragging(true);
        onDragStateChange?.(true);
      }}
      onDragEnd={() => {
        setIsDragging(false);
        onDragStateChange?.(false);
      }}
      onDrag={(_, info) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const y = info.point.y;
        const edgeThreshold = 70; // px từ mép trên/dưới
        const maxSpeed = 20; // tốc độ scroll tối đa

        // Kéo gần phía trên → scroll lên
        if (y < rect.top + edgeThreshold) {
          const intensity = (rect.top + edgeThreshold - y) / edgeThreshold; // 0 → 1
          container.scrollTop -= maxSpeed * intensity;
        }

        // Kéo gần phía dưới → scroll xuống
        if (y > rect.bottom - edgeThreshold) {
          const intensity = (y - (rect.bottom - edgeThreshold)) / edgeThreshold; // 0 → 1
          container.scrollTop += maxSpeed * intensity;
        }
      }}
      className={cn(
        "relative z-0 transform rounded-xl transition-all ease-out",
        isDragging && "shadow-3xl z-50 bg-white/10 p-1.5 backdrop-blur-xl"
      )}
    >
      <AudioItemOrder
        music={music}
        handlePlay={onPlay}
        border
        titleVariant="alwaysWhite"
        draggable
        onDragHandlePointerDown={(event) => {
          // Bắt đầu drag sao cho item bám sát vị trí cảm ứng
          controls.start(event, { snapToCursor: true });
        }}
      />
    </Reorder.Item>
  );
};

const fetchFavoriteMusicIds = async (
  userId: string,
  force = false
): Promise<Set<string>> => {
  const cached = favoritesCache.get(userId);
  if (!force && cached && cached.expiresAt > Date.now()) {
    return cached.ids;
  }

  if (!force && favoritesInFlight.has(userId)) {
    return favoritesInFlight.get(userId)!;
  }

  const request = (async () => {
    const response = await fetch(`/api/library?userId=${userId}&type=music`);
    if (!response.ok) {
      throw new Error("Failed to fetch favorite musics");
    }

    const entries = (await response.json()) as LibraryEntry[];
    const ids = new Set(
      Array.isArray(entries)
        ? entries.map((entry) => entry.resourceId).filter(Boolean)
        : []
    );

    favoritesCache.set(userId, {
      ids,
      expiresAt: Date.now() + FAVORITES_CACHE_TTL_MS,
    });

    return ids;
  })();

  favoritesInFlight.set(userId, request);
  try {
    return await request;
  } finally {
    favoritesInFlight.delete(userId);
  }
};

const updateFavoriteMusicCache = (
  userId: string,
  musicId: string,
  isFavorite: boolean
) => {
  const cached = favoritesCache.get(userId);
  if (!cached) return;

  if (isFavorite) {
    cached.ids.add(musicId);
  } else {
    cached.ids.delete(musicId);
  }

  favoritesCache.set(userId, {
    ids: cached.ids,
    expiresAt: Date.now() + FAVORITES_CACHE_TTL_MS,
  });
};

const fetchRandomMusics = async (limit = 12): Promise<IMusic[]> => {
  if (randomMusicCache && randomMusicCache.expiresAt > Date.now()) {
    return randomMusicCache.items;
  }

  if (randomMusicInFlight) {
    return randomMusicInFlight;
  }

  randomMusicInFlight = (async () => {
    const res = await fetch(`/api/musics?random=1&limit=${limit}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch random musics");
    }

    const data = (await res.json()) as IMusic[];
    const parsed = Array.isArray(data)
      ? data.filter((music): music is IMusic => Boolean(music?.id))
      : [];

    randomMusicCache = {
      items: parsed,
      expiresAt: Date.now() + RANDOM_MUSIC_CACHE_TTL_MS,
    };

    return parsed;
  })();

  try {
    return await randomMusicInFlight;
  } finally {
    randomMusicInFlight = null;
  }
};

const findSingerIdByName = async (
  name?: string | null
): Promise<string | null> => {
  if (!name) return null;

  if (singerIdByNameCache.has(name)) {
    return singerIdByNameCache.get(name) ?? null;
  }

  if (!singersInFlight) {
    singersInFlight = fetch("/api/singers")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch singers");
        }
        return (await response.json()) as ISingerItem[];
      })
      .finally(() => {
        singersInFlight = null;
      });
  }

  try {
    const singers = await singersInFlight;
    singers.forEach((singer) => {
      if (singer.singer) {
        singerIdByNameCache.set(singer.singer, singer.id || singer._id || null);
      }
    });
  } catch {
    singerIdByNameCache.set(name, null);
    return null;
  }

  return singerIdByNameCache.get(name) ?? null;
};

const useMusicActionsMenu = ({
  isInFavorites,
  isLoadingFavorite,
  isKaraokeMode,
  hasBeat,
  onToggleFavorites,
  onToggleKaraoke,
  onShare,
  onOpenFavorites,
}: MusicActionsMenuProps) => {
  const t = useTranslations("music.player");
  const Menu = useCallback(() => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="cursor-pointer rounded-full bg-white/10 p-0.5">
            <DotsThree size={30} weight="bold" className="text-white" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="min-w-[180px] rounded-xl border-white/10 bg-white/10 backdrop-blur-xl"
        >
          <DropdownMenuItem
            onClick={onToggleFavorites}
            disabled={isLoadingFavorite}
            className="flex items-center gap-3 text-white focus:bg-white/10"
          >
            <span className="font-semibold">
              {isInFavorites ? t("removeFromFavorites") : t("addToFavorites")}
            </span>
          </DropdownMenuItem>

          <DropdownMenuCheckboxItem
            checked={isKaraokeMode}
            onCheckedChange={onToggleKaraoke}
            disabled={!hasBeat}
            className="flex items-center gap-3 text-white focus:bg-white/10 disabled:opacity-50"
          >
            {isKaraokeMode ? (
              <span className="font-semibold">{t("offBeatMode")}</span>
            ) : (
              <span className="font-semibold">{t("beatMode")}</span>
            )}
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator className="bg-white/10" />

          <DropdownMenuItem
            onClick={onShare}
            className="flex items-center gap-3 text-white focus:bg-white/10"
          >
            <span className="font-semibold">{t("share")}</span>
          </DropdownMenuItem>

          {isInFavorites && (
            <DropdownMenuItem
              onClick={onOpenFavorites}
              className="flex items-center gap-3 text-white focus:bg-white/10"
            >
              <span className="font-semibold">{t("showInLibrary")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [
    t,
    hasBeat,
    isInFavorites,
    isKaraokeMode,
    isLoadingFavorite,
    onOpenFavorites,
    onShare,
    onToggleFavorites,
    onToggleKaraoke,
  ]);

  return Menu;
};

// Memoized SubtitleItem để tránh re-render không cần thiết
const SubtitleItem = memo(
  ({ id, text, isActive }: { id: number; text: string; isActive: boolean }) => {
    return (
      <p
        id={`subtitle-${id}`}
        className={`z-40 mb-6 text-balance font-apple md:mb-8 ${
          isActive
            ? "text-balance leading-snug text-white md:text-5xl"
            : "text-balance leading-snug text-white/20 md:text-5xl"
        }`}
      >
        {text}
      </p>
    );
  },
  (prevProps, nextProps) => {
    // Chỉ re-render nếu isActive thay đổi hoặc text thay đổi
    return (
      prevProps.isActive === nextProps.isActive &&
      prevProps.text === nextProps.text &&
      prevProps.id === nextProps.id
    );
  }
);

SubtitleItem.displayName = "SubtitleItem";

const LyricPage = ({
  onRequestClose,
  sharedActions,
}: {
  onRequestClose: () => void;
  sharedActions: SharedMusicActionsProps;
}) => {
  const {
    currentMusic,

    handleToggleKaraoke,
    currentSubtitleId,
    subtitles,
    isKaraokeMode,
    setIsPlayerPageOpen,
  } = useAudio();
  const tPlayer = useTranslations("music.player");
  const tCommon = useTranslations("music.common");

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const touchDeltaYRef = useRef(0);
  const subtitleScrollRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  // Thêm hiệu ứng scroll lò xo
  useSpringScroll(subtitleScrollRef);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setIsPlayerPageOpen(true); // Báo PlayerPage đang mở để sync subtitle
    return () => {
      document.body.style.overflow = "auto";
      setIsPlayerPageOpen(false); // Báo PlayerPage đóng để tắt sync
    };
  }, [setIsPlayerPageOpen]);

  // Auto scroll đến subtitle active với hiệu ứng mượt mà
  useEffect(() => {
    if (!currentSubtitleId || !subtitleScrollRef.current) return;

    // Delay nhỏ để đảm bảo DOM đã render và animation đã bắt đầu
    const timeoutId = setTimeout(() => {
      const scrollContainer = subtitleScrollRef.current;
      const activeElement = document.getElementById(
        `subtitle-${currentSubtitleId}`
      );

      if (!scrollContainer || !activeElement) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      const containerScrollTop = scrollContainer.scrollTop;
      const viewportHeight = containerRect.height;

      // Tính toán vị trí chính xác của element trong container
      const elementTop =
        elementRect.top - containerRect.top + containerScrollTop;

      // Vị trí mục tiêu: 20% từ trên viewport (cố định)
      const targetOffset = viewportHeight * 0.2;
      const targetScrollTop = elementTop - targetOffset;

      // Kiểm tra xem element có đang ở vị trí tốt không (tolerance ±50px để tránh scroll liên tục)
      const currentOffset = elementRect.top - containerRect.top;
      const offsetDifference = Math.abs(currentOffset - targetOffset);

      // Nếu đã ở vị trí tốt (sai lệch < 50px), không cần scroll
      if (offsetDifference < 50 && currentOffset >= 0) {
        return;
      }

      // Scroll mượt mà với easing
      scrollContainer.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }, 150); // Delay 150ms để đảm bảo animation đã render hoàn toàn

    return () => clearTimeout(timeoutId);
  }, [currentSubtitleId]);

  const MusicActionsMenu = useMusicActionsMenu({
    isInFavorites: sharedActions.isInFavorites,
    isLoadingFavorite: sharedActions.isLoadingFavorite,
    isKaraokeMode,
    hasBeat: !!currentMusic?.beat,
    onToggleFavorites: sharedActions.onToggleFavorites,
    onToggleKaraoke: handleToggleKaraoke,
    onShare: sharedActions.onShare,
    onOpenFavorites: sharedActions.onOpenFavorites,
  });

  const hoverBg = useImageHoverColor(currentMusic?.cover, {
    alpha: isDesktop ? 0.5 : 0.5,
  });

  const hoverBgSolid = useImageHoverColor(currentMusic?.cover, {
    alpha: 1,
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-between space-y-0 px-8 md:rounded-3xl md:border md:border-white/10">
        <div
          style={{ backgroundColor: hoverBgSolid }}
          className="pointer-events-none absolute -bottom-16 left-0 z-10 h-[40vh] w-full scale-150 blur-xl brightness-50 md:bg-black/60 md:blur-3xl"
        />

        <div className="w-full">
          <div
            className={`absolute inset-0 -z-10 flex justify-center bg-zinc-950 ${
              isDesktop ? "backdrop-blur-3xl" : "backdrop-blur-md"
            }`}
          >
            <div
              className={`h-full w-full ${
                isDesktop ? "saturate-125 rotate-180 scale-110" : "saturate-110"
              }`}
              style={{
                backgroundColor: hoverBg,
              }}
            />
          </div>

          <header
            className="flex items-center justify-start p-1 text-white md:py-4"
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                setTouchStartY(e.touches[0].clientY);
                touchDeltaYRef.current = 0;
              }
            }}
            onTouchMove={(e) => {
              if (touchStartY === null) return;
              const currentY = e.touches[0].clientY;
              touchDeltaYRef.current = currentY - touchStartY;
            }}
            onTouchEnd={() => {
              // Chỉ xử lý trên mobile: kéo xuống đủ xa thì đóng player
              if (window.innerWidth < 768 && touchDeltaYRef.current > 50) {
                onRequestClose();
              }
              setTouchStartY(null);
              touchDeltaYRef.current = 0;
            }}
          >
            <div className="mx-auto my-4 h-1 w-16 rounded-full bg-white/20 md:hidden" />
          </header>

          <div className="absolute inset-x-8 z-50 rounded-2xl p-1">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentMusic?.cover ? (
                    <div
                      key={currentMusic?.cover}
                      className="flex justify-center gap-8"
                    >
                      <BorderPro roundedSize="rounded-xl">
                        <motion.img
                          src={currentMusic?.cover}
                          alt="cover"
                          onClick={onRequestClose}
                          className="flex size-16 shrink-0 justify-center rounded-xl object-cover"
                          initial={false}
                          transition={{ layout: COVER_LAYOUT_SPRING }}
                          layoutId="cover-audio"
                          style={{ willChange: "transform" }}
                        />
                      </BorderPro>
                    </div>
                  ) : (
                    <div className="flex h-[45vh] w-full shrink-0 justify-center rounded-xl bg-zinc-700" />
                  )}

                  <div id="info-song" className="">
                    <div className="line-clamp-1 font-semibold text-white">
                      {currentMusic?.title || tPlayer("titleSong")}
                    </div>

                    <div className="line-clamp-1 text-zinc-300">
                      {currentMusic?.singer || tCommon("singer")}
                    </div>
                  </div>
                </div>

                <MusicActionsMenu />
              </div>
            </div>
          </div>

          <div
            ref={subtitleScrollRef}
            className="scroll-spring pointer-events-none relative h-full overflow-y-auto scrollbar-hide"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorY: "auto",
            }}
          >
            <div className="px-2 pt-32 font-apple text-3xl font-bold leading-loose text-zinc-300">
              {subtitles.map((line) => (
                <SubtitleItem
                  key={line.id}
                  id={line.id}
                  text={line.text}
                  isActive={currentSubtitleId === line.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ........

const ContentPage = ({
  onRequestClose,
  isOpenQueue,
  setIsOpenQueue,
}: {
  onRequestClose: () => void;
  isOpenQueue: boolean;
  setIsOpenQueue: (value: boolean) => void;
}) => {
  const {
    currentMusic,
    isPaused,
    currentSubtitleId,
    subtitles,
    isKaraokeMode,
    isMixMode,
    handleToggleMixMode,
    handleToggleKaraoke,
    setIsPlayerPageOpen,
    handlePlayAudio,
    queue,
    setQueue,
  } = useAudio();

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const touchDeltaYRef = useRef(0);
  const subtitleScrollRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const isHeavyReady = useDeferredRender(isDesktop, 180);

  // Thêm hiệu ứng scroll lò xo
  useSpringScroll(subtitleScrollRef);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setIsPlayerPageOpen(true); // Báo PlayerPage đang mở để sync subtitle
    return () => {
      document.body.style.overflow = "auto";
      setIsPlayerPageOpen(false); // Báo PlayerPage đóng để tắt sync
    };
  }, [setIsPlayerPageOpen]);

  // Auto scroll đến subtitle active với hiệu ứng mượt mà
  useEffect(() => {
    if (!currentSubtitleId || !subtitleScrollRef.current) return;

    // Delay nhỏ để đảm bảo DOM đã render và animation đã bắt đầu
    const timeoutId = setTimeout(() => {
      const scrollContainer = subtitleScrollRef.current;
      const activeElement = document.getElementById(
        `subtitle-${currentSubtitleId}`
      );

      if (!scrollContainer || !activeElement) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      const containerScrollTop = scrollContainer.scrollTop;
      const viewportHeight = containerRect.height;

      // Tính toán vị trí chính xác của element trong container
      const elementTop =
        elementRect.top - containerRect.top + containerScrollTop;

      // Vị trí mục tiêu: 20% từ trên viewport (cố định)
      const targetOffset = viewportHeight * 0.2;
      const targetScrollTop = elementTop - targetOffset;

      // Kiểm tra xem element có đang ở vị trí tốt không (tolerance ±50px để tránh scroll liên tục)
      const currentOffset = elementRect.top - containerRect.top;
      const offsetDifference = Math.abs(currentOffset - targetOffset);

      // Nếu đã ở vị trí tốt (sai lệch < 50px), không cần scroll
      if (offsetDifference < 50 && currentOffset >= 0) {
        return;
      }

      // Scroll mượt mà với easing
      scrollContainer.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }, 150); // Delay 150ms để đảm bảo animation đã render hoàn toàn

    return () => clearTimeout(timeoutId);
  }, [currentSubtitleId]);

  // Kiểm tra xem bài hát có trong Favorites hay không

  const hoverBg = useImageHoverColor(currentMusic?.cover, {
    alpha: isDesktop ? 0.5 : 0.5,
  });

  const hoverBgSolid = useImageHoverColor(currentMusic?.cover, {
    alpha: 1,
  });

  const [randomMusics, setRandomMusics] = useState<IMusic[]>([]);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const randomListRef = useRef<HTMLDivElement | null>(null);
  const [isQueueDragging, setIsQueueDragging] = useState(false);

  // Lấy danh sách nhạc random / sync với queue khi mở queue
  useEffect(() => {
    if (!isHeavyReady || !isDesktop || !isOpenQueue) return;
    let isMounted = true;

    const loadRandomMusics = async () => {
      // Nếu queue đã có dữ liệu (ví dụ từ lần trước) thì chỉ sync lại, không random mới
      if (queue.length > 0) {
        setRandomMusics(queue);
        return;
      }

      setIsLoadingRandom(true);
      try {
        const parsed = await fetchRandomMusics(12);
        // Loại bỏ bài hát hiện tại nếu có
        const filtered = parsed.filter(
          (music) => music.id !== currentMusic?.id
        );
        if (isMounted) {
          setRandomMusics(filtered);
          setQueue(filtered);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching random musics:", error);
      } finally {
        if (isMounted) {
          setIsLoadingRandom(false);
        }
      }
    };

    void loadRandomMusics();

    return () => {
      isMounted = false;
    };
  }, [isHeavyReady, isDesktop, isOpenQueue, queue, currentMusic?.id, setQueue]);

  const handlePlayFromQueue = (musicId: string) => {
    const index = randomMusics.findIndex((m) => m.id === musicId);
    if (index === -1) return;

    const track = randomMusics[index];
    const restQueue = randomMusics.filter((_, i) => i !== index);
    setQueue(restQueue);
    handlePlayAudio(track);
  };

  const handleItemDragStateChange = (dragging: boolean) => {
    setIsQueueDragging(dragging);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-between space-y-4 md:z-50 md:rounded-3xl md:border-white/10">
        <div className="w-full">
          <div className="absolute inset-0 -z-10 flex justify-center gap-8 bg-zinc-950">
            <div
              className={`h-full w-full ${
                isDesktop ? "saturate-125 rotate-180 scale-110" : "saturate-110"
              }`}
              style={{
                backgroundColor: hoverBg,
                // backgroundImage: isDesktop
                //   ? `radial-gradient(120% 95% at 50% 0%, ${hoverBg} 0%, rgba(39, 39, 42, 0.28) 58%, rgba(9, 9, 11, 0.52) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 44%)`
                //   : `linear-gradient(180deg, ${hoverBg} 0%, rgba(9, 9, 11, 0.84) 72%)`,
              }}
            />
          </div>

          <header
            className="flex w-full items-center justify-start p-1 text-white"
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                setTouchStartY(e.touches[0].clientY);
                touchDeltaYRef.current = 0;
              }
            }}
            onTouchMove={(e) => {
              if (touchStartY === null) return;
              const currentY = e.touches[0].clientY;
              touchDeltaYRef.current = currentY - touchStartY;
            }}
          >
            <div className="mx-auto mb-8 mt-4 h-[5px] w-16 rounded-full bg-white/20" />
          </header>

          <motion.button
            whileTap={{ scale: 0.2 }}
            type="button"
            onClick={() => setIsOpenQueue(!isOpenQueue)}
            className={`absolute bottom-[22px] right-24 z-50 ml-4 hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white md:flex ${
              isOpenQueue ? "bg-white/20" : "bg-transparent"
            } `}
          >
            <ListBullets size={28} weight="regular" />
          </motion.button>

          <ArrowsInSimple
            size={28}
            className="absolute bottom-8 right-8 z-50 ml-4 hidden cursor-pointer text-white md:flex"
            weight="fill"
            onClick={onRequestClose}
          />

          <div className="relative mx-3 space-y-4 md:mx-0 md:space-y-10">
            {currentMusic?.cover ? (
              <div
                key={currentMusic?.cover}
                className={cn(
                  "mx-6 flex justify-center md:mx-0",
                  currentMusic?.srt || isOpenQueue
                    ? "md:ml-16 md:justify-start"
                    : "md:justify-center"
                )}
              >
                <div className="relative">
                  <motion.img
                    src={currentMusic?.cover}
                    alt="cover"
                    className="flex h-[calc(100vh-440px)] w-screen shrink-0 transform-gpu justify-center rounded-3xl object-cover shadow-xl [backface-visibility:hidden] md:h-[calc(100vh-450px)] md:w-[35vw]"
                    initial={false}
                    animate={{ scale: isPaused ? 0.75 : 1 }}
                    transition={{
                      layout: COVER_LAYOUT_SPRING,
                      scale: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                    }}
                    layoutId="cover-audio"
                    style={{ willChange: "transform" }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-[40vh] w-full shrink-0 justify-center rounded-2xl bg-zinc-700" />
            )}
          </div>
        </div>

        {/* Subtitle Desktop */}
        {isDesktop && isHeavyReady ? (
          <div
            ref={subtitleScrollRef}
            className={cn(
              "scroll-spring pointer-events-none ml-8 mr-16 hidden h-full w-full overflow-y-auto scrollbar-hide md:block",
              currentMusic?.srt && !isOpenQueue ? "md:block" : "md:hidden"
            )}
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorY: "auto",
            }}
          >
            <div
              style={{ backgroundColor: hoverBgSolid }}
              className="pointer-events-none absolute -bottom-16 left-0 z-10 h-[25vh] w-full scale-150 blur-xl brightness-50 md:bg-black/60 md:blur-3xl"
            />

            <div className="px-4 py-12 text-left font-apple font-bold text-zinc-300">
              {subtitles.map((line) => (
                <SubtitleItem
                  key={line.id}
                  id={line.id}
                  text={line.text}
                  isActive={currentSubtitleId === line.id}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Featured Desktop */}
        {isDesktop && isOpenQueue ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            ref={subtitleScrollRef}
            className={cn(
              "ml-8 mr-16 hidden h-full w-full overflow-y-auto scrollbar-hide md:block"
            )}
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorY: "auto",
            }}
          >
            <div className="mx-3 mb-4 flex items-center justify-between">
              <div className="font-apple font-medium text-white/30">
                Continue Playing
              </div>

              <div className="flex items-center gap-8">
                <motion.div
                  whileTap={{ scale: 0.2 }}
                  className="hidden cursor-pointer rounded-full bg-white/10 p-2 text-white md:block"
                  onClick={() => handleToggleMixMode()}
                >
                  <Exclude size={25} weight={isMixMode ? "fill" : "regular"} />
                </motion.div>
                {!isKaraokeMode ? (
                  <motion.div
                    whileTap={{ scale: 0.2 }}
                    onClick={() => handleToggleKaraoke()}
                    className={cn(
                      "hidden cursor-pointer rounded-full bg-white/10 p-2 md:block",
                      !currentMusic?.beat
                        ? "pointer-events-none opacity-40"
                        : ""
                    )}
                  >
                    <MagicWand size={25} className="text-white" />
                  </motion.div>
                ) : (
                  <div
                    onClick={() => handleToggleKaraoke()}
                    className="cursor-pointer rounded-full bg-white/10 p-2"
                  >
                    <MagicWand size={25} weight="fill" className="text-white" />
                  </div>
                )}
              </div>
            </div>

            <div
              style={{ backgroundColor: hoverBgSolid }}
              className="pointer-events-none absolute -bottom-16 left-0 z-10 h-[20vh] w-full scale-150 blur-xl brightness-50 md:bg-black/60 md:blur-3xl"
            />

            <div className="px-4 text-left font-apple font-bold text-zinc-300">
              {isHeavyReady && !isLoadingRandom && randomMusics.length > 0 && (
                <div className="relative mt-2">
                  <Reorder.Group
                    ref={randomListRef as React.RefObject<HTMLDivElement>}
                    axis="y"
                    values={randomMusics}
                    onReorder={(next) => {
                      setRandomMusics(next);
                      setQueue(next);
                    }}
                    className={cn(
                      "z-0 h-full w-full space-y-4 overflow-y-auto pb-28 pr-2 scrollbar-hide"
                    )}
                    style={{ contentVisibility: "auto" }}
                  >
                    {randomMusics.map((music) => (
                      <QueueItem
                        key={music.id}
                        music={music}
                        onPlay={() => handlePlayFromQueue(music.id)}
                        onDragStateChange={handleItemDragStateChange}
                        scrollContainerRef={
                          randomListRef as React.RefObject<HTMLDivElement | null>
                        }
                      />
                    ))}
                  </Reorder.Group>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </div>
    </>
  );
};

// ----

const FeaturedPage = ({
  onRequestClose,
  sharedActions,
  onQueueDraggingChange,
}: {
  onRequestClose: () => void;
  sharedActions: SharedMusicActionsProps;
  onQueueDraggingChange?: (dragging: boolean) => void;
}) => {
  const {
    currentMusic,
    handleToggleKaraoke,
    isKaraokeMode,
    handlePlayAudio,
    setIsPlayerPageOpen,
    handlePlayRandomAudio,
    handleToggleRepeat,
    isRepeat,
    currentSubtitleId,
    subtitles,
    isMixMode,
    handleToggleMixMode,
    queue,
    setQueue,
  } = useAudio();

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const touchDeltaYRef = useRef(0);
  const [randomMusics, setRandomMusics] = useState<IMusic[]>([]);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const randomListRef = useRef<HTMLDivElement | null>(null);
  const subtitleScrollRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const isHeavyReady = useDeferredRender(isDesktop, 220);
  const tPlayer = useTranslations("music.player");
  const tCommon = useTranslations("music.common");
  const [isQueueDragging, setIsQueueDragging] = useState(false);

  const handleItemDragStateChange = (dragging: boolean) => {
    setIsQueueDragging(dragging);
    onQueueDraggingChange?.(dragging);
  };

  // Thêm hiệu ứng scroll lò xo
  useSpringScroll(subtitleScrollRef);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setIsPlayerPageOpen(true); // Báo PlayerPage đang mở để sync subtitle
    return () => {
      document.body.style.overflow = "auto";
      setIsPlayerPageOpen(false); // Báo PlayerPage đóng để tắt sync
    };
  }, [setIsPlayerPageOpen]);

  // Auto scroll đến subtitle active với hiệu ứng mượt mà
  useEffect(() => {
    if (!currentSubtitleId || !subtitleScrollRef.current) return;

    // Delay nhỏ để đảm bảo DOM đã render và animation đã bắt đầu
    const timeoutId = setTimeout(() => {
      const scrollContainer = subtitleScrollRef.current;
      const activeElement = document.getElementById(
        `subtitle-${currentSubtitleId}`
      );

      if (!scrollContainer || !activeElement) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      const containerScrollTop = scrollContainer.scrollTop;
      const viewportHeight = containerRect.height;

      // Kiểm tra xem element có đang ở vị trí tốt trong viewport không
      const elementTopInView = elementRect.top - containerRect.top;
      const elementBottomInView = elementRect.bottom - containerRect.top;

      // Kiểm tra nếu element đã ở vị trí tốt (giữa 15% và 50% viewport - ở phía trên)
      const isElementInGoodPosition =
        elementTopInView >= viewportHeight * 0.15 &&
        elementBottomInView <= viewportHeight * 0.5 &&
        elementTopInView >= 0 &&
        elementBottomInView <= viewportHeight;

      // Nếu đã ở vị trí tốt, không cần scroll
      if (isElementInGoodPosition) return;

      // Tính toán vị trí để subtitle active ở 20% từ trên (ở phía trên viewport)
      const elementTop =
        elementRect.top - containerRect.top + containerScrollTop;
      const targetScrollTop = elementTop - viewportHeight * 0.2;

      // Scroll mượt mà với easing
      scrollContainer.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }, 150); // Delay 150ms để đảm bảo animation đã render hoàn toàn

    return () => clearTimeout(timeoutId);
  }, [currentSubtitleId]);

  // Lấy danh sách nhạc random
  useEffect(() => {
    if (!isHeavyReady) return;
    let isMounted = true;

    const loadRandomMusics = async () => {
      // Nếu queue đã có dữ liệu (ví dụ từ lần trước) thì chỉ sync lại, không random mới
      if (queue.length > 0) {
        setRandomMusics(queue);
        return;
      }

      setIsLoadingRandom(true);
      try {
        const parsed = await fetchRandomMusics(12);
        // Loại bỏ bài hát hiện tại nếu có
        const filtered = parsed.filter(
          (music) => music.id !== currentMusic?.id
        );
        if (isMounted) {
          setRandomMusics(filtered);
          setQueue(filtered);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching random musics:", error);
      } finally {
        if (isMounted) {
          setIsLoadingRandom(false);
        }
      }
    };

    loadRandomMusics();

    return () => {
      isMounted = false;
    };
  }, [isHeavyReady, queue, currentMusic?.id, setQueue]);

  const handleRefreshRandomQueue = async () => {
    setIsLoadingRandom(true);
    try {
      const parsed = await fetchRandomMusics(12);
      const filtered = parsed.filter((music) => music.id !== currentMusic?.id);
      setRandomMusics(filtered);
      setQueue(filtered);
    } catch (error) {
      console.error("Error refreshing random musics:", error);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const handlePlayFromQueue = (musicId: string) => {
    const index = randomMusics.findIndex((m) => m.id === musicId);
    if (index === -1) return;

    const track = randomMusics[index];
    const restQueue = randomMusics.filter((_, i) => i !== index);
    setQueue(restQueue);
    handlePlayAudio(track);
  };

  const MusicActionsMenu = useMusicActionsMenu({
    isInFavorites: sharedActions.isInFavorites,
    isLoadingFavorite: sharedActions.isLoadingFavorite,
    isKaraokeMode,
    hasBeat: !!currentMusic?.beat,
    onToggleFavorites: sharedActions.onToggleFavorites,
    onToggleKaraoke: handleToggleKaraoke,
    onShare: sharedActions.onShare,
    onOpenFavorites: sharedActions.onOpenFavorites,
  });

  const hoverBg = useImageHoverColor(currentMusic?.cover, {
    alpha: isDesktop ? 0.5 : 0.5,
  });

  const hoverBgSolid = useImageHoverColor(currentMusic?.cover, {
    alpha: 1,
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-between space-y-4 px-4 md:rounded-3xl md:border md:border-white/10">
        <div className="flex w-full">
          <div
            className={`absolute inset-0 -z-10 flex justify-center bg-zinc-950 ${
              isDesktop ? "backdrop-blur-3xl" : "backdrop-blur-md"
            }`}
          >
            <div
              className={`h-full w-full ${
                isDesktop ? "saturate-125 rotate-180 scale-110" : "saturate-110"
              }`}
              style={{
                backgroundColor: hoverBg,
              }}
            />
          </div>

          <header
            className="absolute inset-x-0 flex items-center p-1 text-black dark:text-white md:py-4"
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                setTouchStartY(e.touches[0].clientY);
                touchDeltaYRef.current = 0;
              }
            }}
            onTouchMove={(e) => {
              if (touchStartY === null) return;
              const currentY = e.touches[0].clientY;
              touchDeltaYRef.current = currentY - touchStartY;
            }}
            onTouchEnd={() => {
              // Chỉ xử lý trên mobile: kéo xuống đủ xa thì đóng player
              if (window.innerWidth < 768 && touchDeltaYRef.current > 50) {
                onRequestClose();
              }
              setTouchStartY(null);
              touchDeltaYRef.current = 0;
            }}
          >
            <div className="mx-auto my-4 h-1 w-16 rounded-full bg-white/20 md:hidden" />
          </header>

          <div className="absolute inset-x-4 z-50 mx-4 mt-8 rounded-2xl">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentMusic?.cover ? (
                    <div
                      key={currentMusic?.cover}
                      className="flex justify-center gap-8"
                    >
                      <motion.img
                        src={currentMusic?.cover}
                        alt="cover"
                        onClick={onRequestClose}
                        className="flex size-16 shrink-0 justify-center rounded-xl object-cover"
                        initial={false}
                        transition={{ layout: COVER_LAYOUT_SPRING }}
                        layoutId="cover-audio"
                        style={{ willChange: "transform" }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-[45vh] w-full shrink-0 justify-center rounded-xl bg-zinc-700" />
                  )}

                  <motion.div
                    id="info-song"
                    layoutId="info-song"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="line-clamp-1 font-semibold text-white">
                      {currentMusic?.title || tPlayer("titleSong")}
                    </div>
                    <div className="line-clamp-1 text-zinc-300">
                      {currentMusic?.singer || tCommon("singer")}
                    </div>
                  </motion.div>
                </div>

                <MusicActionsMenu />
              </div>

              <div className="mt-4 flex items-center justify-between md:justify-start md:gap-16">
                <motion.div
                  whileTap={{ scale: 0.2 }}
                  className="cursor-pointer rounded-full bg-white/10 px-6 py-2 text-white"
                  onClick={() => handlePlayRandomAudio()}
                >
                  <Shuffle size={25} weight="regular" />
                </motion.div>

                <motion.div
                  whileTap={{ scale: 0.2 }}
                  className="cursor-pointer rounded-full bg-white/10 px-6 py-2 text-white"
                  onClick={() => handleToggleRepeat()}
                >
                  {!isRepeat ? (
                    <Repeat size={25} weight="regular" />
                  ) : (
                    <RepeatOnce size={25} weight="regular" />
                  )}
                </motion.div>

                <motion.div
                  whileTap={{ scale: 0.2 }}
                  className={`cursor-pointer rounded-full bg-white/10 px-6 py-2 text-white transition-colors`}
                  onClick={handleToggleMixMode}
                >
                  <Infinity size={25} weight="regular" />
                </motion.div>

                <motion.div
                  whileTap={{ scale: 0.2 }}
                  className="cursor-pointer rounded-full bg-white/10 px-6 py-2 text-white"
                  onClick={() => handleToggleMixMode()}
                >
                  <Exclude size={25} weight={isMixMode ? "fill" : "regular"} />
                </motion.div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">
                    {tPlayer("continueMusic")}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.2 }}
                    type="button"
                    onClick={handleRefreshRandomQueue}
                    className="flex items-center gap-1 rounded-full bg-white/10 p-2 text-xs font-medium text-white"
                  >
                    <ArrowsCounterClockwise size={16} weight="bold" />
                  </motion.button>
                </div>

                {!isHeavyReady && (
                  <div className="mt-2 text-xs text-zinc-400">
                    {tPlayer("optimizingContent")}
                  </div>
                )}

                {isLoadingRandom && (
                  <div className="mt-2 text-xs text-zinc-400">
                    {tPlayer("loadingMusic")}
                  </div>
                )}

                {isHeavyReady &&
                  !isLoadingRandom &&
                  randomMusics.length > 0 && (
                    <div className="relative mt-2">
                      {!isQueueDragging && (
                        <div
                          style={{ backgroundColor: hoverBgSolid }}
                          className="pointer-events-none absolute -bottom-16 left-0 z-10 h-[20vh] w-full scale-150 blur-xl brightness-50 md:blur-3xl"
                        />
                      )}

                      <Reorder.Group
                        ref={randomListRef as React.RefObject<HTMLDivElement>}
                        axis="y"
                        values={randomMusics}
                        onReorder={(next) => {
                          setRandomMusics(next);
                          setQueue(next);
                        }}
                        className={cn(
                          "z-0 h-[50vh] w-full space-y-4 overflow-y-auto pb-28 pr-2 scrollbar-hide",
                          isQueueDragging && "h-full"
                        )}
                        style={{ contentVisibility: "auto" }}
                      >
                        {randomMusics.map((music) => (
                          <QueueItem
                            key={music.id}
                            music={music}
                            onPlay={() => handlePlayFromQueue(music.id)}
                            onDragStateChange={handleItemDragStateChange}
                            scrollContainerRef={
                              randomListRef as React.RefObject<HTMLDivElement | null>
                            }
                          />
                        ))}
                      </Reorder.Group>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {isDesktop && isHeavyReady ? (
            <div
              ref={subtitleScrollRef}
              className="scroll-spring pointer-events-none ml-8 mr-20 hidden h-full w-full overflow-y-auto scrollbar-hide md:block"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                overscrollBehaviorY: "auto",
              }}
            >
              <div className="text-balance px-4 py-12 text-right font-apple text-4xl font-bold leading-loose text-zinc-300">
                {subtitles.map((line) => (
                  <SubtitleItem
                    key={line.id}
                    id={line.id}
                    text={line.text}
                    isActive={currentSubtitleId === line.id}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export function PlayerPage({ setIsClick }: IProp) {
  const {
    currentMusic,
    handlePauseAudio,
    handleResumeAudio,
    handlePlayRandomAudio,
    handAudioForward,
    isKaraokeMode,
    handleToggleKaraoke,
    setIsPlayerPageOpen,
    isPlaying,
    isPaused,
    handleAudioSkip,
  } = useAudio();
  const tPlayer = useTranslations("music.player");
  const tCommon = useTranslations("music.common");

  const [isClickLyric, setIsClickLyric] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isClickFeatured, setIsClickFeatured] = useState(false);
  const [singerId, setSingerId] = useState<string | null>(null);
  const [isQueueDragging, setIsQueueDragging] = useState(false);
  const [isOpenQueue, setIsOpenQueue] = useState(false);

  useEffect(() => {
    if (!user?.id || !currentMusic?.id) {
      setIsInFavorites(false);
      return;
    }

    let isMounted = true;
    const checkFavorites = async () => {
      try {
        const ids = await fetchFavoriteMusicIds(user.id);
        if (isMounted) {
          setIsInFavorites(ids.has(currentMusic.id));
        }
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    checkFavorites();
    return () => {
      isMounted = false;
    };
  }, [user?.id, currentMusic?.id]);

  // Tìm singerId từ tên singer
  useEffect(() => {
    let isMounted = true;
    const findSingerId = async () => {
      if (!currentMusic?.singer) {
        setSingerId(null);
        return;
      }

      try {
        const id = await findSingerIdByName(currentMusic.singer);
        if (isMounted) {
          setSingerId(id);
        }
      } catch (error) {
        console.error("Error finding singer ID:", error);
        if (isMounted) {
          setSingerId(null);
        }
      }
    };

    findSingerId();
    return () => {
      isMounted = false;
    };
  }, [currentMusic?.singer]);

  // Xử lý thêm/xóa khỏi Favorites
  const handleToggleFavorites = async () => {
    if (!user?.id) {
      alert(tPlayer("loginRequired"));
      return;
    }

    if (!currentMusic) return;

    const nextIsFavorite = !isInFavorites;
    setIsLoadingFavorite(true);
    setIsInFavorites(nextIsFavorite);
    updateFavoriteMusicCache(user.id, currentMusic.id, nextIsFavorite);
    try {
      if (isInFavorites) {
        // Xóa khỏi Favorites
        const response = await fetch(
          `/api/library?userId=${user.id}&resourceId=${currentMusic.id}&type=music`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          setIsInFavorites(true);
          updateFavoriteMusicCache(user.id, currentMusic.id, true);
          const error = await response.json();
          alert(error.error || tPlayer("errorOccurred"));
          return;
        }
      } else {
        // Thêm vào Favorites
        const response = await fetch("/api/library", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            resourceId: currentMusic.id,
            resourceType: "music",
          }),
        });

        if (!response.ok) {
          setIsInFavorites(false);
          updateFavoriteMusicCache(user.id, currentMusic.id, false);
          const error = await response.json();
          alert(error.error || tPlayer("errorOccurred"));
          return;
        }
      }

      const ids = await fetchFavoriteMusicIds(user.id, true);
      setIsInFavorites(ids.has(currentMusic.id));
    } catch (error) {
      console.error("Error toggling favorites:", error);
      setIsInFavorites(isInFavorites);
      updateFavoriteMusicCache(user.id, currentMusic.id, isInFavorites);
      alert(tPlayer("errorOccurred"));
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  // Xử lý Share
  const handleShare = async () => {
    if (!currentMusic) return;

    const shareData = {
      title: currentMusic.title || tPlayer("song"),
      text: `${currentMusic.title} - ${currentMusic.singer}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`
        );
        alert(tPlayer("copyLinkSuccess"));
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const MusicActionsMenu = useMusicActionsMenu({
    isInFavorites,
    isLoadingFavorite,
    isKaraokeMode,
    hasBeat: !!currentMusic?.beat,
    onToggleFavorites: handleToggleFavorites,
    onToggleKaraoke: handleToggleKaraoke,
    onShare: handleShare,
    onOpenFavorites: () => router.push(`/${locale}/music/library/favorites`),
  });

  const sharedActions: SharedMusicActionsProps = {
    isInFavorites,
    isLoadingFavorite,
    onToggleFavorites: handleToggleFavorites,
    onShare: handleShare,
    onOpenFavorites: () => router.push(`/${locale}/music/library/favorites`),
  };

  const handleClosePlayer = () => {
    setIsPlayerPageOpen(false);
    setIsClick();
  };

  return (
    <div className="font-apple">
      {isClickFeatured ? (
        <FeaturedPage
          onRequestClose={handleClosePlayer}
          sharedActions={sharedActions}
          onQueueDraggingChange={setIsQueueDragging}
        />
      ) : isClickLyric ? (
        <LyricPage
          onRequestClose={handleClosePlayer}
          sharedActions={sharedActions}
        />
      ) : (
        <ContentPage
          onRequestClose={handleClosePlayer}
          isOpenQueue={isOpenQueue}
          setIsOpenQueue={setIsOpenQueue}
        />
      )}

      <motion.div
        layout
        className={cn(
          "items-center md:flex",
          currentMusic?.srt || isOpenQueue ? "justify-start" : "justify-center"
        )}
      >
        <motion.div
          layout
          className={cn(
            "fixed bottom-0 z-50 w-full space-y-4 px-8 pb-8 md:bottom-2 md:ml-16 md:w-[35vw] md:space-y-4 md:px-0",
            currentMusic?.srt || isOpenQueue ? "md:ml-16" : "md:ml-0"
          )}
        >
          {isClickLyric && (
            <>
              {!isKaraokeMode ? (
                <motion.div
                  whileTap={{ scale: 0.2 }}
                  onClick={() => handleToggleKaraoke()}
                  className="absolute -top-8 right-8 cursor-pointer rounded-full bg-white/10 p-2"
                >
                  <MagicWand size={25} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  whileTap={{ scale: 0.2 }}
                  onClick={() => handleToggleKaraoke()}
                  className="absolute -top-8 right-8 cursor-pointer rounded-full bg-white/10 p-2"
                >
                  <MagicWand size={25} weight="fill" className="text-white" />
                </motion.div>
              )}
            </>
          )}

          {!isClickLyric && !isClickFeatured && !isQueueDragging && (
            <div className="mx-2 md:mx-0">
              <div className="flex items-center justify-between">
                <motion.div
                  id="info-song"
                  layoutId="info-song"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="line-clamp-1 text-xl font-semibold text-white">
                    {currentMusic?.title || tPlayer("titleSong")}
                  </div>

                  {singerId ? (
                    <Link
                      href={`/${locale}/music/singer/${singerId}`}
                      className="text-lg text-zinc-300 hover:underline"
                    >
                      {currentMusic?.singer || tCommon("singer")}
                    </Link>
                  ) : (
                    <span className="text-lg text-zinc-300">
                      {currentMusic?.singer || tCommon("singer")}
                    </span>
                  )}
                </motion.div>

                <MusicActionsMenu />
              </div>

              <motion.div
                whileTap={{ scale: 1.05 }}
                className="mt-4 flex items-center justify-center md:mt-0"
              >
                <AudioTimeLine coverUrl={currentMusic?.cover || ""} />
              </motion.div>
            </div>
          )}

          {(isClickLyric || isClickFeatured) && !isQueueDragging && (
            <motion.div
              whileTap={{ scale: 1.05 }}
              className="mx-2 flex items-center justify-center"
            >
              <AudioTimeLine coverUrl={currentMusic?.cover || ""} />
            </motion.div>
          )}

          {!isQueueDragging && (
            <div className="flex items-center justify-center">
              <div className="mx-14 mb-2 flex w-full items-center justify-between text-white md:mx-20">
                <motion.button
                  whileTap={{ scale: 0.2 }}
                  onClick={handAudioForward}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center"
                >
                  <Rewind size={35} weight="fill" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.2 }}
                  onClick={
                    isPlaying
                      ? handlePauseAudio
                      : isPaused
                        ? handleResumeAudio
                        : handlePlayRandomAudio
                  }
                  className="flex h-14 w-14 cursor-pointer items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause size={40} weight="fill" />
                  ) : (
                    <Play size={40} weight="fill" />
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.2 }}
                  onClick={handleAudioSkip}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center"
                >
                  <FastForward size={35} weight="fill" />
                </motion.button>
              </div>
            </div>
          )}

          {!isQueueDragging && (
            <div className="mx-2 space-y-2 md:mx-0 md:space-y-4">
              <motion.div whileTap={{ scale: 1.05 }}>
                <VolumeBar />
              </motion.div>

              <div className="mx-2 flex items-center justify-between text-base text-zinc-400">
                <motion.button
                  whileTap={{ scale: 0.2 }}
                  type="button"
                  onClick={() => {
                    setIsClickLyric(!isClickLyric);
                    setIsClickFeatured(false);
                  }}
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors md:hidden ${
                    isClickLyric ? "bg-white/20" : "bg-transparent"
                  } ${
                    !currentMusic?.srt ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  <ChatTeardropText
                    size={25}
                    weight={isClickLyric ? "fill" : "regular"}
                  />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.2 }}
                  type="button"
                  onClick={() => {
                    handlePlayRandomAudio();
                  }}
                  className={`hidden h-12 w-12 items-center justify-center rounded-full transition-colors md:flex`}
                >
                  <Shuffle
                    size={25}
                    weight={isClickLyric ? "fill" : "regular"}
                  />
                </motion.button>

                <Heart
                  size={25}
                  weight={isInFavorites ? "fill" : "regular"}
                  className={cn(
                    "cursor-pointer",
                    isInFavorites ? "text-rose-500" : "text-zinc-400"
                  )}
                  onClick={handleToggleFavorites}
                />

                <motion.button
                  whileTap={{ scale: 0.2 }}
                  onClick={() => {
                    setIsClickLyric(!isClickLyric);
                    setIsClickFeatured(false);
                  }}
                  className={`hidden h-12 w-12 items-center justify-center rounded-full transition-colors md:flex ${
                    isClickLyric ? "bg-white/20" : "bg-transparent"
                  }`}
                >
                  <Infinity
                    size={25}
                    weight={isClickLyric ? "fill" : "regular"}
                  />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.2 }}
                  type="button"
                  onClick={() => {
                    setIsClickFeatured(!isClickFeatured);
                    setIsClickLyric(false);
                  }}
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors md:hidden ${
                    isClickFeatured ? "bg-white/20" : "bg-transparent"
                  }`}
                >
                  {!isClickFeatured ? (
                    <ListBullets size={25} weight="bold" />
                  ) : (
                    <ListStar size={25} weight="bold" />
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
