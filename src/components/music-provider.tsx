import { MUSICS } from "@/features/music/data/music-page";
import { IMusic } from "@/features/profile/types/music";
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

  count: number;
  handleUpdateCount: (newCount: number) => void;

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
  const parts = time.split(":"),
    seconds = parts[2].split(",");
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

  const [count, setCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentMusic) return;

    fetch(`/audio/MuonRoiMaSaoCons.mp3.srt`)
      .then((res) => res.text())
      .then((text) => setSubtitles(parseSRT(text)));
  }, [currentMusic]);

  useEffect(() => {
    if (!audioRef.current) return;

    const syncLyrics = () => {
      if (!audioRef.current) return;
      const currentTime = audioRef.current.currentTime;
      const activeSubtitle = subtitles.find(
        (sub) => currentTime >= sub.start && currentTime <= sub.end
      );

      // Chỉ cập nhật nếu lyrics thực sự thay đổi
      setCurrentLyrics((prevLyrics) =>
        activeSubtitle?.text !== prevLyrics
          ? activeSubtitle?.text || null
          : prevLyrics
      );

      // 🔥 Tự động cuộn đến dòng hiện tại
      const activeElement = document.getElementById(
        `subtitle-${activeSubtitle?.id}`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    audioRef.current.addEventListener("timeupdate", syncLyrics);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", syncLyrics);
    };
  }, [subtitles]);

  const handlePlayAudio = useCallback((music: IMusic) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(music.audio);
      audioRef.current.preload = "auto";
    }

    if (audioRef.current.src !== music.audio) {
      audioRef.current.src = music.audio;
      audioRef.current.load();
    }

    audioRef.current.play();
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentMusic(music);
  }, []);

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
      handlePlayAudio={handlePlayAudio}
      handlePlayRandomAudio={handlePlayRandomAudio}
      handlePauseAudio={handlePauseAudio}
      handleResumeAudio={handleResumeAudio}
      handleAudioSkip={handleAudioSkip}
      handAudioForward={handAudioForward}
      handleMute={handleMute}
      //
      count={count}
      handleUpdateCount={setCount}
    >
      {children}
    </Provider>
  );
}
