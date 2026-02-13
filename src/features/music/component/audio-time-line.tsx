import { useAudio } from "@/components/music-provider";
import { useCallback, useEffect, useState, useRef } from "react";
import { FastAverageColor } from "fast-average-color";
import Slider from "@mui/material/Slider";

type IProp = {
  coverUrl: string;
};

export function AudioTimeLine({ coverUrl }: IProp) {
  const { audioRef, isPlaying } = useAudio();
  const [durationSec, setDurationSec] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const lastValidTimeRef = useRef(0);
  const lastValidDurationRef = useRef(0);
  const lastSrcRef = useRef("");
  const [progressColor, setProgressColor] = useState("");
  const defaultProgressColor = "#18181b";

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
    const hasFiniteTime = Number.isFinite(newTime) && newTime >= 0;
    const hasFiniteDuration =
      Number.isFinite(newDuration) &&
      newDuration > 0 &&
      newDuration !== Infinity;

    let durationForCalc = lastValidDurationRef.current;
    if (hasFiniteDuration) {
      lastValidDurationRef.current = newDuration;
      durationForCalc = newDuration;
      const durationRounded = Math.floor(newDuration);
      setDurationSec((prev) =>
        prev === durationRounded ? prev : durationRounded
      );
    }

    // While dragging, keep user-controlled preview and skip playback-driven time/progress updates.
    if (isDragging) return;

    const maxTimeBound =
      durationForCalc > 0 ? durationForCalc + 1 : 4 * 60 * 60;
    const isTimeReasonable = hasFiniteTime && newTime <= maxTimeBound;

    let timeForCalc = 0;
    if (isTimeReasonable) {
      if (newTime > 0) {
        lastValidTimeRef.current = newTime;
      }
      timeForCalc = newTime;
    } else if (
      isPlaying &&
      hasFiniteTime &&
      newTime === 0 &&
      lastValidTimeRef.current > 0 &&
      lastValidTimeRef.current <= maxTimeBound
    ) {
      // Khi source đang chờ load, giữ thời gian hợp lệ cũ để tránh nhảy UI.
      timeForCalc = lastValidTimeRef.current;
    } else {
      // Bỏ qua thời gian bất thường (NaN/Infinity/nhảy quá xa) để tránh hiển thị sai hàng giờ.
      timeForCalc = Math.min(lastValidTimeRef.current, maxTimeBound);
    }

    const currentRounded = Math.floor(timeForCalc);
    setCurrentTimeSec((prev) =>
      prev === currentRounded ? prev : currentRounded
    );

    if (durationForCalc > 0) {
      const nextProgress = Math.min(
        100,
        Math.max(0, (timeForCalc / durationForCalc) * 100)
      );
      // Chỉ set khi thay đổi đủ lớn để giảm re-render dày đặc
      setProgress((prev) =>
        Math.abs(prev - nextProgress) < 0.2 ? prev : nextProgress
      );
    }
  }, [audioRef, isDragging, isPlaying]);

  const handleSeekChange = (_event: Event, value: number | number[]) => {
    const nextValue = Array.isArray(value) ? value[0] : value;
    const clamped = Math.min(100, Math.max(0, nextValue));
    if (!isDragging) setIsDragging(true);
    setDragProgress(clamped);
    if (lastValidDurationRef.current > 0) {
      const nextTime = Math.floor(
        (clamped / 100) * lastValidDurationRef.current
      );
      setCurrentTimeSec((prev) => (prev === nextTime ? prev : nextTime));
    }
  };

  const handleSeekCommit = (
    _event: Event | React.SyntheticEvent,
    value: number | number[]
  ) => {
    const el = audioRef.current;
    const nextValue = Array.isArray(value) ? value[0] : value;
    const clamped = Math.min(100, Math.max(0, nextValue));

    setProgress(clamped);
    setDragProgress(null);
    setIsDragging(false);

    if (!el) return;

    const duration =
      Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 0;
    if (duration <= 0) return;

    const nextTime = Math.min(
      duration,
      Math.max(0, (clamped / 100) * duration)
    );
    el.currentTime = nextTime;
    lastValidTimeRef.current = nextTime;
    setCurrentTimeSec((prev) =>
      prev === Math.floor(nextTime) ? prev : Math.floor(nextTime)
    );
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const resetTimeline = () => {
      lastValidTimeRef.current = 0;
      lastValidDurationRef.current = 0;
      setCurrentTimeSec(0);
      setDurationSec(0);
      setProgress(0);
    };

    const syncBySrcChange = () => {
      const currentSrc = el.currentSrc || el.src || "";
      if (currentSrc !== lastSrcRef.current) {
        lastSrcRef.current = currentSrc;
        resetTimeline();
      }
    };

    const syncDuration = () => {
      if (
        Number.isFinite(el.duration) &&
        el.duration > 0 &&
        el.duration !== Infinity
      ) {
        lastValidDurationRef.current = el.duration;
        const durationRounded = Math.floor(el.duration);
        setDurationSec((prev) =>
          prev === durationRounded ? prev : durationRounded
        );
      }
    };
    const handleEnded = () => {
      setProgress(100);
    };

    syncBySrcChange();
    syncDuration();

    el.addEventListener("timeupdate", handleTimeUpdate);
    el.addEventListener("loadedmetadata", syncDuration);
    el.addEventListener("loadstart", syncBySrcChange);
    el.addEventListener("emptied", resetTimeline);
    el.addEventListener("ended", handleEnded);

    return () => {
      el.removeEventListener("timeupdate", handleTimeUpdate);
      el.removeEventListener("loadedmetadata", syncDuration);
      el.removeEventListener("loadstart", syncBySrcChange);
      el.removeEventListener("emptied", resetTimeline);
      el.removeEventListener("ended", handleEnded);
    };
  }, [audioRef, handleTimeUpdate]);

  return (
    <div className="w-full">
      <div className="">
        <Slider
          aria-label="Audio progress"
          value={isDragging && dragProgress !== null ? dragProgress : progress}
          min={0}
          max={100}
          step={0.1}
          onChange={handleSeekChange}
          onChangeCommitted={handleSeekCommit}
          sx={{
            color: progressColor || defaultProgressColor,
            height: 4,
            py: 0,
            px: 0,
            touchAction: "none",
            "& .MuiSlider-track, & .MuiSlider-rail": {
              top: "50%",
              transform: "translateY(-50%)",
            },
            "& .MuiSlider-rail": {
              opacity: 1,
              height: 6,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.28)",
            },
            "& .MuiSlider-track": {
              height: 6,
              borderRadius: 999,
              border: "none",
              backgroundColor: "rgba(255,255,255,0.96)",
              transition: isDragging ? "none" : "width 200ms ease",
            },
            "& .MuiSlider-thumb": {
              width: 22,
              height: 22,
              opacity: 0,
              backgroundColor: "transparent",
              boxShadow: "none",
              "&::before": { display: "none" },
            },
            "& .MuiSlider-mark, & .MuiSlider-markLabel": { display: "none" },
          }}
        />
      </div>

      <div className="-mt-4 mb-4 flex items-center justify-between md:mt-2">
        <div className="text-sm font-medium text-zinc-400 font-apple">
          {formatTime(currentTimeSec)}
        </div>

        <div className="text-sm font-medium text-zinc-400 font-apple">
          {formatTime(durationSec)}
        </div>
      </div>
    </div>
  );
}
