import { useAudio } from "@/components/music-provider";
import { useEffect, useState, useCallback, useMemo } from "react";
import { format } from "date-fns";

export function DurationAudio() {
  const { audioRef } = useAudio();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  }, [audioRef]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    // Chỉ thêm event listener, không quan tâm isPlaying
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [handleTimeUpdate]);

  const formattedTime = useMemo(() => {
    return {
      current: duration ? format(new Date(currentTime * 1000), "m:ss") : "0:00",
      total: duration ? format(new Date(duration * 1000), "m:ss") : "0:00",
    };
  }, [currentTime, duration]);

  return (
    <div className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-50">
      <div>{formattedTime.current}</div>/<div>{formattedTime.total}</div>
    </div>
  );
}
