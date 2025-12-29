/* eslint-disable @next/next/no-img-element */
"use client";
import { useAudio } from "@/components/music-provider";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import {
  CaretDown,
  ChatTeardropDots,
  DotsThree,
  Infinity,
  FastForward,
  ListBullets,
  ListStar,
  Pause,
  Play,
  Repeat,
  Rewind,
  ShareNetwork,
  Shuffle,
  Exclude,
  MagicWand,
  RepeatOnce,
} from "@phosphor-icons/react/dist/ssr";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState, useRef, memo } from "react";
import { useSpringScroll } from "@/hooks/use-spring-scroll";
import { useRouter } from "next/navigation";
import { AudioTimeLine } from "./component/audio-time-line";
// import DynamicIslandWave from "@/components/ui/dynamic-island";
import { BorderPro } from "./component/border-pro";
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
  const Menu = useCallback(() => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="cursor-pointer rounded-full bg-white/10 p-0.5">
            <DotsThree size={30} weight="bold" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="min-w-[180px] rounded-xl border-white/10 backdrop-blur-xl dark:bg-zinc-950/50"
        >
          <DropdownMenuItem
            onClick={onToggleFavorites}
            disabled={isLoadingFavorite}
            className="flex items-center gap-3 text-white focus:bg-white/10"
          >
            <span className="font-semibold">
              {isInFavorites ? "Gỡ khỏi Favorites" : "Thêm vào Favorites"}
            </span>
          </DropdownMenuItem>

          <DropdownMenuCheckboxItem
            checked={isKaraokeMode}
            onCheckedChange={onToggleKaraoke}
            disabled={!hasBeat}
            className="flex items-center gap-3 text-white focus:bg-white/10 disabled:opacity-50"
          >
            {isKaraokeMode ? (
              <span className="font-semibold">Off Beat Mode</span>
            ) : (
              <span className="font-semibold">Beat Mode</span>
            )}
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator className="bg-white/10" />

          <DropdownMenuItem
            onClick={onShare}
            className="flex items-center gap-3 text-white focus:bg-white/10"
          >
            <span className="font-semibold">Chia sẻ</span>
          </DropdownMenuItem>

          {isInFavorites && (
            <DropdownMenuItem
              onClick={onOpenFavorites}
              className="flex items-center gap-3 text-white focus:bg-white/10"
            >
              <span className="font-semibold">Hiển thị trong Library</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [
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
      <motion.p
        layout="position"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={
          isActive
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0.35, y: 10, scale: 0.97 }
        }
        transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
        id={`subtitle-${id}`}
        className={`z-40 mb-6 text-balance md:mb-8 ${
          isActive
            ? "text-balance font-semibold leading-snug text-white"
            : "leading-snug"
        }`}
      >
        {text}
      </motion.p>
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

const LyricPage = ({ onRequestClose }: { onRequestClose: () => void }) => {
  const {
    currentMusic,

    handleToggleKaraoke,
    currentSubtitleId,
    subtitles,
    isKaraokeMode,
    setIsPlayerPageOpen,
  } = useAudio();

  const { user } = useUser();
  const router = useRouter();
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaY, setTouchDeltaY] = useState(0);
  const subtitleScrollRef = useRef<HTMLDivElement>(null);

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
  useEffect(() => {
    if (!user?.id || !currentMusic?.id) {
      setIsInFavorites(false);
      return;
    }

    const checkFavorites = async () => {
      try {
        const response = await fetch(
          `/api/library?userId=${user.id}&type=music`
        );
        if (!response.ok) return;
        const entries = await response.json();
        const isFav = entries.some(
          (entry: { resourceId: string }) =>
            entry.resourceId === currentMusic.id
        );
        setIsInFavorites(isFav);
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    checkFavorites();
  }, [user?.id, currentMusic?.id]);

  // Xử lý thêm/xóa khỏi Favorites
  const handleToggleFavorites = async () => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    if (!currentMusic) return;

    setIsLoadingFavorite(true);
    try {
      if (isInFavorites) {
        // Xóa khỏi Favorites
        const response = await fetch(
          `/api/library?userId=${user.id}&resourceId=${currentMusic.id}&type=music`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setIsInFavorites(false);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
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
            data: currentMusic,
          }),
        });

        if (response.ok) {
          setIsInFavorites(true);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
        }
      }
    } catch (error) {
      console.error("Error toggling favorites:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  // Xử lý Share
  const handleShare = async () => {
    if (!currentMusic) return;

    const shareData = {
      title: currentMusic.title || "Bài hát",
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
        alert("Đã sao chép link vào clipboard!");
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
    onOpenFavorites: () => router.push("/music/library/favorites"),
  });

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMusic?.id || currentMusic?.cover || "player-lyric"}
          layoutId="audio-bar"
          className="fixed inset-0 z-50 flex justify-between space-y-4 px-4 md:rounded-3xl md:border md:border-white/10"
        >
          <div className="w-full">
            <div className="absolute inset-0 -z-10 flex justify-center bg-zinc-950 backdrop-blur-3xl">
              <img
                key={currentMusic?.cover}
                src={currentMusic?.cover || ""}
                alt="cover"
                className="mt-8 h-full w-full rotate-180 scale-110 opacity-70 blur-3xl md:mt-24 md:h-screen md:w-full md:blur-3xl"
              />
            </div>

            <header
              className="flex items-center justify-start p-1 text-black dark:text-white md:py-4"
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  setTouchStartY(e.touches[0].clientY);
                  setTouchDeltaY(0);
                }
              }}
              onTouchMove={(e) => {
                if (touchStartY === null) return;
                const currentY = e.touches[0].clientY;
                setTouchDeltaY(currentY - touchStartY);
              }}
              onTouchEnd={() => {
                // Chỉ xử lý trên mobile: kéo xuống đủ xa thì đóng player
                if (window.innerWidth < 768 && touchDeltaY > 50) {
                  onRequestClose();
                }
                setTouchStartY(null);
                setTouchDeltaY(0);
              }}
            >
              <div className="mx-auto my-4 h-1 w-16 rounded-full bg-white/20 md:hidden" />
            </header>

            <div className="absolute inset-x-4 z-50 mt-2 rounded-2xl p-1">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentMusic?.cover ? (
                      <motion.div
                        layoutId="Cover"
                        key={currentMusic?.cover}
                        className="flex justify-center gap-8"
                      >
                        <BorderPro roundedSize="rounded-xl">
                          <motion.img
                            src={currentMusic?.cover}
                            alt="cover"
                            transition={{
                              duration: 0.2,
                              ease: "easeInOut",
                              type: "spring",
                              damping: 15,
                            }}
                            onClick={onRequestClose}
                            className="flex size-16 shrink-0 justify-center rounded-xl object-cover"
                          />
                        </BorderPro>
                      </motion.div>
                    ) : (
                      <div className="flex h-[45vh] w-full shrink-0 justify-center rounded-xl bg-zinc-700" />
                    )}

                    <AnimatePresence>
                      <motion.div
                        id="info-song"
                        layoutId="info-song"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className=""
                      >
                        <div className="line-clamp-1 font-semibold">
                          {currentMusic?.title || "TITLE SONG"}
                        </div>
                        <div className="line-clamp-1">
                          {currentMusic?.singer || "SINGER"}
                        </div>
                      </motion.div>
                    </AnimatePresence>
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
              <div className="px-2 pt-32 font-apple text-3xl font-bold leading-loose text-zinc-700 dark:text-zinc-300">
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
        </motion.div>
      </AnimatePresence>
    </>
  );
};

