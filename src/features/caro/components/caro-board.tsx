"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { BOARD_SIZE } from "../constants";
import { posKey } from "../lib/board";
import type { Board, Cell, Position, SkillCardType } from "../types";

export type SkillMode =
  | SkillCardType
  | "swap_dest"
  | "barrier_second"
  | "blink_second"
  | "grapple_dest"
  | null;

type CaroBoardProps = {
  board: Board;
  lastMove: Position | null;
  blockedCells: string[];
  shieldedCells: string[];
  scoutHighlight?: Position | null;
  onCellClick: (pos: Position) => void;
  disabled?: boolean;
  highlightEmpty?: boolean;
  skillMode?: SkillMode;
  className?: string;
};

const CELLS = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => ({
  row: Math.floor(i / BOARD_SIZE),
  col: i % BOARD_SIZE,
}));

function Stone({ player }: { player: "human" | "ai" }) {
  const isHuman = player === "human";

  return (
    <div className="relative flex h-[78%] w-[78%] items-center justify-center drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
      {isHuman ? (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-[#7ec8e3] bg-gradient-to-br from-[#4a9fd4] to-[#1e5f8a]" />
          <span
            className="relative z-10 text-[11px] font-bold text-[#e8f4fc] sm:text-sm"
            style={{ fontFamily: "var(--font-caro-display)" }}
          >
            O
          </span>
        </>
      ) : (
        <>
          <div className="absolute inset-0 rotate-45 border-2 border-[#ff8a8a] bg-gradient-to-br from-[#e84545] to-[#8b1a1a]" />
          <span
            className="relative z-10 -rotate-45 text-[11px] font-bold text-[#ffe8e8] sm:text-sm"
            style={{ fontFamily: "var(--font-caro-display)" }}
          >
            X
          </span>
        </>
      )}
    </div>
  );
}

function matchesSkillHighlight(
  skillMode: SkillMode,
  cell: Cell,
  isEmpty: boolean,
  isBlocked: boolean,
  isShielded: boolean
): boolean {
  if (!skillMode) return false;
  switch (skillMode) {
    case "remove":
    case "snipe":
    case "domination":
      return cell === "ai";
    case "block":
    case "barrier":
    case "barrier_second":
      return isEmpty;
    case "apocalypse":
    case "quake":
      return true;
    case "shield":
    case "blink":
    case "blink_second":
      return cell === "human";
    case "swap":
      return cell === "human";
    case "swap_dest":
    case "grapple_dest":
      return isEmpty;
    case "grapple":
      return cell === "ai";
    case "unseal":
      return isBlocked;
    case "mend":
      return cell === "human" && isShielded;
    case "rust":
      return cell === "ai" && isShielded;
    default:
      return false;
  }
}

type CaroCellProps = {
  row: number;
  col: number;
  cell: Cell;
  isLast: boolean;
  isBlocked: boolean;
  isShielded: boolean;
  isScout: boolean;
  skillHighlight: boolean;
  disabled?: boolean;
};

const CaroCell = memo(function CaroCell({
  row,
  col,
  cell,
  isLast,
  isBlocked,
  isShielded,
  isScout,
  skillHighlight,
  disabled,
}: CaroCellProps) {
  return (
    <div
      data-cell-row={row}
      data-cell-col={col}
      className={cn(
        "relative flex h-full w-full min-h-0 min-w-0 items-center justify-center border border-[#2d6b45]/40",
        !disabled && "hover:bg-[#ffffff10]",
        isLast && "bg-[#f5e6c820] ring-1 ring-inset ring-[#f5e6c8]",
        isBlocked && "bg-[#1a1a2e80]",
        skillHighlight &&
          "bg-[#c4b5fd40] ring-1 ring-inset ring-[#a78bfa]",
        isScout && "bg-[#fca5a530] ring-2 ring-inset ring-[#f87171]",
        disabled && "cursor-not-allowed"
      )}
    >
      {isBlocked && !cell && (
        <span className="text-[8px] opacity-70 sm:text-[9px]">✕</span>
      )}
      {isScout && !cell && (
        <span className="absolute text-[8px] text-[#fca5a5] sm:text-[9px]">
          AI?
        </span>
      )}
      {isShielded && cell === "human" && (
        <div className="pointer-events-none absolute inset-0.5 rounded-full border-2 border-[#7dd3fc]" />
      )}
      {cell && <Stone player={cell} />}
    </div>
  );
});

function CaroBoardInner({
  board,
  lastMove,
  blockedCells,
  shieldedCells,
  scoutHighlight,
  onCellClick,
  disabled,
  highlightEmpty,
  skillMode,
  className,
}: CaroBoardProps) {
  const blocked = useMemo(() => new Set(blockedCells), [blockedCells]);
  const shielded = useMemo(() => new Set(shieldedCells), [shieldedCells]);
  const onCellClickRef = useRef(onCellClick);
  onCellClickRef.current = onCellClick;

  const handleGridClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cell-row]"
      );
      if (!el) return;
      const row = Number(el.dataset.cellRow);
      const col = Number(el.dataset.cellCol);
      if (Number.isNaN(row) || Number.isNaN(col)) return;
      onCellClickRef.current({ row, col });
    },
    [disabled]
  );

  return (
    <div
      className={cn(
        "relative aspect-square h-full max-h-full w-auto max-w-full shrink-0 rounded-sm border-4 p-0.5 sm:p-1",
        className
      )}
      style={{
        borderColor: "#5c3d2e",
        background:
          "linear-gradient(145deg, #1a4d2e 0%, #0f3320 50%, #0a2818 100%)",
        boxShadow: "6px 6px 0 #0a0a0a, inset 0 0 40px rgba(0,0,0,0.4)",
      }}
    >
      <div
        role="grid"
        aria-disabled={disabled}
        onClick={handleGridClick}
        className={cn(
          "relative grid aspect-square w-full gap-0",
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 100%",
        }}
      >
        {CELLS.map(({ row, col }) => {
          const key = posKey({ row, col });
          const cell = board[row][col];
          const isEmpty = !cell;
          const isBlocked = blocked.has(key);
          const isShielded = shielded.has(key);

          return (
            <CaroCell
              key={key}
              row={row}
              col={col}
              cell={cell}
              isLast={lastMove?.row === row && lastMove?.col === col}
              isBlocked={isBlocked}
              isShielded={isShielded}
              isScout={
                scoutHighlight?.row === row && scoutHighlight?.col === col
              }
              skillHighlight={
                !!(
                  highlightEmpty &&
                  skillMode &&
                  matchesSkillHighlight(
                    skillMode,
                    cell,
                    isEmpty,
                    isBlocked,
                    isShielded
                  )
                )
              }
              disabled={disabled}
            />
          );
        })}
      </div>
    </div>
  );
}

export const CaroBoard = memo(CaroBoardInner);
