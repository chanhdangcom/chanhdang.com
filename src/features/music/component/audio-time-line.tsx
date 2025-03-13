import { useAudio } from "@/components/music-provider";
import { useEffect, useState } from "react";

export function AudioTimeLine() {
  const { audioRef, isPlaying } = useAudio();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (!audioRef.current) {
      return;
    }

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, audioRef]);

  return (
    <div className="mx-auto h-0.5 w-[50vh] overflow-hidden rounded-full bg-zinc-800">
      <div
        className="h-full bg-zinc-50 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
