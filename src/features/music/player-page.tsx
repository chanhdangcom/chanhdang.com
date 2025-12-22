/* eslint-disable @next/next/no-img-element */
"use client";
import { useAudio } from "@/components/music-provider";
import {
  CaretDown,
  DotsThree,
  FastForward,
  Pause,
  Play,
  Repeat,
  RepeatOnce,
  Rewind,
  Shuffle,
} from "@phosphor-icons/react/dist/ssr";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, memo } from "react";
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

type IProp = {
  setIsClick: () => void;
};

// Memoized SubtitleItem để tránh re-render không cần thiết
const SubtitleItem = memo(
  ({ id, text, isActive }: { id: number; text: string; isActive: boolean }) => {
    return (
      <p
        id={`subtitle-${id}`}
        className={`mb-4 text-balance transition-all duration-300 md:mb-8 ${
          isActive
            ? "font-semibold leading-snug text-white"
            : "leading-snug text-zinc-500 [filter:blur(1px)]"
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

export function PlayerPage({ setIsClick }: IProp) {
  const {
    currentMusic,
    isPlaying,
    isPaused,
    handlePlayRandomAudio,
    handlePauseAudio,
    handleResumeAudio,
    handleAudioSkip,
    handAudioForward,
    handleToggleRepeat,
    handleToggleKaraoke,
    currentSubtitleId,
    subtitles,
    isRepeat,
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

  const [isClickLyric, setIsClickLyric] = useState(false);

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

  if (isClickLyric)
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMusic?.id || currentMusic?.cover || "player-lyric"}
          layoutId="audio-bar"
          className="fixed inset-0 z-50 flex justify-between space-y-4 px-4 md:rounded-3xl md:border md:border-white/10"
        >
          <div className="w-full">
            <div className="absolute inset-0 -z-10 flex justify-center bg-zinc-200 backdrop-blur-sm dark:bg-zinc-950">
              <img
                key={currentMusic?.cover}
                src={currentMusic?.cover || ""}
                alt="cover"
                className="mt-8 h-1/2 w-full scale-110 opacity-80 blur-2xl md:mt-24 md:h-screen md:w-full md:blur-3xl"
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
                  setIsClick();
                }
                setTouchStartY(null);
                setTouchDeltaY(0);
              }}
            >
              <div className="mx-auto my-4 h-1 w-16 rounded-full bg-white/20 md:hidden" />
            </header>

            <div className="absolute inset-x-4 z-10 mt-2 rounded-2xl p-1">
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
                            onClick={() => setIsClickLyric(false)}
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

                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="cursor-pointer rounded-full bg-white/10 p-0.5">
                          <DotsThree size={30} weight="bold" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="min-w-[180px] rounded-xl border-white/10 backdrop-blur-sm dark:bg-zinc-950/50"
                      >
                        <DropdownMenuItem
                          onClick={handleToggleFavorites}
                          disabled={isLoadingFavorite}
                          className="flex items-center gap-3 text-white focus:bg-white/10"
                        >
                          <span className="font-semibold">
                            {isInFavorites
                              ? "Gỡ khỏi Favorites"
                              : "Thêm vào Favorites"}
                          </span>
                        </DropdownMenuItem>

                        <DropdownMenuCheckboxItem
                          checked={isKaraokeMode}
                          onCheckedChange={handleToggleKaraoke}
                          disabled={!currentMusic?.beat}
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
                          onClick={handleShare}
                          className="flex items-center gap-3 text-white focus:bg-white/10"
                        >
                          <span className="font-semibold">Chia sẻ</span>
                        </DropdownMenuItem>

                        {isInFavorites && (
                          <DropdownMenuItem
                            onClick={() => {
                              router.push("/music/library/favorites");
                            }}
                            className="flex items-center gap-3 text-white focus:bg-white/10"
                          >
                            <span className="font-semibold">
                              Hiển thị trong Library
                            </span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                </div>
              </div>
            </div>

            <div className="pointer-events-none inset-x-4 ml-4 h-full overflow-y-auto scrollbar-hide">
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

          <>
            <motion.div
              id="footer-player"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-x-0 bottom-0 space-y-4 bg-zinc-950 px-8 pb-10"
            >
              <div className="">
                <div className="z-10 w-full">
                  <AudioTimeLine coverUrl={currentMusic?.cover || ""} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="z-10 flex items-center gap-2">
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="flex h-10 w-10 cursor-pointer items-center justify-start"
                  >
                    <Shuffle
                      onClick={() => handlePlayRandomAudio()}
                      size={25}
                      className="cursor-pointer"
                    />
                  </motion.div>
                </div>

                <div className="z-10 flex items-center gap-6 text-black dark:text-white">
                  <motion.button
                    onClick={handAudioForward}
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center"
                  >
                    <Rewind size={30} weight="fill" />
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
                      <Pause size={36} weight="fill" />
                    ) : (
                      <Play size={36} weight="fill" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleAudioSkip}
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center"
                  >
                    <FastForward size={30} weight="fill" />
                  </motion.button>
                </div>

                <div className="z-10 flex items-center gap-1">
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleToggleRepeat}
                    className="flex h-10 w-10 cursor-pointer items-center justify-end"
                  >
                    {isRepeat ? <RepeatOnce size={25} /> : <Repeat size={25} />}
                  </motion.div>
                </div>
              </div>

              <div className="flex justify-between rounded-full text-zinc-600 dark:text-zinc-400 md:hidden">
                <div>Up Next</div>

                <div onClick={() => setIsClickLyric(!isClickLyric)}>
                  Hidden Lyric
                </div>

                <div>Related</div>
              </div>
            </motion.div>
          </>
        </motion.div>
      </AnimatePresence>
    );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentMusic?.id || currentMusic?.cover || "player-main"}
        layoutId="audio-bar"
        className="fixed inset-0 z-50 flex justify-between space-y-4 px-4 md:z-50 md:rounded-3xl md:border-white/10"
      >
        <div className="w-full">
          <div className="absolute inset-0 -z-10 flex justify-center gap-8 bg-zinc-200 backdrop-blur-xl dark:bg-zinc-950">
            <img
              key={currentMusic?.cover}
              src={currentMusic?.cover || ""}
              alt="cover"
              className="md:3/4 0 mt-8 h-1/2 w-full blur-2xl md:mt-24 md:h-screen md:w-full md:blur-3xl"
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
                setIsClick();
              }
              setTouchStartY(null);
              setTouchDeltaY(0);
            }}
          >
            <CaretDown
              size={20}
              className="hidden cursor-pointer md:flex"
              onClick={() => setIsClick()}
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
                    className="flex h-[50vh] w-full shrink-0 justify-center rounded-2xl object-cover md:h-[55vh] md:w-[60vh]"
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
              <div className="flex h-[45vh] w-full shrink-0 justify-center rounded-2xl bg-zinc-700" />
            )}

            <motion.div
              id="footer-player"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="mx-auto space-y-4 rounded-3xl md:inset-x-8 md:-bottom-20 md:w-[60vh]"
            >
              <div className="absolute bottom-0 left-0 -z-10 hidden h-[30vh] w-[75vh] bg-black/60 text-sm blur-3xl md:flex" />

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

                {/* <DynamicIslandWave
                  isPlay={isPlaying}
                  coverUrl={currentMusic?.cover}
                /> */}

                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="cursor-pointer rounded-full bg-white/10 p-0.5">
                        <DotsThree size={30} weight="bold" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="min-w-[180px] rounded-xl border-white/10 backdrop-blur-sm dark:bg-zinc-950/50"
                    >
                      <DropdownMenuItem
                        onClick={handleToggleFavorites}
                        disabled={isLoadingFavorite}
                        className="flex items-center gap-3 text-white focus:bg-white/10"
                      >
                        <span className="font-semibold">
                          {isInFavorites
                            ? "Gỡ khỏi Favorites"
                            : "Thêm vào Favorites"}
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuCheckboxItem
                        checked={isKaraokeMode}
                        onCheckedChange={handleToggleKaraoke}
                        disabled={!currentMusic?.beat}
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
                        onClick={handleShare}
                        className="flex items-center gap-3 text-white focus:bg-white/10"
                      >
                        <span className="font-semibold">Chia sẻ</span>
                      </DropdownMenuItem>

                      {isInFavorites && (
                        <DropdownMenuItem
                          onClick={() => {
                            router.push("/music/library/favorites");
                          }}
                          className="flex items-center gap-3 text-white focus:bg-white/10"
                        >
                          <span className="font-semibold">
                            Hiển thị trong Library
                          </span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              </div>

              <div className="flex items-center justify-center">
                <AudioTimeLine coverUrl={currentMusic?.cover || ""} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="flex h-10 w-10 cursor-pointer items-center justify-start"
                  >
                    <Shuffle
                      onClick={() => handlePlayRandomAudio()}
                      size={25}
                      className="cursor-pointer"
                    />
                  </motion.div>
                </div>

                <div className="flex items-center gap-6 text-black dark:text-white">
                  <motion.button
                    onClick={handAudioForward}
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center"
                  >
                    <Rewind size={30} weight="fill" />
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
                      <Pause size={36} weight="fill" />
                    ) : (
                      <Play size={36} weight="fill" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleAudioSkip}
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center"
                  >
                    <FastForward size={30} weight="fill" />
                  </motion.button>
                </div>

                <div className="flex items-center gap-1">
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleToggleRepeat}
                    className="flex h-10 w-10 cursor-pointer items-center justify-end"
                  >
                    {isRepeat ? <RepeatOnce size={25} /> : <Repeat size={25} />}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-between text-base text-zinc-500 md:hidden">
              <div>Up Next</div>

              <div onClick={() => setIsClickLyric(!isClickLyric)}>Lyric</div>

              <div>Related</div>
            </div>
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
  );
}
