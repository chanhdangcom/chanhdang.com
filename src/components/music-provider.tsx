import { HeaderMotion } from "@/features/profile/components/header-motion";
import { MUSICS } from "@/features/profile/data/music";
import { IMusic } from "@/features/profile/types/music";
import React, { useCallback, useContext, useRef, useState } from "react";

type IMusicContext = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentMusic: IMusic | null;
  isPlaying: boolean;
  isPaused: boolean;

  handlePlayAudio: (music: IMusic) => void;
  handlePlayRandomAudio: () => void;
  handlePauseAudio: () => void;
  handleResumeAudio: () => void;
  handleAudioSkip: () => void;
  handAudioForward: () => void;
};

// !BAD
function calc(
  title: string,
  singer: string,
  audio: string,
  cover: string,
  youTube: string
) {
  console.log(title, singer, cover, youTube);
}

calc("Co chac yeu la day", "audio.mp3", "Son Tung", "abc.jpg", "youtube");

// ?GOOD
function calc2(params: {
  id: string;
  title: string;
  singer: string;
  audio: string;
  cover: string;
  youTube?: string;
}) {
  const { title, singer, audio, cover, youTube } = params;
  console.log(title, singer, audio, cover, youTube);
}

calc2({
  id: "id",
  title: "Co chac yeu la day",
  audio: "audio.mp3",
  cover: "cover.jpg",
  singer: "Son Tung",
});

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = useCallback((music: IMusic) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(music.audio);
      audioRef.current.preload = "auto";
      // audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
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
    if (!audioRef.current) {
      return;
    }

    if (audioRef.current.paused) {
      return;
    }

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

  return (
    <Provider
      audioRef={audioRef}
      currentMusic={currentMusic}
      isPlaying={isPlaying}
      isPaused={isPaused}
      //
      handlePlayAudio={handlePlayAudio}
      handlePlayRandomAudio={handlePlayRandomAudio}
      handlePauseAudio={handlePauseAudio}
      handleResumeAudio={handleResumeAudio}
      handleAudioSkip={handleAudioSkip}
      handAudioForward={handAudioForward}
    >
      <HeaderMotion />

      {children}
    </Provider>
  );
}
