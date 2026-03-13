"use client";

import React, {
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useUser } from "@/hooks/use-user";
import { usePermissions } from "@/hooks/use-permissions";
import { AdModal } from "@/features/music/component/ad-modal";

// ----------------------------
// Types
// ----------------------------
type Subtitle = {
  id: number;
  start?: number;
  end?: number;
  text: string;
};

type IMusicContext = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentMusic: IMusic | null;
  queue: IMusic[];
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  isMixMode: boolean;
  isLoop: boolean;
  currentLyrics: string | null;
  subtitles: Subtitle[];
  currentSubtitleId: number | null;
  isKaraokeMode: boolean;

  handlePlayAudio: (music: IMusic) => void;
  handlePlayRandomAudio: () => void;
  handlePauseAudio: () => void;
  handleResumeAudio: () => void;
  handleAudioSkip: () => void;
  handAudioForward: () => void;
  handleMute: () => void;
  isRepeat: boolean | null;
  handleToggleRepeat: () => void;
  handleToggleLoop: () => void;
  handleToggleKaraoke: () => void;
  handleToggleMixMode: () => void;
  setIsPlayerPageOpen: (isOpen: boolean) => void;
  setQueue: (nextQueue: IMusic[]) => void;
};

// ----------------------------
// Helper functions
// ----------------------------

// Fade out audio
const fadeOut = (
  audio: HTMLAudioElement,
  duration: number = 300
): Promise<void> => {
  return new Promise((resolve) => {
    const startVolume = audio.volume;
    const startTime = Date.now();
    const fadeInterval = 16; // ~60fps

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      audio.volume = startVolume * (1 - progress);

      if (progress < 1) {
        setTimeout(fade, fadeInterval);
      } else {
        audio.volume = 0;
        resolve();
      }
    };

    fade();
  });
};

// Fade in audio
const fadeIn = (
  audio: HTMLAudioElement,
  duration: number = 300
): Promise<void> => {
  return new Promise((resolve) => {
    const targetVolume = 1;
    const startTime = Date.now();
    const fadeInterval = 16; // ~60fps

    audio.volume = 0;

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      audio.volume = targetVolume * progress;

      if (progress < 1) {
        setTimeout(fade, fadeInterval);
      } else {
        audio.volume = targetVolume;
        resolve();
      }
    };

    fade();
  });
};

// Decode ArrayBuffer with BOM detection (UTF-8/UTF-16LE/UTF-16BE)
const decodeWithBom = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  if (bytes.length >= 2) {
    // UTF-16LE BOM FF FE
    if (bytes[0] === 0xff && bytes[1] === 0xfe) {
      return new TextDecoder("utf-16le").decode(buffer);
    }
    // UTF-16BE BOM FE FF
    if (bytes[0] === 0xfe && bytes[1] === 0xff) {
      return new TextDecoder("utf-16be").decode(buffer);
    }
  }
  if (bytes.length >= 3) {
    // UTF-8 BOM EF BB BF
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
      return new TextDecoder("utf-8").decode(buffer);
    }
  }
  // Default to UTF-8
  return new TextDecoder("utf-8").decode(buffer);
};

const timeToSeconds = (time: string): number => {
  const parts = time.split(":");
  const seconds = parts[2].split(",");
  return (
    parseInt(parts[0], 10) * 3600 +
    parseInt(parts[1], 10) * 60 +
    parseInt(seconds[0], 10) +
    parseInt(seconds[1], 10) / 1000
  );
};

const parseSRT = (srt: string): Subtitle[] => {
  // Normalize common issues: convert Windows newlines, trim BOM
  const normalized = srt.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");

  const withTimeStrict =
    /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;

  // Looser pattern: handles minified one-line SRT (index, times, text separated by spaces)
  const withTimeLoose =
    /(\d+)\s+(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})\s+([\s\S]*?)(?=(?:\s+\d+\s+\d{2}:\d{2}:\d{2},\d{3})|$)/g;

  const withoutTimeRegex = /(\d+)\n([\s\S]*?)(?=\n\n|\n*$)/g;

  const subtitles: Subtitle[] = [];
  let matches: RegExpExecArray | null;

  // First try strict parsing (proper newlines)
  while ((matches = withTimeStrict.exec(normalized)) !== null) {
    subtitles.push({
      id: parseInt(matches[1], 10),
      start: timeToSeconds(matches[2]),
      end: timeToSeconds(matches[3]),
      text: matches[4].trim(),
    });
  }

  // If none, try loose parsing for minified SRT (like CDN-joined into one line)
  if (subtitles.length === 0) {
    while ((matches = withTimeLoose.exec(normalized)) !== null) {
      subtitles.push({
        id: parseInt(matches[1], 10),
        start: timeToSeconds(matches[2]),
        end: timeToSeconds(matches[3]),
        text: matches[4].trim(),
      });
    }
  }

  // If still none with time, fall back to plain lyric blocks without timing
  if (subtitles.length === 0) {
    while ((matches = withoutTimeRegex.exec(normalized)) !== null) {
      const text = matches[2].trim();
      if (text) {
        subtitles.push({ id: parseInt(matches[1], 10), text });
      }
    }
  }

  return subtitles;
};

