import { HeaderMotion } from "@/features/profile/components/header-motion";
import React, { useContext, useRef, useState } from "react";

type IMusicContext = {
  handlePlayAudio: (
    audioUrl: string,
    title: string,
    cover: string,
    singer: string
  ) => void;
  handlePauseAudio: () => void;
  handleResumeAudio: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  lastPlayedUrl: string | null;
  currentTime: number;
  duration: number;
  songTitle: string;
  coverImage: string;
  singerTitle: string;
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
  const [songTitle, setSongTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [singerTitle, setSingerTitle] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = (
    audioUrl: string,
    title: string,
    cover: string,
    singer: string
  ) => {
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
    setSongTitle(title);
    setCoverImage(cover);
    setSingerTitle(singer);
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
      handlePlayAudio(lastPlayedUrl, songTitle, coverImage, singerTitle);
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
        songTitle,
        coverImage,
        singerTitle,
      }}
    >
      <HeaderMotion
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        songTitle={songTitle}
        coverImage={coverImage}
        singer={singerTitle}
      />
      {children}
    </MusicContext.Provider>
  );
}
