/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Nền logo lặp theo lưới, xoay nhiều chiều, tối ưu để không đè lên nhau.
 * Trang khác truyền vào mảng logo (src) để dùng logo riêng.
 */
const ROTATIONS = [
  "rotate-0",
  "rotate-12",
  "-rotate-12",
  "rotate-45",
  "-rotate-45",
  "rotate-90",
  "-rotate-90",
  "rotate-[30deg]",
  "-rotate-[30deg]",
  "rotate-[20deg]",
  "-rotate-[20deg]",
  "rotate-[15deg]",
  "-rotate-[15deg]",
  "rotate-135",
  "rotate-180",
  "rotate-[7deg]",
  "-rotate-[7deg]",
] as const;

/** Mobile: logo nhỏ, lưới thưa (4 cột) để không đè. Desktop: logo lớn hơn, lưới dày. */
const SIZES_MOBILE = ["w-10", "w-12", "w-10", "w-12"] as const;
const SIZES_DESKTOP = ["w-20", "w-24", "w-28", "w-32"] as const;

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function jitter(rnd: () => number, maxPct: number): number {
  return (rnd() * 2 - 1) * maxPct;
}

type GridItem = { top: string; left: string; rotate: string; size: string };

/** Lưới mobile: 4 cột x 8 dòng + jitter → lộn xộn tự nhiên, không đè. */
function buildMobileGridItems(seed: number): GridItem[] {
  const rnd = mulberry32(seed ^ 0xa341316c);
  const items: { top: string; left: string; rotate: string; size: string }[] = [];
  const cols = 4;
  const rows = 8;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const baseTop = r * 12;
      const baseLeft = c * 25;
      items.push({
        top: `${baseTop + jitter(rnd, 6)}%`,
        left: `${baseLeft + jitter(rnd, 8)}%`,
        rotate: ROTATIONS[Math.floor(rnd() * ROTATIONS.length)],
        size: SIZES_MOBILE[Math.floor(rnd() * SIZES_MOBILE.length)],
      });
    }
  }
  return items;
}

/** Lưới desktop: 8 cột x 10 dòng + jitter → lộn xộn tự nhiên. */
function buildDesktopGridItems(seed: number): GridItem[] {
  const rnd = mulberry32(seed ^ 0xc8013ea4);
  const items: { top: string; left: string; rotate: string; size: string }[] = [];
  const cols = 8;
  const rows = 10;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const baseTop = r * 11;
      const baseLeft = c * 13;
      items.push({
        top: `${baseTop + jitter(rnd, 5)}%`,
        left: `${baseLeft + jitter(rnd, 6)}%`,
        rotate: ROTATIONS[Math.floor(rnd() * ROTATIONS.length)],
        size: SIZES_DESKTOP[Math.floor(rnd() * SIZES_DESKTOP.length)],
      });
    }
  }
  return items;
}

export interface BgLogoProps {
  /** Danh sách URL ảnh logo (1 phần tử = 1 logo dùng cho tất cả; nhiều phần tử = xoay vòng). */
  logos: string[];
  /** Opacity lớp nền (mặc định 0.1). */
  opacity?: number;
  /** Class thêm cho wrapper. */
  className?: string;
}

export function BgLogo({ logos, opacity = 0.1, className = "" }: BgLogoProps) {
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    setSeed(arr[0] ?? 0);
  }, []);

  const srcList = logos.length > 0 ? logos : ["/img/logo/Logotype Premium (Light).svg"];
  const wrapperClass = `pointer-events-none absolute inset-0 -z-10 min-h-screen overflow-hidden ${className}`;
  const mobileItems = useMemo(() => buildMobileGridItems(seed), [seed]);
  const desktopItems = useMemo(() => buildDesktopGridItems(seed), [seed]);

  return (
    <>
      {/* Mobile: lưới thưa 4x8, logo nhỏ → không đè */}
      <div className={`${wrapperClass} md:hidden`} style={{ opacity }}>
        {mobileItems.map((item, i) => (
          <img
            key={i}
            src={srcList[i % srcList.length]}
            alt=""
            className={`absolute ${item.size} ${item.rotate}`}
            style={{ top: item.top, left: item.left }}
          />
        ))}
      </div>
      {/* Desktop: lưới dày 8x10 */}
      <div className={`${wrapperClass} hidden md:block`} style={{ opacity }}>
        {desktopItems.map((item, i) => (
          <img
            key={i}
            src={srcList[i % srcList.length]}
            alt=""
            className={`absolute ${item.size} ${item.rotate}`}
            style={{ top: item.top, left: item.left }}
          />
        ))}
      </div>
    </>
  );
}
