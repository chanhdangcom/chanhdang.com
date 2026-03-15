/* eslint-disable @next/next/no-img-element */
"use client";

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

/** Offset giả ngẫu nhiên từ index (cố định để tránh hydration lệch), range ±maxPct. */
function jitter(index: number, maxPct: number): number {
  const n = (index * 17 + index * index * 7) % 100;
  return ((n / 100) * 2 - 1) * maxPct;
}

/** Lưới mobile: 4 cột x 8 dòng + jitter → lộn xộn tự nhiên, không đè. */
function buildMobileGridItems(): { top: string; left: string; rotate: string; size: string }[] {
  const items: { top: string; left: string; rotate: string; size: string }[] = [];
  const cols = 4;
  const rows = 8;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const baseTop = r * 12;
      const baseLeft = c * 25;
      items.push({
        top: `${baseTop + jitter(idx * 2, 3)}%`,
        left: `${baseLeft + jitter(idx * 2 + 1, 4)}%`,
        rotate: ROTATIONS[idx % ROTATIONS.length],
        size: SIZES_MOBILE[idx % SIZES_MOBILE.length],
      });
    }
  }
  return items;
}

/** Lưới desktop: 8 cột x 10 dòng + jitter → lộn xộn tự nhiên. */
function buildDesktopGridItems(): { top: string; left: string; rotate: string; size: string }[] {
  const items: { top: string; left: string; rotate: string; size: string }[] = [];
  const cols = 8;
  const rows = 10;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const baseTop = r * 11;
      const baseLeft = c * 13;
      items.push({
        top: `${baseTop + jitter(idx * 2, 2.5)}%`,
        left: `${baseLeft + jitter(idx * 2 + 1, 3)}%`,
        rotate: ROTATIONS[idx % ROTATIONS.length],
        size: SIZES_DESKTOP[idx % SIZES_DESKTOP.length],
      });
    }
  }
  return items;
}

const MOBILE_GRID_ITEMS = buildMobileGridItems();
const DESKTOP_GRID_ITEMS = buildDesktopGridItems();

export interface BgLogoProps {
  /** Danh sách URL ảnh logo (1 phần tử = 1 logo dùng cho tất cả; nhiều phần tử = xoay vòng). */
  logos: string[];
  /** Opacity lớp nền (mặc định 0.1). */
  opacity?: number;
  /** Class thêm cho wrapper. */
  className?: string;
}

export function BgLogo({ logos, opacity = 0.1, className = "" }: BgLogoProps) {
  const srcList = logos.length > 0 ? logos : ["/img/logo/Logotype Premium (Light).svg"];
  const wrapperClass = `pointer-events-none absolute inset-0 -z-10 min-h-screen overflow-hidden ${className}`;

  return (
    <>
      {/* Mobile: lưới thưa 4x8, logo nhỏ → không đè */}
      <div className={`${wrapperClass} md:hidden`} style={{ opacity }}>
        {MOBILE_GRID_ITEMS.map((item, i) => (
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
        {DESKTOP_GRID_ITEMS.map((item, i) => (
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
