/* eslint-disable @next/next/no-img-element */
"use client";
import { useAudio } from "@/components/music-provider";
import {
  CaretDown,
  ChatTeardropDots,
  DotsThree,
  FastForward,
  ListBullets,
  Pause,
  Play,
  Rewind,
  ShareNetwork,
} from "@phosphor-icons/react/dist/ssr";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState, memo } from "react";
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
            : { opacity: 0.4, y: 6, scale: 0.98 }
        }
        transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
        id={`subtitle-${id}`}
        className={`mb-4 text-balance md:mb-8 ${
          isActive
            ? "font-semibold leading-snug text-white"
            : "leading-snug text-zinc-400"
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setIsPlayerPageOpen(true); // Báo PlayerPage đang mở để sync subtitle
    return () => {
      document.body.style.overflow = "auto";
      setIsPlayerPageOpen(false); // Báo PlayerPage đóng để tắt sync
    };
  }, [setIsPlayerPageOpen]);

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

            <div className="pointer-events-none relative inset-x-4 ml-4 h-full overflow-y-auto scrollbar-hide">
              <div className="text-balance px-4 pt-32 font-apple text-3xl font-bold leading-loose text-zinc-700 dark:text-zinc-300">
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setIsPlayerPageOpen(true); // Báo PlayerPage đang mở để sync subtitle
    return () => {
      document.body.style.overflow = "auto";
      setIsPlayerPageOpen(false); // Báo PlayerPage đóng để tắt sync
    };
  }, [setIsPlayerPageOpen]);

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
                  className="flex justify-center gap-8"
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
                      className="flex h-[70vh] w-full shrink-0 justify-center rounded-xl object-cover md:h-[55vh] md:w-[60vh]"
                    />

                    <div
                      className={
                        isPaused
                          ? ""
                          : "pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 duration-300 dark:ring-white/10"
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

          <div className="pointer-events-none ml-8 mr-20 hidden h-full w-full overflow-y-auto scrollbar-hide md:block">
            <div className="px-4 py-12 font-apple text-4xl font-bold leading-loose text-zinc-300">
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
      {isClickLyric ? (
        <LyricPage onRequestClose={handleClosePlayer} />
      ) : (
        <ContentPage onRequestClose={handleClosePlayer} />
      )}

      <>
        <div className="fixed bottom-0 z-50 w-full space-y-6 px-8 pb-8 md:bottom-8 md:w-[50vw]">
          <img
            alt="cover"
            src={currentMusic?.cover || ""}
            className="absolute -bottom-16 left-0 -z-10 h-[40vh] w-full scale-150 blur-3xl brightness-0"
          />

          {!isClickLyric && (
            <div className="space-y-4">
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

                    <div className="text-lg text-zinc-400">
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

            <div className="mx-8 flex items-center justify-between text-base text-zinc-400 md:hidden">
              <div onClick={() => setIsClickLyric(!isClickLyric)}>
                {isClickLyric ? (
                  <ChatTeardropDots size={25} />
                ) : (
                  <ChatTeardropDots size={25} weight="fill" />
                )}
              </div>

              <ShareNetwork size={25} weight="fill" />

              <ListBullets size={28} weight="bold" />
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
