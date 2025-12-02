import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

interface UseImageHoverColorOptions {
  /**
   * Alpha value for the rgba color (0-1)
   * @default 0.18
   */
  alpha?: number;
  /**
   * Skip color calculation if URL matches this value
   * @default "/img/Logomark.png"
   */
  skipUrl?: string;
}

/**
 * Custom hook to calculate hover background color from an image URL
 * @param imageUrl - The URL of the image to extract color from
 * @param options - Configuration options
 * @returns The calculated rgba color string
 */
export function useImageHoverColor(
  imageUrl: string | null | undefined,
  options: UseImageHoverColorOptions = {}
): string {
  const { alpha = 0.18, skipUrl = "/img/Logomark.png" } = options;
  const [hoverBg, setHoverBg] = useState<string>("transparent");

  useEffect(() => {
    const cover = imageUrl;
    if (!cover || cover === skipUrl) {
      setHoverBg("transparent");
      return;
    }

    let cancelled = false;
    const fac = new FastAverageColor();

    const hexToRgba = (hex: string, alphaValue: number) => {
      let h = hex.replace("#", "");
      if (h.length === 3) {
        h = h
          .split("")
          .map((c) => c + c)
          .join("");
      }
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alphaValue})`;
    };

    const fallbackFromUrl = (url: string) => {
      let hash = 0;
      for (let i = 0; i < url.length; i++) {
        hash = (hash << 5) - hash + url.charCodeAt(i);
        hash |= 0;
      }
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue} 65% 55% / ${alpha})`;
    };

    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    const sep = cover.includes("?") ? "&" : "?";
    img.src = `${cover}${sep}avg_color=1`;

    img.onload = () => {
      fac
        .getColorAsync(img)
        .then((color) => {
          if (!cancelled) setHoverBg(hexToRgba(color.hex, alpha));
        })
        .catch(() => {
          if (!cancelled) setHoverBg(fallbackFromUrl(cover));
        });
    };
    img.onerror = () => {
      if (!cancelled) setHoverBg(fallbackFromUrl(cover));
    };

    return () => {
      cancelled = true;
    };
  }, [imageUrl, alpha, skipUrl]);

  return hoverBg;
}

