"use client";

import { cn } from "@/lib/utils";
import { VT323 } from "next/font/google";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AI_DIFFICULTIES, AI_DIFFICULTY_CONFIG } from "../constants";
import { TEXTS } from "../texts";
import { useCaroGame } from "../hooks/use-caro-game";
import { useCaroSounds } from "../hooks/use-caro-sounds";
import type { WinLength } from "../types";
import { AiSkillFlash } from "./ai-skill-flash";
import { CardCodexButton } from "./card-codex";
import { CardDrawOverlay } from "./card-draw-overlay";
import { CaroBoard } from "./caro-board";
import { CaroKeyframes } from "./caro-keyframes";
import { SkillHandBar } from "./skill-hand";

const caroDisplay = VT323({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-caro-display",
});

export function CaroGame() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "vi";
  const {
    state,
    selectSkill,
    handleCellClick,
    resetGame,
    cancelSkill,
    setWinLength,
    setAiDifficulty,
    completeDrawAnimation,
    startMulligan,
    cancelMulligan,
    toggleDiscardPick,
    canChangeRules,
  } = useCaroGame();

  const { muted, toggleMute, onUiClick } = useCaroSounds(state);

  const isDrawing = state.phase === "drawing_card";
  const isAiSkill = state.phase === "ai_skill_flash";
  const isDiscard = state.phase === "select_discard";
  const isHumanTurn =
    state.currentPlayer === "human" &&
    !isDrawing &&
    !isAiSkill &&
    (state.phase === "playing" ||
      state.phase === "extra_move" ||
      state.phase === "select_skill_target" ||
      isDiscard);

  const boardDisabled =
    (!isHumanTurn && state.phase !== "select_skill_target") ||
    state.phase === "ai_thinking" ||
    isAiSkill ||
    isDiscard ||
    !!state.winner;

  const skillMode =
    state.phase === "select_skill_target" && state.activeSkill
      ? state.activeSkill.type === "swap" && state.skillSource
        ? "swap_dest"
        : state.activeSkill.type === "barrier" && state.skillSource
          ? "barrier_second"
          : state.activeSkill.type === "blink" && state.skillSource
            ? "blink_second"
            : state.activeSkill.type === "grapple" && state.skillSource
              ? "grapple_dest"
              : state.activeSkill.type
      : null;

  const humanCount = state.board.flat().filter((c) => c === "human").length;
  const aiCount = state.board.flat().filter((c) => c === "ai").length;

  const statusText = state.winner
    ? state.winner === "human"
      ? TEXTS.youWin
      : TEXTS.aiWin
    : isAiSkill
      ? TEXTS.aiSkillFlash
      : state.phase === "ai_thinking"
        ? TEXTS.aiThinking
        : isDrawing
          ? TEXTS.drawingCard
          : state.message || (isHumanTurn && !isDiscard ? "Lượt của bạn" : "");

  return (
    <div
      className={cn(
        caroDisplay.variable,
        "flex h-screen flex-col overflow-hidden"
      )}
      style={{
        fontFamily: "var(--font-caro-display), monospace",
        background: "#0a1018",
        color: "#f5e6c8",
      }}
      onClick={onUiClick}
    >
      <CaroKeyframes />
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
        }}
      />

      <CardDrawOverlay
        animation={state.drawAnimation}
        deckCount={state.deck.length}
        onComplete={completeDrawAnimation}
      />
      <AiSkillFlash card={state.aiSkillFlash} />

      <div className="relative z-10 flex min-h-0 flex-1">
        <aside
          className="hidden min-h-0 w-60 shrink-0 flex-col gap-2 overflow-y-auto border-r-2 p-2.5 lg:flex xl:w-64"
          style={{
            borderColor: "#3d4f6a",
            background: "linear-gradient(180deg, #1a2438 0%, #121a28 100%)",
          }}
        >
          <Link
            href={`/${locale}`}
            className="text-sm text-[#6b7f9a] hover:text-[#c9a66b]"
          >
            {TEXTS.backHome}
          </Link>

          <h1
            className="text-[2.75rem] leading-none tracking-wider text-[#f5e6c8] xl:text-5xl"
            style={{ textShadow: "2px 2px 0 #5c1a1a" }}
          >
            {TEXTS.title}
          </h1>

          <StatBox
            label="Bạn ○"
            value={String(humanCount)}
            highlight={state.currentPlayer === "human"}
          />
          <StatBox
            label="AI ×"
            value={String(aiCount)}
            highlight={state.currentPlayer === "ai"}
          />
          <StatBox
            label="Tay bạn"
            value={`${state.humanHand.length} thẻ`}
            highlight={state.currentPlayer === "human"}
          />
          <StatBox
            label="Tay AI"
            value={`${state.aiHand.length} thẻ`}
            highlight={state.currentPlayer === "ai"}
          />
          <StatBox label="Lượt" value={String(state.turnCount)} />
          <StatBox label="Thắng" value={`${state.winLength} quân`} />

          <div className="space-y-2">
            <SidebarToggle
              label={TEXTS.aiLevelLabel}
              options={AI_DIFFICULTIES.map((d) => ({
                id: d,
                label: AI_DIFFICULTY_CONFIG[d].label,
              }))}
              value={state.aiDifficulty}
              onChange={setAiDifficulty}
              disabled={!canChangeRules}
            />
            <SidebarToggle
              label={TEXTS.winLengthLabel}
              options={[
                { id: "5", label: TEXTS.winLength5 },
                { id: "6", label: TEXTS.winLength6 },
              ]}
              value={String(state.winLength)}
              onChange={(v) => setWinLength(Number(v) as WinLength)}
              disabled={!canChangeRules}
            />
          </div>

          <CardCodexButton />

          <SidebarBtn onClick={toggleMute} variant="ghost">
            {muted ? TEXTS.soundOff : TEXTS.soundOn}
          </SidebarBtn>

          <div className="mt-auto shrink-0 space-y-1.5 pt-2">
            {state.phase === "select_skill_target" && (
              <SidebarBtn onClick={cancelSkill} variant="ghost">
                {TEXTS.cancelSkill}
              </SidebarBtn>
            )}
            <SidebarBtn onClick={resetGame}>
              {state.winner ? TEXTS.playAgain : TEXTS.newGame}
            </SidebarBtn>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header
            className="flex shrink-0 items-center justify-between gap-2 border-b-2 px-3 py-2 lg:hidden"
            style={{ borderColor: "#3d4f6a", background: "#1a2438" }}
          >
            <div>
              <p className="text-2xl leading-none tracking-wider">
                {TEXTS.title}
              </p>
              <p className="text-sm text-[#8b7355]">
                {TEXTS.humanHandCount(state.humanHand.length)} ·{" "}
                {TEXTS.aiSkillCount(state.aiHand.length)} ·{" "}
                {state.winLength} quân
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <CardCodexButton compact />
              <SidebarBtn onClick={toggleMute} variant="ghost" small>
                {muted ? "🔇" : "🔊"}
              </SidebarBtn>
              <SidebarBtn onClick={resetGame} small>
                {TEXTS.newGame}
              </SidebarBtn>
            </div>
          </header>

          {statusText && (
            <div
              className="shrink-0 border-b px-3 py-2 text-center text-xl tracking-wide sm:text-2xl"
              style={{
                borderColor: "#3d4f6a33",
                background: state.winner
                  ? state.winner === "human"
                    ? "#064e3b55"
                    : "#7f1d1d55"
                  : isAiSkill
                    ? "#7f1d1d44"
                    : "#1a243866",
                color: isAiSkill ? "#fca5a5" : "#f5e6c8",
              }}
            >
              {statusText}
            </div>
          )}

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-1 sm:p-2"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, #1a5c3a 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #0f3d28 0%, transparent 45%), linear-gradient(160deg, #0d2818 0%, #1a4d32 40%, #0a2015 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 18px, rgba(0,0,0,0.12) 18px, rgba(0,0,0,0.12) 19px)",
              }}
            />

            <div className="relative flex h-full max-h-full w-full max-w-full items-center justify-center">
              <CaroBoard
                board={state.board}
                lastMove={state.lastMove}
                blockedCells={state.blockedCells}
                shieldedCells={state.shieldedCells}
                scoutHighlight={state.scoutHighlight}
                onCellClick={handleCellClick}
                disabled={boardDisabled}
                highlightEmpty={state.phase === "select_skill_target"}
                skillMode={skillMode}
                className="max-h-full max-w-full lg:max-h-[min(100%,calc(100vw-20rem))] lg:max-w-[min(100%,calc(100vw-20rem))]"
              />

              {state.winner && (
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.45)" }}
                >
                  <p
                    className="rounded-md border-4 px-8 py-4 text-center text-4xl tracking-[0.2em] sm:text-5xl"
                    style={{
                      fontFamily: "var(--font-caro-display)",
                      borderColor:
                        state.winner === "human" ? "#34d399" : "#f87171",
                      background:
                        state.winner === "human"
                          ? "linear-gradient(180deg, #064e3bee, #022c22ee)"
                          : "linear-gradient(180deg, #7f1d1dee, #450a0aee)",
                      color: state.winner === "human" ? "#6ee7b7" : "#fca5a5",
                      textShadow: "3px 3px 0 #000",
                      boxShadow: "6px 6px 0 #000",
                    }}
                  >
                    {state.winner === "human" ? TEXTS.youWin : TEXTS.aiWin}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div
            className="flex shrink-0 items-center gap-1.5 border-t px-2 py-1.5 lg:hidden"
            style={{ borderColor: "#3d4f6a", background: "#121a28" }}
          >
            <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto pb-0.5">
              {AI_DIFFICULTIES.map((d) => (
                <MiniToggle
                  key={d}
                  active={state.aiDifficulty === d}
                  disabled={!canChangeRules}
                  onClick={() => setAiDifficulty(d)}
                  label={AI_DIFFICULTY_CONFIG[d].shortLabel}
                  title={AI_DIFFICULTY_CONFIG[d].label}
                />
              ))}
            <MiniToggle
              active={state.winLength === 5}
              disabled={!canChangeRules}
              onClick={() => setWinLength(5)}
              label="5"
            />
            <MiniToggle
              active={state.winLength === 6}
              disabled={!canChangeRules}
              onClick={() => setWinLength(6)}
              label="6"
            />
            </div>
          </div>

          <SkillHandBar
            cards={state.humanHand}
            deckCount={state.deck.length}
            onSelect={selectSkill}
            onDiscardToggle={toggleDiscardPick}
            discardPicks={state.discardPicks}
            onMulligan={startMulligan}
            onCancelMulligan={cancelMulligan}
            onCancelSkill={cancelSkill}
            mulliganAvailable={
              isHumanTurn &&
              !state.mulliganUsedThisTurn &&
              state.phase === "playing"
            }
            disabled={!isHumanTurn || state.phase === "select_skill_target"}
            phase={state.phase}
          />
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-sm border-2 px-2 py-1"
      style={{
        borderColor: highlight ? "#c9a66b" : "#3d4f6a",
        background: highlight ? "#2a3848" : "#1a2438",
      }}
    >
      <p className="text-sm uppercase tracking-wider text-[#6b7f9a]">{label}</p>
      <p className="text-2xl leading-tight text-[#f5e6c8]">{value}</p>
    </div>
  );
}

