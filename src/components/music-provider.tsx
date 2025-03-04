import React, { useContext, useRef } from "react";

type IMusicContext = {
  handlePlayAudio: (audioUrl: string) => void;
  handlePauseAudio: () => void;
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
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayAudio = (audioUrl: string) => {
    if (!audioRef.current) {
      return;
    }

    if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
    audioRef.current.play();
  };

  const handlePauseAudio = () => {
    audioRef.current?.pause();
  };

  return (
    <MusicContext.Provider
      value={{
        handlePlayAudio,
        handlePauseAudio,
      }}
    >
      {children}

      <audio ref={audioRef} preload="auto" />
    </MusicContext.Provider>
  );
}
