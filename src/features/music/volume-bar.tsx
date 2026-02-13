import { SpeakerHigh, SpeakerNone } from "@phosphor-icons/react/dist/ssr";
import Slider from "@mui/material/Slider";
import { useAudio } from "@/components/music-provider";
import { type SyntheticEvent, useEffect, useRef, useState } from "react";

export function VolumeBar() {
  const { audioRef, isMuted } = useAudio();
  const [volumePercent, setVolumePercent] = useState(100);
  const lastNonZeroVolumeRef = useRef(100);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const syncVolume = () => {
      const nextVolume = Math.round(Math.min(1, Math.max(0, el.volume)) * 100);
      const visibleVolume = el.muted ? 0 : nextVolume;
      setVolumePercent(visibleVolume);
      if (nextVolume > 0) {
        lastNonZeroVolumeRef.current = nextVolume;
      }
    };

    syncVolume();
    el.addEventListener("volumechange", syncVolume);

    return () => {
      el.removeEventListener("volumechange", syncVolume);
    };
  }, [audioRef]);

  const setAudioVolume = (nextPercent: number) => {
    const el = audioRef.current;
    if (!el) return;

    const clamped = Math.min(100, Math.max(0, nextPercent));
    el.volume = clamped / 100;
    el.muted = clamped === 0;
  };

  const handleVolumeChange = (_event: Event, value: number | number[]) => {
    const nextValue = Array.isArray(value) ? value[0] : value;
    const clamped = Math.min(100, Math.max(0, nextValue));
    setVolumePercent(clamped);
    setAudioVolume(clamped);
  };

  const handleVolumeCommit = (
    _event: Event | SyntheticEvent,
    value: number | number[]
  ) => {
    const nextValue = Array.isArray(value) ? value[0] : value;
    const clamped = Math.min(100, Math.max(0, nextValue));
    if (clamped > 0) {
      lastNonZeroVolumeRef.current = clamped;
    }
    setAudioVolume(clamped);
  };

  const handleMinSpeakerClick = () => {
    if (volumePercent === 0) {
      const restore = Math.min(
        100,
        Math.max(10, lastNonZeroVolumeRef.current || 60)
      );
      setVolumePercent(restore);
      setAudioVolume(restore);
      return;
    }

    setVolumePercent(0);
    setAudioVolume(0);
  };

  return (
    <div className="flex items-center justify-between gap-2 text-white">
      <button
        type="button"
        aria-label={volumePercent === 0 || isMuted ? "Unmute" : "Mute"}
        onClick={handleMinSpeakerClick}
        className="flex items-center justify-start text-zinc-200/90 transition hover:text-white"
      >
        <SpeakerNone size={18} weight="fill" />
      </button>

      <div className="flex flex-1 items-center">
        <Slider
          aria-label="Volume"
          value={volumePercent}
          min={0}
          max={100}
          step={1}
          onChange={handleVolumeChange}
          onChangeCommitted={handleVolumeCommit}
          sx={{
            color: "rgba(255,255,255,0.96)",
            height: 0,
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
              transition: "width 120ms ease",
            },
            "& .MuiSlider-thumb": {
              width: 22,
              height: 22,
              opacity: 0,
              backgroundColor: "transparent",
              boxShadow: "none",
              "&::before": { display: "none" },
            },
          }}
        />
      </div>

      <div className="flex items-center justify-end text-zinc-200/90">
        <SpeakerHigh size={18} weight="fill" className="ml-2" />
      </div>
    </div>
  );
}