// ........

const ContentPage = ({ onRequestClose }: { onRequestClose: () => void }) => {
  const {
    currentMusic,
    isPaused,

    currentSubtitleId,
    subtitles,

    setIsPlayerPageOpen,
  } = useAudio();

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaY, setTouchDeltaY] = useState(0);
  const subtitleScrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMusic?.id || currentMusic?.cover || "player-main"}
          layoutId="audio-bar"
          className="fixed inset-0 z-50 flex justify-between space-y-4 md:z-50 md:rounded-3xl md:border-white/10"
        >
          <div className="w-full">
            <div className="absolute inset-0 -z-10 flex justify-center gap-8 bg-zinc-950">
              <img
                key={currentMusic?.cover}
                src={currentMusic?.cover || ""}
                alt="cover"
                className="0 mt-8 h-full w-full rotate-180 blur-3xl md:mt-24 md:h-screen"
              />
            </div>

            <header
              className="flex items-center justify-start p-1 text-black dark:text-white md:py-4"
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  setTouchStartY(e.touches[0].clientY);
                  setTouchDeltaY(0);
                }
              }}
              onTouchMove={(e) => {
                if (touchStartY === null) return;
                const currentY = e.touches[0].clientY;
                setTouchDeltaY(currentY - touchStartY);
              }}
              onTouchEnd={() => {
                // Chỉ xử lý trên mobile: kéo xuống đủ xa thì đóng player
                if (window.innerWidth < 768 && touchDeltaY > 50) {
                  onRequestClose();
                }
                setTouchStartY(null);
                setTouchDeltaY(0);
              }}
            >
              <CaretDown
                size={20}
                className="hidden cursor-pointer md:flex"
                onClick={onRequestClose}
              />

              <div className="mx-auto mb-8 mt-4 h-1 w-16 rounded-full bg-white/20 md:hidden" />
            </header>

            <div className="relative mx-3 space-y-4 md:space-y-10">
              {currentMusic?.cover ? (
                <motion.div
                  layoutId="Cover"
                  key={currentMusic?.cover}
                  className="flex justify-center md:mx-2 md:justify-start"
                >
                  <div className="relative">
                    <motion.img
                      src={currentMusic?.cover}
                      alt="cover"
                      animate={{ scale: isPaused ? 0.8 : 1 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        type: "spring",
                        damping: 15,
                      }}
                      className="flex h-[70vh] w-full shrink-0 justify-center rounded-3xl object-cover md:h-[55vh] md:w-[37vw]"
                    />

                    <div
                      className={
                        isPaused
                          ? ""
                          : "pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10 duration-300 dark:ring-white/10"
                      }
                    />
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-[40vh] w-full shrink-0 justify-center rounded-2xl bg-zinc-700" />
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layoutId="footer-audio"
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                  type: "spring",
                  damping: 15,
                  stiffness: 150,
                  mass: 0.6,
                }}
                className="mx-auto space-y-8 rounded-3xl md:inset-x-8 md:-bottom-20 md:w-[60vh]"
              >
                <div className="absolute bottom-0 left-0 -z-10 hidden h-[30vh] w-[75vh] bg-black/60 text-sm blur-3xl md:flex" />
              </motion.div>
            </div>
          </div>

          <div
            ref={subtitleScrollRef}
            className="scroll-spring pointer-events-none ml-8 mr-20 hidden h-full w-full overflow-y-auto scrollbar-hide md:block"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorY: "auto",
            }}
          >
            <div className="px-4 py-12 text-right font-apple text-4xl font-bold leading-loose text-zinc-300">
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
        </motion.div>
      </AnimatePresence>
    </>
  );
};

