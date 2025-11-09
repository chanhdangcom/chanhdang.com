import { useAudio } from "@/components/music-provider";
import { useCallback, useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { FastAverageColor } from "fast-average-color";

type IProp = {
  coverUrl: string;
};

export function AudioTimeLine({ coverUrl }: IProp) {
  const { audioRef, isPlaying } = useAudio();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const lastValidTimeRef = useRef(0);
  const lastValidDurationRef = useRef(0);
  const [Color, setColor] = useState("");

  useEffect(() => {
    if (!coverUrl) {
      setColor("#FFFFFF");
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
          if (!cancelled) setColor(color.hex);
        })
        .catch(() => {
          if (!cancelled) setColor(fallbackFromUrl(coverUrl));
        });
    };
    img.onerror = () => {
      if (!cancelled) setColor(fallbackFromUrl(coverUrl));
    };

    return () => {
      cancelled = true;
    };
  }, [coverUrl]);

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
      <div className="mx-auto h-1 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-400">
        <div
          className="h-full bg-zinc-900 transition-all duration-300 dark:bg-zinc-50"
          style={{ width: `${progress}%`, backgroundColor: Color }}
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
