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
  start: number;
  end: number;
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
  const regex =
    /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;
  let matches;
  const subtitles: Subtitle[] = [];

  while ((matches = regex.exec(srt)) !== null) {
    subtitles.push({
      id: parseInt(matches[1], 10),
      start: timeToSeconds(matches[2]),
      end: timeToSeconds(matches[3]),
      text: matches[4].trim(),
    });
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ----------------------------
  // Load subtitles (.srt)
  // ----------------------------
  useEffect(() => {
    fetch("/srt/ChayNgayDi.srt")
      .then((res) => res.text())
      .then((text) => setSubtitles(parseSRT(text)))
      .catch((err) => console.error("Lỗi load SRT:", err));
  }, []);

  // ----------------------------
  // Audio control functions
  // ----------------------------
  const handlePlayAudio = useCallback(
    (music: IMusic) => {
      if (currentMusic?.id === music.id) return;
      setCurrentMusic(music);
      setIsPlaying(true);
      setIsPaused(false);
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
        (sub) => currentTime >= sub.start && currentTime <= sub.end
      );

      setCurrentLyrics((prevLyrics) =>
        activeSubtitle?.text !== prevLyrics
          ? activeSubtitle?.text || null
          : prevLyrics
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
