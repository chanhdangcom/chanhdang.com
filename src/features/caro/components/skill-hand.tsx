"use client";

import { cn } from "@/lib/utils";
import { MAX_HAND_SIZE, MULLIGAN_DISCARD_COUNT } from "../constants";
import { getCaroAudio } from "../lib/caro-audio";
import { TEXTS } from "../texts";
import type { GamePhase, SkillCard } from "../types";
import { SkillCardView } from "./skill-card";

type SkillHandProps = {
  cards: SkillCard[];
  deckCount: number;
  onSelect: (card: SkillCard) => void;
  onDiscardToggle?: (card: SkillCard) => void;
  discardPicks?: string[];
  onMulligan?: () => void;
  onCancelMulligan?: () => void;
  onCancelSkill?: () => void;
  mulliganAvailable?: boolean;
  disabled: boolean;
  phase: GamePhase;
};

export function SkillHandBar({
  cards,
  deckCount,
  onSelect,
  onDiscardToggle,
  discardPicks = [],
  onMulligan,
  onCancelMulligan,
  onCancelSkill,
  mulliganAvailable,
  disabled,
  phase,
}: SkillHandProps) {
  const isDiscardMode = phase === "select_discard";
  const isSkillTargetMode = phase === "select_skill_target";
  const canUse = !disabled && phase === "playing";

  const withCardClick = (card: SkillCard, fn: () => void) => {
    const audio = getCaroAudio();
    audio.unlock();
    if (!audio.isMuted) audio.playClick();
    fn();
  };

  return (
    <div
      className="relative shrink-0"
      style={{
        background:
          "linear-gradient(180deg, #1a2840 0%, #0f1824 50%, #0a1018 100%)",
        borderTop: "3px solid #c9a66b",
        boxShadow: "0 -8px 28px rgba(0,0,0,0.55)",
      }}
    >
      <div className="mx-auto flex max-w-[96rem] items-end gap-3 px-3 py-2 sm:gap-4 sm:px-4 sm:py-2.5">
        <div className="mb-1 hidden shrink-0 flex-col items-center sm:flex">
          <div className="relative h-[5.75rem] w-[4.25rem]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute inset-0 overflow-hidden rounded-md border-2 border-[#c9a66b]"
                style={{
                  transform: `translate(${i * 2}px, ${-i * 3}px)`,
                  zIndex: i,
                  background:
                    "repeating-linear-gradient(45deg, #7f1d1d 0px, #7f1d1d 4px, #991b1b 4px, #991b1b 8px)",
                  boxShadow: "2px 2px 0 #000",
                }}
              >
                <div className="absolute inset-1 rounded-sm border border-[#fbbf24]/40" />
              </div>
            ))}
          </div>
          <p className="mt-1.5 text-sm text-[#8b7355]">{TEXTS.deckLabel}</p>
          <p className="text-lg text-[#c9a66b]">{TEXTS.deckCount(deckCount)}</p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-1.5 flex flex-wrap items-center justify-center gap-2">
            <span
              className="text-base font-bold uppercase tracking-[0.2em] text-[#c9a66b] sm:text-lg"
              style={{ fontFamily: "var(--font-caro-display)" }}
            >
              {isDiscardMode
                ? TEXTS.mulliganPick(
                    MULLIGAN_DISCARD_COUNT - discardPicks.length
                  )
                : TEXTS.skillHandTitle}
            </span>
            <span className="text-sm text-[#6b5a45]">
              {cards.length}/{MAX_HAND_SIZE}
            </span>

            {isDiscardMode ? (
              <button
                type="button"
                onClick={onCancelMulligan}
                className="rounded-sm border border-[#3d4f6a] px-2.5 py-0.5 text-sm text-[#a8b4c4]"
              >
                {TEXTS.cancelMulligan}
              </button>
            ) : isSkillTargetMode && onCancelSkill ? (
              <button
                type="button"
                onClick={onCancelSkill}
                className="rounded-sm border-2 px-2.5 py-0.5 text-sm tracking-wide"
                style={{
                  borderColor: "#f87171",
                  background: "#3f1515",
                  color: "#fca5a5",
                }}
              >
                {TEXTS.cancelSkill}
              </button>
            ) : (
              mulliganAvailable &&
              onMulligan && (
                <button
                  type="button"
                  onClick={onMulligan}
                  disabled={cards.length < MULLIGAN_DISCARD_COUNT}
                  className={cn(
                    "rounded-sm border-2 px-2.5 py-0.5 text-sm tracking-wide",
                    cards.length < MULLIGAN_DISCARD_COUNT && "opacity-40"
                  )}
                  style={{
                    borderColor: "#c9a66b",
                    background: "#2a3848",
                    color: "#f5e6c8",
                  }}
                >
                  {TEXTS.mulligan}
                </button>
              )
            )}
          </div>

          <div
            className={cn(
              "flex min-h-[12rem] items-end justify-center gap-2 overflow-x-auto py-2 sm:min-h-[13rem] sm:gap-3",
              cards.length === 0 && "items-center"
            )}
          >
            {cards.length === 0 ? (
              <p className="text-lg text-[#6b5a45]">Chờ rút thẻ...</p>
            ) : (
              cards.map((card, i) => (
                <SkillCardView
                  key={card.id}
                  card={card}
                  index={i}
                  total={cards.length}
                  onSelect={
                    isDiscardMode
                      ? () => withCardClick(card, () => onDiscardToggle?.(card))
                      : () => withCardClick(card, () => onSelect(card))
                  }
                  disabled={isDiscardMode ? false : !canUse}
                  selected={discardPicks.includes(card.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="hidden w-[4.25rem] shrink-0 sm:block" />
      </div>
    </div>
  );
}
