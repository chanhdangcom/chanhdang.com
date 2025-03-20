import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";

import { useAudio } from "@/components/music-provider";
import { AudioTimeLine } from "@/features/music/component/audio-time-line";

export function MusicTime() {
  const { audioRef, isPlaying } = useAudio();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  }, [audioRef]);

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

  console.log("Render MusicTime");

  return (
    <div className="mx-auto mt-4 flex items-center justify-between gap-2 font-sf">
      <div className="text-xs text-zinc-400">
        {duration ? format(new Date(currentTime * 1000), "m:ss") : "0:00"}
      </div>

      <AudioTimeLine />

      <div className="text-xs text-zinc-400">
        {duration ? format(new Date(duration * 1000), "m:ss") : "0:00"}
      </div>
    </div>
  );
}
