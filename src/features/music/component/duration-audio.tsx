import { useAudio } from "@/components/music-provider";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export function DurationAudio() {
  const { audioRef, isPlaying } = useAudio();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

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
    <div className="flex gap-2 text-zinc-500">
      <div className="">
        {duration ? format(new Date(currentTime * 1000), "m:ss") : "0:00"}
      </div>

      <div className="">
        {duration ? format(new Date(duration * 1000), "m:ss") : "0:00"}
      </div>
    </div>
  );
}
