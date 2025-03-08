import { HeaderMotion } from "@/features/profile/components/header-motion";
import React, { useContext, useRef, useState } from "react";

type IMusicContext = {
  handlePlayAudio: (audioUrl: string) => void;
  handlePauseAudio: () => void;
  handleResumeAudio: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  lastPlayedUrl: string | null;
  currentTime: number;
  duration: number;
};

const MusicContext = React.createContext<IMusicContext | null>(null);

export function useAudio() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useAudio must be used within a MusicProvider");
  }
  return context;
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastPlayedUrl, setLastPlayedUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = (audioUrl: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.preload = "auto";
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }

    if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }

    audioRef.current.play();
    setIsPlaying(true);
    setIsPaused(false);
    setLastPlayedUrl(audioUrl);
  };

  const handlePauseAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleResumeAudio = () => {
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    } else if (!audioRef.current && lastPlayedUrl) {
      handlePlayAudio(lastPlayedUrl);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        handlePlayAudio,
        handlePauseAudio,
        handleResumeAudio,
        isPlaying,
        isPaused,
        lastPlayedUrl,
        currentTime,
        duration,
      }}
    >
      <HeaderMotion
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
      />
      {children}
    </MusicContext.Provider>
  );
}