// ----------------------------
// Context setup
// ----------------------------
const MusicContext = React.createContext<IMusicContext | null>(null);

export function useAudio() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useAudio must be used within a MusicProvider");
  }
  return context;
}

function Provider({
  children,
  ...props
}: {
  children: React.ReactNode;
} & IMusicContext) {
  return (
    <MusicContext.Provider value={props}>{children}</MusicContext.Provider>
  );
}

// ----------------------------
// Main Provider Component
// ----------------------------
export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isMixMode, setIsMixMode] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<IMusic | null>(null);
  const [queue, setQueue] = useState<IMusic[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentLyrics, setCurrentLyrics] = useState<string | null>(null);
  const [currentSubtitleId, setCurrentSubtitleId] = useState<number | null>(
    null
  );
  const [isKaraokeMode, setIsKaraokeMode] = useState<boolean>(false);
  const [isPlayerPageOpen, setIsPlayerPageOpen] = useState<boolean>(false);
  const [showAd, setShowAd] = useState(false);
  const [pendingNextTrack, setPendingNextTrack] = useState<(() => void) | null>(
    null
  );
  const playCountedRef = useRef<boolean>(false);
  const currentMusicIdRef = useRef<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mixAudioRef = useRef<HTMLAudioElement | null>(null);
  const crossfadeInProgressRef = useRef(false);
  const { user } = useUser();
  const { canListenWithoutAds } = usePermissions();

  const MIX_TRIGGER_REMAINING_S = 15; // khi bài hiện tại còn ~6-7s
  const MIX_CROSSFADE_MS = 5000; // thời gian crossfade
  const MIX_START_AT_S = 10; // khi bắt đầu bài mới sẽ nhảy tới giây 10

  // ----------------------------
  // Load subtitles for the current track from cloud/raw
  // ----------------------------

  useEffect(() => {
    const loadFromSrtField = async () => {
      if (!currentMusic) {
        setSubtitles([]);
        setCurrentLyrics(null);
        setCurrentSubtitleId(null);
        return;
      }

      const srtField: unknown = currentMusic.srt;
      let srtText: string | null = null;

      try {
        // 🔹 Nếu là URL → fetch từ cloud/CDN
        if (typeof srtField === "string" && /^(https?:)?\/\//i.test(srtField)) {
          const res = await fetch(srtField, { cache: "no-store" });
          if (res.ok) {
            const buf = await res.arrayBuffer();
            srtText = decodeWithBom(buf);
          } else {
            console.warn("⚠️ Không fetch được SRT:", res.status, srtField);
          }
        }

        // 🔹 Nếu không phải URL mà là raw text → dùng trực tiếp
        if (!srtText && typeof srtField === "string" && srtField.trim()) {
          srtText = srtField;
        }

        // 🔹 Nếu vẫn chưa có, fetch lại bản ghi từ API
        if (!srtText) {
          const id = currentMusic.id;
          if (id) {
            const res = await fetch(`/api/musics/${id}`, { cache: "no-store" });
            if (res.ok) {
              const full = (await res.json()) as IMusic;
              if (full?.srt && typeof full.srt === "string") {
                const isUrl = /^(https?:)?\/\//i.test(full.srt);
                if (isUrl) {
                  const res2 = await fetch(full.srt, { cache: "no-store" });
                  if (res2.ok) {
                    const buf = await res2.arrayBuffer();
                    srtText = decodeWithBom(buf);
                  }
                } else {
                  srtText = full.srt;
                }
              }
            }
          }
        }

        // 🔹 Nếu vẫn chưa có → thử fallback local
        if (!srtText) {
          console.warn("⚠️ Không tìm thấy file SRT cho:", currentMusic.title);
          setSubtitles([]);
          setCurrentLyrics(null);
          setCurrentSubtitleId(null);
          return;
        }

        // ✅ Parse lyric
        const parsed = parseSRT(srtText);
        if (parsed.length === 0) {
          console.warn("⚠️ Không parse được lyric từ SRT:", currentMusic.srt);
        }
        setSubtitles(parsed);
        setCurrentLyrics(null);
        setCurrentSubtitleId(null);
      } catch (err) {
        console.error("❌ Lỗi khi load SRT:", err);
        setSubtitles([]);
        setCurrentLyrics(null);
        setCurrentSubtitleId(null);
      }
    };

    void loadFromSrtField();
  }, [currentMusic]);

  useEffect(() => {
    currentMusicIdRef.current = currentMusic?.id ?? null;
    playCountedRef.current = false;
  }, [currentMusic?.id]);
  // ----------------------------
  // Audio control functions
  // ----------------------------
  const handlePlayAudio = useCallback(
    (music: IMusic) => {
      if (currentMusic?.id === music.id) return;
      setCurrentMusic(music);
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentLyrics(null);
      setCurrentSubtitleId(null);
      setIsKaraokeMode(false); // Reset karaoke mode khi đổi bài
    },
    [currentMusic]
  );

  // Effect để load audio khi đổi bài mới hoặc toggle karaoke
  const previousMusicIdRef = useRef<string | null>(null);
  const previousKaraokeModeRef = useRef<boolean>(false);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const crossfadeToMusic = useCallback(
    async (nextMusic: IMusic) => {
      const from = audioRef.current;
      const to = mixAudioRef.current;
      if (!from || !to) return;
      if (crossfadeInProgressRef.current) return;

      // Nếu đang paused thì không mix, phát kiểu thường
      if (from.paused) {
        setCurrentMusic(nextMusic);
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentLyrics(null);
        setCurrentSubtitleId(null);
        setIsKaraokeMode(false);
        return;
      }

      crossfadeInProgressRef.current = true;

      // Tránh effect "isNewTrack" reset src/time: đánh dấu track mới trước
      previousMusicIdRef.current = nextMusic.id;
      previousKaraokeModeRef.current = false;

      // UI chuyển sang bài mới trong lúc mix
      setCurrentMusic(nextMusic);
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentLyrics(null);
      setCurrentSubtitleId(null);
      setIsKaraokeMode(false);

      const startVol = Math.max(0, Math.min(1, from.volume || 1));
      const nextSource = nextMusic.audio;

      try {
        to.src = nextSource;
        to.currentTime = 0;
        to.muted = from.muted;
        to.volume = 0;

        await new Promise<void>((resolve) => {
          const handler = () => resolve();
          to.addEventListener("canplay", handler, { once: true });
        });

        // Nhảy vào bài mới từ giây thứ 10 (nếu bài đủ dài)
        if (Number.isFinite(to.duration) && to.duration > MIX_START_AT_S + 0.5) {
          to.currentTime = MIX_START_AT_S;
        }

        await to.play();

        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / MIX_CROSSFADE_MS, 1);
          from.volume = startVol * (1 - t);
          to.volume = startVol * t;

          if (t < 1) {
            requestAnimationFrame(step);
            return;
          }

          const carrySrc = to.src;
          const carryTime = to.currentTime;

          to.pause();
          to.removeAttribute("src");
          to.load();

          from.pause();
          from.src = carrySrc;
          from.currentTime = carryTime;
          from.muted = isMuted;
          from.volume = startVol;
          void from.play().catch(() => {});

          crossfadeInProgressRef.current = false;
        };

        requestAnimationFrame(step);
      } catch (e) {
        console.warn("Crossfade failed, fallback to normal play:", e);
        crossfadeInProgressRef.current = false;
        setCurrentMusic(nextMusic);
      }
    },
    [isMuted]
  );

  useEffect(() => {
    if (!audioRef.current || !currentMusic) return;

    const isNewTrack = previousMusicIdRef.current !== currentMusic.id;
    const isKaraokeModeChanged =
      previousKaraokeModeRef.current !== isKaraokeMode;

    // Cập nhật refs
    if (isNewTrack) {
      previousMusicIdRef.current = currentMusic.id;
      previousKaraokeModeRef.current = false; // Reset khi đổi bài
    }
    if (isKaraokeModeChanged) {
      previousKaraokeModeRef.current = isKaraokeMode;
    }

    // Chọn source dựa trên karaoke mode
    const audioSource =
      isKaraokeMode && currentMusic.beat
        ? currentMusic.beat
        : currentMusic.audio;

    // Đổi bài mới: reset time và play với fade in
    if (isNewTrack) {
      const audioEl = audioRef.current;
      audioEl.src = audioSource;
      audioEl.currentTime = 0;
      audioEl.volume = 0;

      const handleCanPlay = async () => {
        if (!audioEl) return;
        try {
          await audioEl.play();
          // Fade in audio mới
          await fadeIn(audioEl, isMixMode ? 800 : 300);
        } catch (error) {
          console.error("Lỗi phát nhạc:", error);
        }
        audioEl.removeEventListener("canplay", handleCanPlay);
      };

      audioEl.addEventListener("canplay", handleCanPlay);
      // Ghi lịch sử phát nhạc (fire-and-forget)
      (async () => {
        try {
          const userId = user?.id;
          if (!userId) return;
          const payload = {
            userId,
            musicId: currentMusic.id,
            musicData: currentMusic,
          };
          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            cache: "no-store",
          });
        } catch (e) {
          console.warn("Không thể lưu lịch sử phát:", e);
        }
      })();
      return;
    }

    // Toggle karaoke: fade out/in mượt mà, giữ nguyên thời gian, timeline tiếp tục chạy
    if (isKaraokeModeChanged && currentMusic.beat) {
      // Clear interval cũ nếu có
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }

      const wasPlaying = !audioRef.current.paused;
      const audioEl = audioRef.current;

      // Theo dõi currentTime liên tục trong lúc fade out
      let currentTime = audioEl.currentTime;
      timeUpdateIntervalRef.current = setInterval(() => {
        if (audioEl && !audioEl.paused) {
          currentTime = audioEl.currentTime;
        }
      }, 50); // Update mỗi 50ms để timeline mượt

      // Fade out audio hiện tại (vẫn để chạy, chỉ giảm volume)
      fadeOut(audioEl, 300).then(() => {
        if (timeUpdateIntervalRef.current) {
          clearInterval(timeUpdateIntervalRef.current);
          timeUpdateIntervalRef.current = null;
        }

        if (!audioEl) return;

        // Lấy thời gian cuối cùng từ biến đã theo dõi
        const finalTime = currentTime;

        // Đổi source
        audioEl.src = audioSource;

        // Dùng loadedmetadata để set currentTime sớm nhất có thể
        const handleLoadedMetadata = async () => {
          if (!audioEl) return;

          // Set currentTime ngay khi có metadata (trước khi play)
          audioEl.currentTime = finalTime;

          if (wasPlaying) {
            try {
              // Play ngay và fade in
              await audioEl.play();
              // Fade in audio mới
              await fadeIn(audioEl, 300);
            } catch (error) {
              console.error("Lỗi phát nhạc:", error);
            }
          } else {
            // Nếu không phát, vẫn set volume về 1 để sẵn sàng
            audioEl.volume = 1;
          }

          audioEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };

        audioEl.addEventListener("loadedmetadata", handleLoadedMetadata);
      });
    }

    // Cleanup: clear interval nếu effect re-run hoặc unmount
    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
    };
  }, [currentMusic, isKaraokeMode, user?.id, isMixMode]);

  const handleToggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
  }, []);

  const handleToggleLoop = useCallback(() => {
    setIsLoop((prev) => !prev);
  }, []);

  const handleToggleKaraoke = useCallback(() => {
    if (currentMusic?.beat) {
      setIsKaraokeMode((prev) => !prev);
    }
  }, [currentMusic]);

  const handleToggleMixMode = useCallback(() => {
    setIsMixMode((prev) => !prev);
  }, []);

  const handlePlayRandomAudio = useCallback(async () => {
    try {
      const res = await fetch("/api/musics?random=1&limit=1", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch random music");
      const data = (await res.json()) as IMusic[];
      const randomMusic = data?.[0];
      if (!randomMusic) return;
      if (randomMusic.id === currentMusic?.id) {
        // nếu trùng bài hiện tại, gọi lại để lấy bài khác
        const res2 = await fetch("/api/musics?random=1&limit=1", {
          cache: "no-store",
        });
        if (res2.ok) {
          const data2 = (await res2.json()) as IMusic[];
          if (data2?.[0]) {
            if (isMixMode && !isRepeat && canListenWithoutAds) {
              await crossfadeToMusic(data2[0]);
            } else {
              await handlePlayAudio(data2[0]);
            }
          }
          return;
        }
      }
      if (isMixMode && !isRepeat && canListenWithoutAds) {
        await crossfadeToMusic(randomMusic);
      } else {
        await handlePlayAudio(randomMusic);
      }
    } catch (e) {
      console.error("Lỗi random nhạc:", e);
    }
  }, [
    handlePlayAudio,
    currentMusic,
    isMixMode,
    isRepeat,
    canListenWithoutAds,
    crossfadeToMusic,
  ]);

  const handlePauseAudio = useCallback(() => {
    if (!audioRef.current || audioRef.current.paused) return;
    audioRef.current.pause();
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const handleResumeAudio = useCallback(() => {
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, [isPaused]);

  const handleAudioSkip = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration
      );
    }
  }, []);

  const handAudioForward = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 10) {
      audioRef.current.currentTime -= 10;
    }
  }, []);

  const handleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  }, []);

  // Keep mute state in sync when volume/muted is changed outside handleMute
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const syncMutedState = () => {
      setIsMuted(audioEl.muted || audioEl.volume === 0);
    };

    syncMutedState();
    audioEl.addEventListener("volumechange", syncMutedState);

    return () => {
      audioEl.removeEventListener("volumechange", syncMutedState);
    };
  }, []);

  // ----------------------------
  // Sync lyrics + auto-next
  // ----------------------------
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    // Throttle để giảm số lần update state
    let lastUpdateTime = 0;
    const throttleInterval = 100; // Update tối đa mỗi 100ms
    let lastActiveId: number | null = null;

    const syncLyrics = () => {
      // Chỉ sync khi PlayerPage đang mở (tránh re-render không cần thiết ở audio-bar)
      if (!isPlayerPageOpen) {
        return;
      }

      const now = Date.now();
      // Throttle: chỉ update nếu đã qua 100ms
      if (now - lastUpdateTime < throttleInterval) {
        return;
      }
      lastUpdateTime = now;

      const currentTime = audioEl.currentTime;

      const activeSubtitle = subtitles.find(
        (sub) =>
          sub.start !== undefined &&
          sub.end !== undefined &&
          currentTime >= sub.start &&
          currentTime <= sub.end
      );

      // Chỉ update state nếu subtitle thực sự thay đổi
      const newActiveId = activeSubtitle?.id ?? null;
      if (newActiveId !== lastActiveId) {
        lastActiveId = newActiveId;

        setCurrentLyrics((prevLyrics) =>
          activeSubtitle?.text !== prevLyrics
            ? activeSubtitle?.text || null
            : prevLyrics
        );

        setCurrentSubtitleId((prevId) =>
          activeSubtitle?.id !== prevId ? (activeSubtitle?.id ?? null) : prevId
        );

        // Scroll chỉ khi subtitle thay đổi
        if (activeSubtitle?.id) {
          const activeElement = document.getElementById(
            `subtitle-${activeSubtitle.id}`
          );
          if (activeElement) {
            activeElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }
    };

    const handleEnded = () => {
      // Loop vô hạn (ưu tiên cao nhất)
      if (isLoop && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        return;
      }

      // Lặp lại đúng 1 lần rồi tự tắt chế độ repeat
      if (isRepeat && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsRepeat(false);
        return;
      }

      if (crossfadeInProgressRef.current) return;

      // Ưu tiên phát theo hàng đợi nếu có
      if (queue.length > 0) {
        const [nextTrack, ...rest] = queue;
        setQueue(rest);

        const playNextFromQueue = async () => {
          try {
            if (isMixMode && !isRepeat && canListenWithoutAds) {
              await crossfadeToMusic(nextTrack);
            } else {
              await handlePlayAudio(nextTrack);
            }
          } catch (error) {
            console.error("Lỗi phát bài tiếp theo trong hàng đợi:", error);
          }
        };

        // Nếu có quảng cáo, lưu lại hành động phát bài kế tiếp
        if (!canListenWithoutAds) {
          setPendingNextTrack(() => playNextFromQueue);
          setShowAd(true);
        } else {
          void playNextFromQueue();
        }
        return;
      }

      // Nếu không có hàng đợi → giữ nguyên logic random hiện tại
      if (!canListenWithoutAds) {
        setPendingNextTrack(() => handlePlayRandomAudio);
        setShowAd(true);
      } else {
        handlePlayRandomAudio();
      }
    };

    audioEl.addEventListener("timeupdate", syncLyrics);
    audioEl.addEventListener("ended", handleEnded);

    return () => {
      audioEl.removeEventListener("timeupdate", syncLyrics);
      audioEl.removeEventListener("ended", handleEnded);
    };
  }, [
    subtitles,
    handlePlayRandomAudio,
    isRepeat,
    isPlayerPageOpen,
    canListenWithoutAds,
    queue,
    isMixMode,
    crossfadeToMusic,
    handlePlayAudio,
  ]);

  // Auto-mix: khi gần hết bài thì tự crossfade sang bài kế tiếp
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (!isMixMode) return;
    if (isRepeat) return;
    if (!canListenWithoutAds) return;

    const onTimeUpdate = async () => {
      if (crossfadeInProgressRef.current) return;
      if (audioEl.paused) return;
      if (!audioEl.duration || Number.isNaN(audioEl.duration)) return;

      const remaining = audioEl.duration - audioEl.currentTime;
      if (remaining > MIX_TRIGGER_REMAINING_S) return;

      try {
        // Nếu đang có hàng đợi → ưu tiên crossfade theo queue thay vì random
        if (queue.length > 0) {
          const [nextFromQueue, ...rest] = queue;
          setQueue(rest);
          await crossfadeToMusic(nextFromQueue);
          return;
        }

        const res = await fetch("/api/musics?random=1&limit=1", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as IMusic[];
        const next = data?.[0];
        if (!next) return;
        if (next.id === currentMusic?.id) return;
        await crossfadeToMusic(next);
      } catch {
        // ignore
      }
    };

    audioEl.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      audioEl.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [
    isMixMode,
    isRepeat,
    canListenWithoutAds,
    currentMusic?.id,
    crossfadeToMusic,
    queue,
    setQueue,
  ]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handlePlay = () => {
      if (audioEl.currentTime < 1) {
        playCountedRef.current = false;
      }
    };

    const handleTimeUpdate = () => {
      if (playCountedRef.current) return;
      if (audioEl.currentTime < 50) return;

      const musicId = currentMusicIdRef.current;
      if (!musicId) return;

      playCountedRef.current = true;
      fetch(`/api/musics/${musicId}/play`, {
        method: "POST",
        cache: "no-store",
      }).catch((error) => {
        console.warn("Không thể cập nhật lượt nghe:", error);
      });
    };

    audioEl.addEventListener("play", handlePlay);
    audioEl.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEl.removeEventListener("play", handlePlay);
      audioEl.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // Handle ad modal close/continue
  const handleAdClose = () => {
    // Khi đóng quảng cáo, không phát bài tiếp theo
    setShowAd(false);
    setPendingNextTrack(null);
    // Pause audio nếu đang phát
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleAdContinue = () => {
    // Khi bấm "Bỏ qua", phát bài tiếp theo
    setShowAd(false);
    if (pendingNextTrack) {
      pendingNextTrack();
      setPendingNextTrack(null);
    }
  };

  // ----------------------------
  // Return context provider
  // ----------------------------
  return (
    <Provider
      audioRef={audioRef}
      currentMusic={currentMusic}
      queue={queue}
      isPlaying={isPlaying}
      isPaused={isPaused}
      isMuted={isMuted}
      isMixMode={isMixMode}
      isLoop={isLoop}
      currentLyrics={currentLyrics}
      subtitles={subtitles}
      currentSubtitleId={currentSubtitleId}
      isKaraokeMode={isKaraokeMode}
      handlePlayAudio={handlePlayAudio}
      handlePlayRandomAudio={handlePlayRandomAudio}
      handlePauseAudio={handlePauseAudio}
      handleResumeAudio={handleResumeAudio}
      handleAudioSkip={handleAudioSkip}
      handAudioForward={handAudioForward}
      handleMute={handleMute}
      isRepeat={isRepeat}
      handleToggleRepeat={handleToggleRepeat}
      handleToggleLoop={handleToggleLoop}
      handleToggleKaraoke={handleToggleKaraoke}
      handleToggleMixMode={handleToggleMixMode}
      setIsPlayerPageOpen={setIsPlayerPageOpen}
      setQueue={setQueue}
    >
      <audio ref={audioRef} />
      <audio ref={mixAudioRef} />
      {children}
      <AdModal
        isOpen={showAd}
        onClose={handleAdClose}
        onContinue={handleAdContinue}
      />
    </Provider>
  );
}
