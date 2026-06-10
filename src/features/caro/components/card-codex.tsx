"use client";

import { useState } from "react";
import {
  ALL_SKILL_TYPES,
  RARITY_CONFIG,
  SKILL_META,
} from "../constants";
import { getDeckPoolStats } from "../lib/deck";
import { TEXTS } from "../texts";
import type { CardRarity, SkillCardType } from "../types";
import { SkillCardView } from "./skill-card";

const RARITY_ORDER: CardRarity[] = [
  "legendary",
  "epic",
  "rare",
  "common",
];

export function CardCodexButton({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={TEXTS.codexTitle}
        aria-label={TEXTS.codexTitle}
        className={
          compact
            ? `shrink-0 rounded-sm border-2 px-2.5 py-0.5 text-sm tracking-wider transition-transform active:translate-y-px ${className ?? ""}`
            : `w-full rounded-sm border-2 px-3 py-1 text-base tracking-wider transition-transform active:translate-y-px ${className ?? ""}`
        }
        style={{
          borderColor: "#c9a66b",
          background: "#1a2840",
          color: "#f5e6c8",
          boxShadow: "2px 2px 0 #0a0a0a",
        }}
      >
        {compact ? "📖" : TEXTS.codexTitle}
      </button>

      {open && <CardCodexModal onClose={() => setOpen(false)} />}
    </>
  );
}

function CardCodexModal({ onClose }: { onClose: () => void }) {
  const stats = getDeckPoolStats();
  const total = stats.reduce((s, x) => s + x.copies, 0);

  const byRarity = RARITY_ORDER.map((rarity) => ({
    rarity,
    cards: ALL_SKILL_TYPES.filter((t) => SKILL_META[t].rarity === rarity),
  }));

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-md border-4"
        style={{
          borderColor: "#c9a66b",
          background: "linear-gradient(180deg, #1a2438, #0f1824)",
          boxShadow: "8px 8px 0 #000",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="flex shrink-0 items-center justify-between border-b-2 px-4 py-3"
          style={{ borderColor: "#3d4f6a" }}
        >
          <div>
            <h2 className="text-2xl tracking-wider text-[#f5e6c8] sm:text-3xl">
              {TEXTS.codexTitle}
            </h2>
            <p className="text-sm text-[#8b7355]">{TEXTS.codexSubtitle(total)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border-2 px-3 py-1 text-lg"
            style={{ borderColor: "#3d4f6a", color: "#c9a66b" }}
          >
            ✕
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {/* Rarity summary */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {RARITY_ORDER.map((rarity) => {
              const cfg = RARITY_CONFIG[rarity];
              const count = stats
                .filter((s) => SKILL_META[s.type].rarity === rarity)
                .reduce((sum, s) => sum + s.copies, 0);
              const pct = ((count / total) * 100).toFixed(0);
              return (
                <div
                  key={rarity}
                  className="rounded-sm border-2 px-2 py-2 text-center"
                  style={{ borderColor: cfg.color, background: "#121a28" }}
                >
                  <p className="text-sm font-bold" style={{ color: cfg.color }}>
                    {cfg.label}
                  </p>
                  <p className="text-xl text-[#f5e6c8]">{pct}%</p>
                  <p className="text-xs text-[#6b7f9a]">{count}/{total} lá</p>
                </div>
              );
            })}
          </div>

          {byRarity.map(({ rarity, cards }) => (
            <section key={rarity} className="mb-6">
              <h3
                className="mb-3 flex items-center gap-2 text-lg tracking-wider sm:text-xl"
                style={{ color: RARITY_CONFIG[rarity].color }}
              >
                {RARITY_CONFIG[rarity].label}
                <span className="text-sm text-[#6b7f9a]">
                  — {TEXTS.codexRarityHint(rarity)}
                </span>
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((type) => (
                  <CodexEntry key={type} type={type} rate={stats.find((s) => s.type === type)?.rate ?? "0"} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodexEntry({ type, rate }: { type: SkillCardType; rate: string }) {
  const meta = SKILL_META[type];

  return (
    <div
      className="flex gap-3 rounded-sm border-2 p-2"
      style={{ borderColor: meta.border, background: "#121a28" }}
    >
      <div className="shrink-0 scale-[0.72] origin-top-left sm:scale-[0.8]">
        <SkillCardView card={{ id: type, type }} size="draw" />
      </div>
      <div className="min-w-0 flex-1 py-1">
        <p className="text-base font-bold text-[#f5e6c8]">{meta.name}</p>
        <p className="mt-0.5 text-xs leading-snug text-[#a8b4c4]">
          {meta.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span
            className="rounded-sm border px-1.5 py-0.5 text-[10px]"
            style={{ borderColor: meta.border, color: meta.accent }}
          >
            {meta.deckCopies} bản / bộ
          </span>
          <span className="rounded-sm border border-[#3d4f6a] px-1.5 py-0.5 text-[10px] text-[#c9a66b]">
            {rate}% rơi
          </span>
          {meta.instant && (
            <span className="rounded-sm border border-[#c084fc] px-1.5 py-0.5 text-[10px] text-[#c084fc]">
              Tức thì
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
