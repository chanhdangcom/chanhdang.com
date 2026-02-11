import { useAudio } from "@/components/music-provider";
import { useCallback, useEffect, useState, useRef } from "react";
import { FastAverageColor } from "fast-average-color";

type IProp = {
  coverUrl: string;
};

export function AudioTimeLine({ coverUrl }: IProp) {
  const { audioRef, isPlaying } = useAudio();
  const [durationSec, setDurationSec] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [progress, setProgress] = useState(0);
  const lastValidTimeRef = useRef(0);
  const lastValidDurationRef = useRef(0);
  const [progressColor, setProgressColor] = useState("");

  const formatTime = (seconds: number) => {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const minute = Math.floor(safeSeconds / 60);
    const second = Math.floor(safeSeconds % 60);
    return `${minute}:${String(second).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!coverUrl) {
      setProgressColor("#FFFFFF");
      return;
    }

    let cancelled = false;
    const fac = new FastAverageColor();

    // Fallback: deterministic color from URL when CORS blocks pixel access
    const fallbackFromUrl = (url: string) => {
      let hash = 0;
      for (let i = 0; i < url.length; i++) {
        hash = (hash << 5) - hash + url.charCodeAt(i);
        hash |= 0;
      }
      const hue = Math.abs(hash) % 360;
      const sat = 65;
      const light = 55;
      return `hsl(${hue} ${sat}% ${light}%)`;
    };

    // Try with crossOrigin image to avoid canvas tainting
    const img = new Image();
    img.crossOrigin = "anonymous";
    // Cache buster to avoid cached responses without CORS headers
    const sep = coverUrl.includes("?") ? "&" : "?";
    img.src = `${coverUrl}${sep}avg_color=1`;

    img.onload = () => {
      fac
        .getColorAsync(img)
        .then((color) => {
          if (!cancelled) setProgressColor(color.hex);
        })
        .catch(() => {
          if (!cancelled) setProgressColor(fallbackFromUrl(coverUrl));
        });
    };
    img.onerror = () => {
      if (!cancelled) setProgressColor(fallbackFromUrl(coverUrl));
    };

    return () => {
      cancelled = true;
    };
  }, [coverUrl]);

  const handleTimeUpdate = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;

    const newTime = el.currentTime;
    const newDuration = el.duration;

    let durationForCalc = lastValidDurationRef.current;
    if (newDuration > 0 && newDuration !== Infinity) {
      lastValidDurationRef.current = newDuration;
      durationForCalc = newDuration;
      const durationRounded = Math.floor(newDuration);
      setDurationSec((prev) => (prev === durationRounded ? prev : durationRounded));
    }

    let timeForCalc = newTime;
    if (newTime > 0 || !isPlaying) {
      if (newTime > 0) {
        lastValidTimeRef.current = newTime;
      }
      timeForCalc = newTime;
    } else if (isPlaying && newTime === 0 && lastValidTimeRef.current > 0) {
      // Khi source đang chờ load, giữ thời gian hợp lệ cũ để tránh nhảy UI
      timeForCalc = lastValidTimeRef.current;
    }

    const currentRounded = Math.floor(timeForCalc);
    setCurrentTimeSec((prev) => (prev === currentRounded ? prev : currentRounded));

    if (durationForCalc > 0) {
      const nextProgress = Math.min(100, Math.max(0, (timeForCalc / durationForCalc) * 100));
      // Chỉ set khi thay đổi đủ lớn để giảm re-render dày đặc
      setProgress((prev) => (Math.abs(prev - nextProgress) < 0.2 ? prev : nextProgress));
    }
  }, [audioRef, isPlaying]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const syncDuration = () => {
      if (el.duration > 0 && el.duration !== Infinity) {
        lastValidDurationRef.current = el.duration;
        const durationRounded = Math.floor(el.duration);
        setDurationSec((prev) => (prev === durationRounded ? prev : durationRounded));
      }
    };

    syncDuration();

    el.addEventListener("timeupdate", handleTimeUpdate);
    el.addEventListener("loadedmetadata", syncDuration);

    return () => {
      el.removeEventListener("timeupdate", handleTimeUpdate);
      el.removeEventListener("loadedmetadata", syncDuration);
    };
  }, [audioRef, handleTimeUpdate]);

  return (
    <div className="w-full">
      <div className="mx-auto h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-400">
        <div
          className="h-full bg-zinc-900 transition-all duration-300 dark:bg-zinc-50"
          style={{ width: `${progress}%`, backgroundColor: progressColor }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm text-zinc-400">{formatTime(currentTimeSec)}</div>

        <div className="text-sm text-zinc-400">{formatTime(durationSec)}</div>
      </div>
    </div>
  );
}
