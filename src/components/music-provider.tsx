import { HeaderMotion } from "@/features/profile/components/header-motion";
import React, { useContext, useRef, useState } from "react";

type IMusicContext = {
  handlePlayAudio: (
    audioUrl: string,
    title: string,
    cover: string,
    singer: string,
    youtube: string,
    audio: string
  ) => void;
  handlePauseAudio: () => void;
  handleResumeAudio: () => void;
  handleAudioSkip: () => void;
  handAudioForward: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  lastPlayedUrl: string | null;
  currentTime: number;
  duration: number;
  songTitle: string;
  coverImage: string;
  singerTitle: string;
  youtubeLink: string;
  audioHref: string;
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
  const [youtubeLink, setYoutubeLink] = useState("");
  const [audioHref, setAudioHref] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = (
    audioUrl: string,
    title: string,
    cover: string,
    singer: string,
    youtube: string,
    audio: string
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
    setYoutubeLink(youtube);
    setAudioHref(audio);
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
      handlePlayAudio(
        lastPlayedUrl,
        songTitle,
        coverImage,
        singerTitle,
        youtubeLink,
        audioHref
      );
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioSkip = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration
      );
    }
  };

  const handAudioForward = () => {
    if (audioRef.current) {
      if (audioRef.current.currentTime > 10) {
        audioRef.current.currentTime = audioRef.current.currentTime - 10;
      }
    }
  };

  return (
    <MusicContext.Provider
      value={{
        handlePlayAudio,
        handlePauseAudio,
        handleResumeAudio,
        handleAudioSkip,
        handAudioForward,
        isPlaying,
        isPaused,
        lastPlayedUrl,
        currentTime,
        duration,
        songTitle,
        coverImage,
        singerTitle,
        youtubeLink,
        audioHref,
      }}
    >
      <HeaderMotion
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        songTitle={songTitle}
        coverImage={coverImage}
        singerTitle={singerTitle}
        youtubeLink={youtubeLink}
        audioHref={audioHref}
      />
      {children}
    </MusicContext.Provider>
  );
}