// ----

const FeaturedPage = ({ onRequestClose }: { onRequestClose: () => void }) => {
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
  } = useAudio();

  const { user } = useUser();
  const router = useRouter();
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaY, setTouchDeltaY] = useState(0);
  const [recentMusics, setRecentMusics] = useState<IMusic[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [shuffledRecent, setShuffledRecent] = useState<IMusic[]>([]);
  const recentListRef = useRef<HTMLDivElement | null>(null);
  const subtitleScrollRef = useRef<HTMLDivElement>(null);

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

  // Kiểm tra xem bài hát có trong Favorites hay không
  useEffect(() => {
    if (!user?.id || !currentMusic?.id) {
      setIsInFavorites(false);
      return;
    }

    const checkFavorites = async () => {
      try {
        const response = await fetch(
          `/api/library?userId=${user.id}&type=music`
        );
        if (!response.ok) return;
        const entries = await response.json();
        const isFav = entries.some(
          (entry: { resourceId: string }) =>
            entry.resourceId === currentMusic.id
        );
        setIsInFavorites(isFav);
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    checkFavorites();
  }, [user?.id, currentMusic?.id]);

  // Lấy danh sách nhạc đã nghe gần đây
  useEffect(() => {
    const controller = new AbortController();

    const fetchHistory = async () => {
      if (!user?.id) {
        setRecentMusics([]);
        setIsLoadingRecent(false);
        return;
      }

      setIsLoadingRecent(true);
      try {
        const res = await fetch(`/api/history?userId=${user.id}&limit=8`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) return;

        const data = (await res.json()) as {
          musicData?: IMusic;
        }[];

        const parsed = Array.isArray(data)
          ? data
              .map((item) => item.musicData)
              .filter((music): music is IMusic => Boolean(music?.id))
          : [];

        setRecentMusics(parsed);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error fetching recent history:", error);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingRecent(false);
        }
      }
    };

    fetchHistory();

    return () => controller.abort();
  }, [user?.id]);

  // Shuffle danh sách recent 1 lần cho mỗi bài/currentMusic
  useEffect(() => {
    if (!recentMusics.length) {
      setShuffledRecent([]);
      return;
    }

    const copy = [...recentMusics];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    setShuffledRecent(copy);
  }, [recentMusics, currentMusic?.id]);

  // Xử lý thêm/xóa khỏi Favorites
  const handleToggleFavorites = async () => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    if (!currentMusic) return;

    setIsLoadingFavorite(true);
    try {
      if (isInFavorites) {
        // Xóa khỏi Favorites
        const response = await fetch(
          `/api/library?userId=${user.id}&resourceId=${currentMusic.id}&type=music`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setIsInFavorites(false);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
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
            data: currentMusic,
          }),
        });

        if (response.ok) {
          setIsInFavorites(true);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
        }
      }
    } catch (error) {
      console.error("Error toggling favorites:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  // Xử lý Share
  const handleShare = async () => {
    if (!currentMusic) return;

    const shareData = {
      title: currentMusic.title || "Bài hát",
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
        alert("Đã sao chép link vào clipboard!");
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
    onOpenFavorites: () => router.push("/music/library/favorites"),
  });

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMusic?.id || currentMusic?.cover || "player-lyric"}
          layoutId="audio-bar"
          className="fixed inset-0 z-50 flex justify-between space-y-4 px-4 md:rounded-3xl md:border md:border-white/10"
        >
          <div className="flex w-full">
            <div className="absolute inset-0 -z-10 flex justify-center bg-zinc-950 backdrop-blur-3xl">
              <img
                key={currentMusic?.cover}
                src={currentMusic?.cover || ""}
                alt="cover"
                className="mt-8 h-full w-full rotate-180 scale-110 opacity-70 blur-3xl md:mt-24 md:h-screen md:w-full md:blur-3xl"
              />
            </div>

            <header
              className="absolute inset-x-0 flex items-center p-1 text-black dark:text-white md:py-4"
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  setTouchStartY(e.touches[0].clientY);
                  setTouchDeltaY(0);
                }
              }}
              onTouchMove={(e) => {
                if (touchStartY === null) return;
                const currentY = e.touches[0].clientY;
                setTouchDeltaY(currentY - touchStartY);
              }}
              onTouchEnd={() => {
                // Chỉ xử lý trên mobile: kéo xuống đủ xa thì đóng player
                if (window.innerWidth < 768 && touchDeltaY > 50) {
                  onRequestClose();
                }
                setTouchStartY(null);
                setTouchDeltaY(0);
              }}
            >
              <div className="mx-auto my-4 h-1 w-16 rounded-full bg-white/20 md:hidden" />
            </header>

            <div className="absolute inset-x-4 z-50 mt-8 rounded-2xl p-1">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentMusic?.cover ? (
                      <motion.div
                        layoutId="Cover"
                        key={currentMusic?.cover}
                        className="flex justify-center gap-8"
                      >
                        <BorderPro roundedSize="rounded-xl">
                          <motion.img
                            src={currentMusic?.cover}
                            alt="cover"
                            transition={{
                              duration: 0.2,
                              ease: "easeInOut",
                              type: "spring",
                              damping: 15,
                            }}
                            onClick={onRequestClose}
                            className="flex size-16 shrink-0 justify-center rounded-xl object-cover"
                          />
                        </BorderPro>
                      </motion.div>
                    ) : (
                      <div className="flex h-[45vh] w-full shrink-0 justify-center rounded-xl bg-zinc-700" />
                    )}

                    <AnimatePresence>
                      <motion.div
                        id="info-song"
                        layoutId="info-song"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className=""
                      >
                        <div className="line-clamp-1 font-semibold">
                          {currentMusic?.title || "TITLE SONG"}
                        </div>
                        <div className="line-clamp-1">
                          {currentMusic?.singer || "SINGER"}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <MusicActionsMenu />
                </div>

                <div className="mt-4 flex items-center justify-between md:justify-start md:gap-16">
                  <motion.div
                    className="cursor-pointer rounded-full bg-white/10 px-6 py-2"
                    onClick={() => handlePlayRandomAudio()}
                    whileTap={{ scale: 0.8 }}
                  >
                    <Shuffle size={25} weight="regular" />
                  </motion.div>

                  <motion.div
                    className="cursor-pointer rounded-full bg-white/10 px-6 py-2"
                    onClick={() => handleToggleRepeat()}
                    whileTap={{ scale: 0.8 }}
                  >
                    {!isRepeat ? (
                      <Repeat size={25} weight="regular" />
                    ) : (
                      <RepeatOnce size={25} weight="regular" />
                    )}
                  </motion.div>

                  <div className="cursor-pointer rounded-full bg-white/10 px-6 py-2">
                    <Infinity size={25} weight="regular" />
                  </div>

                  <div className="cursor-pointer rounded-full bg-white/10 px-6 py-2">
                    <Exclude size={25} weight="fill" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="font-semibold">Continue Playing</div>

                  {isLoadingRecent && (
                    <div className="mt-2 text-xs text-zinc-400">
                      Đang tải lịch sử...
                    </div>
                  )}

                  {!isLoadingRecent &&
                    user?.id &&
                    shuffledRecent.length > 0 && (
                      <div className="relative mt-2">
                        <div
                          ref={recentListRef}
                          className="h-[40vh] w-full space-y-4 overflow-y-auto pr-2 scrollbar-hide"
                        >
                          {shuffledRecent.slice(0, 8).map((music) => (
                            <AudioItemOrder
                              key={music.id}
                              music={music}
                              handlePlay={() => handlePlayAudio(music)}
                              className="w-full"
                              border={false}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

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
          </div>
        </motion.div>
      </AnimatePresence>
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
  } = useAudio();

  const [isClickLyric, setIsClickLyric] = useState(false);
  const { isPlaying, isPaused } = useAudio();
  const { handleAudioSkip } = useAudio();
  const { user } = useUser();
  const router = useRouter();
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isClickFeatured, setIsClickFeatured] = useState(false);

  useEffect(() => {
    if (!user?.id || !currentMusic?.id) {
      setIsInFavorites(false);
      return;
    }

    const checkFavorites = async () => {
      try {
        const response = await fetch(
          `/api/library?userId=${user.id}&type=music`
        );
        if (!response.ok) return;
        const entries = await response.json();
        const isFav = entries.some(
          (entry: { resourceId: string }) =>
            entry.resourceId === currentMusic.id
        );
        setIsInFavorites(isFav);
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    checkFavorites();
  }, [user?.id, currentMusic?.id]);

  // Xử lý thêm/xóa khỏi Favorites
  const handleToggleFavorites = async () => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    if (!currentMusic) return;

    setIsLoadingFavorite(true);
    try {
      if (isInFavorites) {
        // Xóa khỏi Favorites
        const response = await fetch(
          `/api/library?userId=${user.id}&resourceId=${currentMusic.id}&type=music`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setIsInFavorites(false);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
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
            data: currentMusic,
          }),
        });

        if (response.ok) {
          setIsInFavorites(true);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
        }
      }
    } catch (error) {
      console.error("Error toggling favorites:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  // Xử lý Share
  const handleShare = async () => {
    if (!currentMusic) return;

    const shareData = {
      title: currentMusic.title || "Bài hát",
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
        alert("Đã sao chép link vào clipboard!");
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
    onOpenFavorites: () => router.push("/music/library/favorites"),
  });

  const handleClosePlayer = () => {
    setIsPlayerPageOpen(false);
    setIsClick();
  };

  return (
    <div>
      {isClickFeatured ? (
        <FeaturedPage onRequestClose={handleClosePlayer} />
      ) : isClickLyric ? (
        <LyricPage onRequestClose={handleClosePlayer} />
      ) : (
        <ContentPage onRequestClose={handleClosePlayer} />
      )}

      <>
        <div className="fixed bottom-0 z-50 w-full space-y-6 px-8 pb-8 md:bottom-8 md:w-[40vw]">
          <img
            alt="cover"
            src={currentMusic?.cover || ""}
            className="pointer-events-none absolute -bottom-16 left-0 -z-10 h-[40vh] w-full scale-150 blur-3xl brightness-0"
          />

          {isClickLyric && (
            <>
              {!isKaraokeMode ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  onClick={() => handleToggleKaraoke()}
                  className="absolute -top-16 right-8 cursor-pointer rounded-full bg-white/10 p-1"
                >
                  <MagicWand size={28} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  onClick={() => handleToggleKaraoke()}
                  className="absolute -top-16 right-8 cursor-pointer rounded-full bg-white/10 p-1"
                >
                  <MagicWand size={28} weight="fill" />
                </motion.div>
              )}
            </>
          )}

          {!isClickLyric && !isClickFeatured && (
            <div className="">
              <div className="flex items-center justify-between">
                <AnimatePresence>
                  <motion.div
                    id="info-song"
                    layoutId="info-song"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="line-clamp-1 text-xl font-semibold">
                      {currentMusic?.title || "TITLE SONG"}
                    </div>

                    <div className="text-lg text-zinc-300">
                      {currentMusic?.singer || "SINGER"}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <MusicActionsMenu />
              </div>
            </div>
          )}

          <div className="flex items-center justify-center">
            <AudioTimeLine coverUrl={currentMusic?.cover || ""} />
          </div>

          <div className="justify-cente flex items-center">
            <div className="mx-8 flex w-full items-center justify-between text-black dark:text-white">
              <motion.button
                onClick={handAudioForward}
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="flex h-12 w-12 cursor-pointer items-center justify-center"
              >
                <Rewind size={40} weight="fill" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.15 }}
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
                  <Pause size={45} weight="fill" />
                ) : (
                  <Play size={45} weight="fill" />
                )}
              </motion.button>

              <motion.button
                onClick={handleAudioSkip}
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="flex h-12 w-12 cursor-pointer items-center justify-center"
              >
                <FastForward size={40} weight="fill" />
              </motion.button>
            </div>
          </div>

          <div className="space-y-6">
            <VolumeBar />

            <div className="mx-8 flex items-center justify-between text-base text-zinc-400">
              <div onClick={() => setIsClickLyric(!isClickLyric)}>
                {!isClickLyric ? (
                  <ChatTeardropDots size={25} />
                ) : (
                  <ChatTeardropDots size={25} weight="fill" />
                )}
              </div>

              <ShareNetwork size={25} weight="fill" />

              <div onClick={() => setIsClickFeatured(!isClickFeatured)}>
                {!isClickFeatured ? (
                  <ListBullets size={28} weight="bold" />
                ) : (
                  <ListStar size={28} weight="bold" />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
