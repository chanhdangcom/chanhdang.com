import { IMusic } from "@/app/[locale]/features/profile /types/music";
import { MUSICS } from "@/features/music/data/music-page";
import React, {
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

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
  subtitles: Subtitle[]; // 🆕 Thêm phần này để render full lời ở UI

  handlePlayAudio: (music: IMusic) => void;
  handlePlayRandomAudio: () => void;
  handlePauseAudio: () => void;
  handleResumeAudio: () => void;
  handleAudioSkip: () => void;
  handAudioForward: () => void;
  handleMute: () => void;
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

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<IMusic | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentLyrics, setCurrentLyrics] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentMusicRef = useRef<IMusic | null>(null);

  useEffect(() => {
    currentMusicRef.current = currentMusic;
  }, [currentMusic]);

  useEffect(() => {
    fetch("/srt/ChayNgayDi.srt")
      .then((res) => res.text())
      .then((text) => setSubtitles(parseSRT(text)))
      .catch((err) => console.error("Lỗi load SRT:", err));
  }, []);

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

    audioEl.addEventListener("timeupdate", syncLyrics);
    return () => {
      audioEl.removeEventListener("timeupdate", syncLyrics);
    };
  }, [subtitles]);

  const handlePlayAudio = useCallback(
    async (music: IMusic) => {
      if (currentMusic?.id === music.id) return;
      setCurrentMusic(music);

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 1;
          audioRef.current
            .play()
            .catch((error) => console.error("Lỗi phát nhạc:", error));
        }
      }, 100);

      setIsPlaying(true);
      setIsPaused(false);
    },
    [currentMusic]
  );

  const handlePlayRandomAudio = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * MUSICS.length);
    const music = MUSICS[randomIndex];
    handlePlayAudio(music);
  }, [handlePlayAudio]);

  const handlePauseAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) return;

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
    if (audioRef.current) {
      if (audioRef.current.currentTime > 10) {
        audioRef.current.currentTime = audioRef.current.currentTime - 10;
      }
    }
  }, []);

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <Provider
      audioRef={audioRef}
      currentMusic={currentMusic}
      isPlaying={isPlaying}
      isPaused={isPaused}
      isMuted={isMuted}
      currentLyrics={currentLyrics}
      subtitles={subtitles} // 🆕 xuất lyrics cho UI
      handlePlayAudio={handlePlayAudio}
      handlePlayRandomAudio={handlePlayRandomAudio}
      handlePauseAudio={handlePauseAudio}
      handleResumeAudio={handleResumeAudio}
      handleAudioSkip={handleAudioSkip}
      handAudioForward={handAudioForward}
      handleMute={handleMute}
    >
      <audio ref={audioRef} src={currentMusic?.audio} autoPlay />
      {children}
    </Provider>
  );
}
