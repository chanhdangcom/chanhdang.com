import { useAudio } from "@/components/music-provider";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { format } from "date-fns";

export function DurationAudio() {
  const { audioRef, isPlaying } = useAudio();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const lastValidTimeRef = useRef(0);
  const lastValidDurationRef = useRef(0);

  const handleTimeUpdate = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;

    const newTime = el.currentTime;
    const newDuration = el.duration;

    // Chỉ update duration nếu hợp lệ
    if (newDuration > 0 && newDuration !== Infinity) {
      lastValidDurationRef.current = newDuration;
      setDuration(newDuration);
    }

    // Chỉ update currentTime nếu hợp lệ
    if (newTime > 0 || !isPlaying) {
      if (newTime > 0) {
        lastValidTimeRef.current = newTime;
      }
      setCurrentTime(newTime);
    } else if (isPlaying && newTime === 0 && lastValidTimeRef.current > 0) {
      // Khi đang playing nhưng time = 0 (có thể đang load/switch), giữ giá trị cũ
      setCurrentTime(lastValidTimeRef.current);
    }
  }, [audioRef, isPlaying]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    // Load duration ngay khi có
    if (el.duration > 0 && el.duration !== Infinity) {
      setDuration(el.duration);
      lastValidDurationRef.current = el.duration;
    }

    el.addEventListener("timeupdate", handleTimeUpdate);
    el.addEventListener("loadedmetadata", () => {
      if (el.duration > 0 && el.duration !== Infinity) {
        setDuration(el.duration);
        lastValidDurationRef.current = el.duration;
      }
    });

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
    <div className="flex gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-50">
      <div>{formattedTime.current}</div>/<div>{formattedTime.total}</div>
    </div>
  );
}
