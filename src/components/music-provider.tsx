"use client";

import React, {
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

import { IMusic } from "@/app/[locale]/features/profile /types/music";

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
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  currentLyrics: string | null;
  subtitles: Subtitle[];
  currentSubtitleId: number | null;

  handlePlayAudio: (music: IMusic) => void;
  handlePlayRandomAudio: () => void;
  handlePauseAudio: () => void;
  handleResumeAudio: () => void;
  handleAudioSkip: () => void;
  handAudioForward: () => void;
  handleMute: () => void;
  isRepeat: boolean | null;
  handleToggleRepeat: () => void;
};

// ----------------------------
// Helper functions
// ----------------------------

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
  const [currentMusic, setCurrentMusic] = useState<IMusic | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentLyrics, setCurrentLyrics] = useState<string | null>(null);
  const [currentSubtitleId, setCurrentSubtitleId] = useState<number | null>(
    null
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    },
    [currentMusic]
  );

  useEffect(() => {
    if (audioRef.current && currentMusic) {
      audioRef.current.src = currentMusic.audio;
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1;
      audioRef.current
        .play()
        .catch((error) => console.error("Lỗi phát nhạc:", error));
    }
  }, [currentMusic]);

  const handleToggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
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
          if (data2?.[0]) await handlePlayAudio(data2[0]);
          return;
        }
      }
      await handlePlayAudio(randomMusic);
    } catch (e) {
      console.error("Lỗi random nhạc:", e);
    }
  }, [handlePlayAudio, currentMusic]);

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

  // ----------------------------
  // Sync lyrics + auto-next
  // ----------------------------
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const syncLyrics = () => {
      const currentTime = audioEl.currentTime;

      const activeSubtitle = subtitles.find(
        (sub) =>
          currentTime >= (sub.start ?? 0) && currentTime <= (sub.end ?? 0)
      );

      setCurrentLyrics((prevLyrics) =>
        activeSubtitle?.text !== prevLyrics
          ? activeSubtitle?.text || null
          : prevLyrics
      );

      setCurrentSubtitleId((prevId) =>
        activeSubtitle?.id !== prevId ? (activeSubtitle?.id ?? null) : prevId
      );

      const activeElement = document.getElementById(
        `subtitle-${activeSubtitle?.id}`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    const handleEnded = () => {
      if (isRepeat && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
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
  }, [subtitles, handlePlayRandomAudio, isRepeat]);

  // ----------------------------
  // Return context provider
  // ----------------------------
  return (
    <Provider
      audioRef={audioRef}
      currentMusic={currentMusic}
      isPlaying={isPlaying}
      isPaused={isPaused}
      isMuted={isMuted}
      currentLyrics={currentLyrics}
      subtitles={subtitles}
      currentSubtitleId={currentSubtitleId}
      handlePlayAudio={handlePlayAudio}
      handlePlayRandomAudio={handlePlayRandomAudio}
      handlePauseAudio={handlePauseAudio}
      handleResumeAudio={handleResumeAudio}
      handleAudioSkip={handleAudioSkip}
      handAudioForward={handAudioForward}
      handleMute={handleMute}
      isRepeat={isRepeat}
      handleToggleRepeat={handleToggleRepeat}
    >
      <audio ref={audioRef} src={currentMusic?.audio} autoPlay />
      {children}
    </Provider>
  );
}
