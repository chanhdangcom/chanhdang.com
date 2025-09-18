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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentMusicRef = useRef<IMusic | null>(null);
  useEffect(() => {
    currentMusicRef.current = currentMusic;
  }, [currentMusic]);

  // crossfade audio instance (tạo mới mỗi lần)
  const crossfadeAudioRef = useRef<HTMLAudioElement | null>(null);

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

  // Random nhạc khi bài hát kết thúc (crossfade thay cho end)
  useEffect(() => {
    if (!audioRef.current) return;
    const mainAudio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!currentMusicRef.current) return;

      // Khi còn <= 5 giây thì chuẩn bị crossfade
      if (
        mainAudio.duration - mainAudio.currentTime <= 5 &&
        !crossfadeAudioRef.current
      ) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * MUSICS.length);
        } while (MUSICS[randomIndex].id === currentMusicRef.current?.id);

        const nextMusic = MUSICS[randomIndex];

        // tạo mới crossfade audio
        const nextCrossfade = new Audio(nextMusic.audio);
        nextCrossfade.volume = 0;
        nextCrossfade.play();
        crossfadeAudioRef.current = nextCrossfade;

        const fadeDuration = 5000; // 5s crossfade
        const stepTime = 50; // mỗi 50ms
        const mainStep = mainAudio.volume / (fadeDuration / stepTime);
        const crossStep = 1 / (fadeDuration / stepTime);

        let elapsed = 0;
        const interval = setInterval(() => {
          elapsed += stepTime;

          mainAudio.volume = Math.max(0, mainAudio.volume - mainStep);
          nextCrossfade.volume = Math.min(1, nextCrossfade.volume + crossStep);

          if (elapsed >= fadeDuration) {
            clearInterval(interval);

            // xong crossfade thì đổi sang nhạc mới
            mainAudio.pause();
            mainAudio.src = nextMusic.audio;
            mainAudio.currentTime = nextCrossfade.currentTime;
            mainAudio.volume = 1;
            nextCrossfade.pause();
            crossfadeAudioRef.current = null;

            mainAudio.play();
            setCurrentMusic(nextMusic); // đổi UI sau khi crossfade hoàn tất
          }
        }, stepTime);
      }
    };

    mainAudio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      mainAudio.removeEventListener("timeupdate", handleTimeUpdate);
    };
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
    >
      <audio ref={audioRef} src={currentMusic?.audio} autoPlay />
      {children}
    </Provider>
  );
}