function SidebarBtn({
  children,
  onClick,
  variant = "primary",
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-sm border-2 tracking-wider transition-transform active:translate-y-px",
        small ? "px-2 py-0.5 text-sm" : "px-3 py-1 text-base"
      )}
      style={{
        borderColor: variant === "primary" ? "#c9a66b" : "#3d4f6a",
        background: variant === "primary" ? "#8b2942" : "#1a2438",
        color: "#f5e6c8",
        boxShadow: "2px 2px 0 #0a0a0a",
      }}
    >
      {children}
    </button>
  );
}

function SidebarToggle<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <p className="mb-0.5 text-xs uppercase tracking-wider text-[#6b7f9a]">
        {label}
      </p>
      <div className="flex flex-wrap gap-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-sm border px-1.5 py-0.5 text-xs",
              disabled && "opacity-50"
            )}
            style={{
              borderColor: value === o.id ? "#c9a66b" : "#3d4f6a",
              background: value === o.id ? "#8b2942" : "#121a28",
              color: value === o.id ? "#f5e6c8" : "#6b7f9a",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MiniToggle({
  active,
  disabled,
  onClick,
  label,
  title,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={cn(
        "shrink-0 rounded-sm border px-2 py-0.5 text-xs",
        disabled && "opacity-50"
      )}
      style={{
        borderColor: active ? "#c9a66b" : "#3d4f6a",
        background: active ? "#8b2942" : "#121a28",
        color: active ? "#f5e6c8" : "#6b7f9a",
      }}
    >
      {label}
    </button>
  );
}
