import { useAudio } from "@/components/music-provider";
import { useEffect, useState, useCallback, useMemo } from "react";
import { format } from "date-fns";

export function DurationAudio() {
  const { audioRef } = useAudio();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      setCurrentTime(el.currentTime);
      setDuration(el.duration);
    }
  }, [audioRef]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      el.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioRef, handleTimeUpdate]);

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
