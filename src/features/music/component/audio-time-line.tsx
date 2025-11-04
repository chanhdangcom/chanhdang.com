import { useAudio } from "@/components/music-provider";
import { useCallback, useEffect, useState, useRef } from "react";
import { format } from "date-fns";

export function AudioTimeLine() {
  const { audioRef, isPlaying } = useAudio();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const lastValidTimeRef = useRef(0);
  const lastValidDurationRef = useRef(0);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleTimeUpdate = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;

    const newTime = el.currentTime;
    const newDuration = el.duration;

    // Chỉ update nếu giá trị hợp lệ (không phải 0 khi đang playing, hoặc duration hợp lệ)
    if (newDuration > 0 && newDuration !== Infinity) {
      lastValidDurationRef.current = newDuration;
      setDuration(newDuration);
    }

    // Chỉ update currentTime nếu hợp lệ
    if (newTime > 0 || !isPlaying) {
      // Nếu đang playing và time > 0, hoặc đang paused, thì update
      if (newTime > 0) {
        lastValidTimeRef.current = newTime;
      }
      setCurrentTime(newTime);
    } else if (isPlaying && newTime === 0 && lastValidTimeRef.current > 0) {
      // Khi đang playing nhưng time = 0 (có thể đang load/switch source), giữ giá trị cũ
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

  return (
    <div className="w-full">
      <div className="bg-z mx-auto h-1 w-full overflow-hidden rounded-full dark:bg-zinc-400">
        <div
          className="h-full bg-zinc-900 transition-all duration-300 dark:bg-zinc-50"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm text-zinc-400">
          {duration ? format(new Date(currentTime * 1000), "m:ss") : "0:00"}
        </div>

        <div className="text-sm text-zinc-400">
          {duration ? format(new Date(duration * 1000), "m:ss") : "0:00"}
        </div>
      </div>
    </div>
  );
}
