"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { RARITY_CONFIG, SKILL_META } from "../constants";
import type { SkillCard as SkillCardType } from "../types";

type SkillCardProps = {
  card: SkillCardType;
  onSelect?: () => void;
  disabled?: boolean;
  selected?: boolean;
  isNew?: boolean;
  index?: number;
  total?: number;
  size?: "hand" | "draw";
};

function SkillCardViewInner({
  card,
  onSelect,
  disabled,
  selected,
  isNew,
  index = 0,
  total = 1,
  size = "hand",
}: SkillCardProps) {
  const meta = SKILL_META[card.type];
  const rarity = RARITY_CONFIG[meta.rarity];
  const isLegend = meta.rarity === "legendary";
  const Tag = onSelect ? "button" : "div";
  const isHand = size === "hand";
  const rotate = isHand && total > 1 ? (index - (total - 1) / 2) * 1.5 : 0;

  return (
    <Tag
      type={onSelect ? "button" : undefined}
      disabled={disabled}
      onClick={onSelect}
      {...(onSelect ? { "data-caro-skill": true } : {})}
      className={cn(
        "group relative shrink-0 text-left",
        isHand
          ? "h-[12rem] w-[8.25rem] sm:h-[13rem] sm:w-[9rem]"
          : "h-[14rem] w-[9.5rem] sm:h-[15rem] sm:w-[10rem]",
        onSelect && !disabled && "cursor-pointer",
        disabled && !selected && "cursor-not-allowed opacity-55"
      )}
      style={{
        zIndex: selected ? 50 : 10 + index,
        transform: `rotate(${rotate}deg)`,
        transition:
          "transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1), z-index 0s",
        filter:
          disabled && !selected ? "grayscale(0.3) brightness(0.85)" : undefined,
        outline: selected ? `3px solid ${rarity.color}` : undefined,
        outlineOffset: selected ? "3px" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!onSelect || (disabled && !selected)) return;
        e.currentTarget.style.transform = `rotate(0deg)  scale(1.06)`;
        e.currentTarget.style.zIndex = "60";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotate}deg)`;
        e.currentTarget.style.zIndex = selected ? "50" : String(10 + index);
      }}
    >
      <div
        className="relative h-full w-full rounded-lg p-[4px]"
        style={{
          background: isLegend
            ? "linear-gradient(135deg, #fff7ed 0%, #fbbf24 25%, #b45309 55%, #fef3c7 100%)"
            : "linear-gradient(180deg, #f0e0c8 0%, #c9a66b 38%, #7a5c1a 100%)",
          boxShadow: isNew
            ? `0 0 28px ${rarity.color}bb, 4px 5px 0 #1a0a0a`
            : selected
              ? `0 0 18px ${rarity.color}99, 4px 5px 0 #1a0a0a`
              : "4px 5px 0 #1a0a0a, 0 8px 20px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="relative flex h-full w-full flex-col rounded-[6px] border-[3px]"
          style={{
            borderColor: meta.border,
            backgroundColor: "#faf3e8",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          {isLegend && (
            <div
              className="pointer-events-none absolute -right-1 -top-1 z-20 text-sm"
              style={{ animation: "caro-sparkle 2.5s ease-in-out infinite" }}
            >
              ✦
            </div>
          )}

          <div
            className="relative flex shrink-0 items-center justify-between px-2 py-1"
            style={{ background: meta.foil }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-wider sm:text-[11px]"
              style={{ color: isLegend ? "#78350f" : "#1a0a0a" }}
            >
              {rarity.label}
            </span>
            <span
              className="text-[11px] font-bold"
              style={{ color: rarity.color }}
            >
              {isLegend ? "👑" : "★"}
            </span>
          </div>

          <div
            className="relative mx-2 mt-1.5 flex shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-[#1a0a0a]/25"
            style={{
              background: meta.artBg,
              height: isHand ? "4.5rem" : "5.5rem",
              boxShadow: "inset 0 4px 12px rgba(0,0,0,0.35)",
            }}
          >
            <span
              className="relative z-10 drop-shadow-[2px_3px_0_rgba(0,0,0,0.85)]"
              style={{ fontSize: isHand ? "2.75rem" : "3.25rem" }}
            >
              {meta.icon}
            </span>
          </div>

          <div
            className="mx-2 mt-1.5 shrink-0 rounded-md px-1.5 py-0.5 text-center"
            style={{
              background: `linear-gradient(180deg, ${meta.accent}f0, ${meta.border})`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            <p
              className="truncate text-sm font-bold leading-tight text-white"
              style={{
                fontFamily: "var(--font-caro-display)",
                textShadow: "1px 1px 0 rgba(0,0,0,0.65)",
              }}
            >
              {meta.name}
            </p>
          </div>

          <div className="mx-2 mb-2 mt-1 flex min-h-0 flex-1 items-start px-0.5">
            <p
              className="text-[10px] leading-snug text-[#3d2a1a] sm:text-[11px]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {meta.description}
            </p>
          </div>
        </div>
      </div>
    </Tag>
  );
}

export const SkillCardView = memo(SkillCardViewInner);
