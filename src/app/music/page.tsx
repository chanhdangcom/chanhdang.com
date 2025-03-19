"use client";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { MusicPage } from "@/features/music/page";

export default function Page() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("dark");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dark">
      <MusicPage />
    </div>
  );
}
