"use client";
import { MusicPage } from "@/features/music/page";
import { useTheme } from "next-themes";
import { useEffect } from "react";
export default function Page() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="dark">
      <MusicPage />
    </div>
  );
}
