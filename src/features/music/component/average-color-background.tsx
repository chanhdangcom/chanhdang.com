"use client";

import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

interface BlurredAverageBackgroundProps {
  imageUrl?: string;
  blurAmount?: number;
  children: React.ReactNode;
}

export default function BlurredAverageBackground({
  imageUrl,
  blurAmount = 80,
  children,
}: BlurredAverageBackgroundProps) {
  const [bgColor, setBgColor] = useState("#000000");

  useEffect(() => {
    if (!imageUrl) {
      setBgColor("#18181b");
      return;
    }

    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      fac
        .getColorAsync(img)
        .then((color) => setBgColor(color.hex))
        .catch(() => setBgColor("#18181b"));
    };

    return () => {
      fac.destroy();
    };
  }, [imageUrl]);

  return (
    <div className="relative w-full">
      {/* Lớp nền thay đổi màu + blur */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${bgColor}, #18181b)`, // Chuyển xuống zinc-950
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `blur(${blurAmount}px) brightness(0.6)`,
          WebkitFilter: `blur(${blurAmount}px) brightness(0.6)`,
        }}
      ></div>

      {/* Nội dung gốc (không bị ảnh hưởng bởi nền) */}
      <div className="relative">{children}</div>
    </div>
  );
}
