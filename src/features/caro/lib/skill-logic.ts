import { SKILL_META } from "../constants";
import { findThreatMove, scorePosition } from "./ai";
import {
  cloneBoard,
  getAiStones,
  getHumanStones,
  inBounds,
  posKey,
} from "./board";
import type { Board, GameState, Position, SkillCardType } from "../types";

export function getNeighborsAdj(pos: Position): Position[] {
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  return dirs
    .map(([dr, dc]) => ({ row: pos.row + dr, col: pos.col + dc }))
    .filter((p) => inBounds(p.row, p.col));
}

export function clearArea3x3(board: Board, center: Position): Board {
  const next = cloneBoard(board);
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = center.row + dr;
      const c = center.col + dc;
      if (inBounds(r, c)) next[r][c] = null;
    }
  }
  return next;
}

export function fortifyAllHuman(board: Board): string[] {
  return getHumanStones(board).map(posKey);
}

export function applyDomination(board: Board, pos: Position): Board {
  const next = cloneBoard(board);
  if (next[pos.row][pos.col] === "ai") {
    next[pos.row][pos.col] = "human";
  }
  return next;
}

export function getScoutHighlight(state: GameState): Position {
  return findThreatMove(
    state.board,
    state.winLength,
    state.blockedCells,
    "ai",
    "hard"
  );
}

export function filterHistoryAfterRemove(
  history: GameState["moveHistory"],
  positions: Position[]
): GameState["moveHistory"] {
  const keys = new Set(positions.map(posKey));
  return history.filter((m) => !keys.has(posKey(m.pos)));
}

export function isInstantSkill(type: SkillCardType): boolean {
  return !!SKILL_META[type].instant;
}

export function clearCross(board: Board, center: Position): Board {
  const next = cloneBoard(board);
  const dirs = [
    [0, 0],
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ] as const;
  for (const [dr, dc] of dirs) {
    const r = center.row + dr;
    const c = center.col + dc;
    if (inBounds(r, c)) next[r][c] = null;
  }
  return next;
}

export function crossKeys(center: Position): Set<string> {
  const keys = new Set<string>();
  for (const [dr, dc] of [
    [0, 0],
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]) {
    keys.add(posKey({ row: center.row + dr, col: center.col + dc }));
  }
  return keys;
}

export function formatPeekPreview(deck: SkillCardType[]): string {
  return deck
    .slice(0, 3)
    .map((t) => SKILL_META[t].name)
    .join(" → ");
}

export function pickStrongestAiStone(
  board: Board,
  winLength: GameState["winLength"]
): Position | null {
  const stones = getAiStones(board);
  if (stones.length === 0) return null;
  return stones.sort(
    (a, b) =>
      scorePosition(board, b, "ai", winLength) -
      scorePosition(board, a, "ai", winLength)
  )[0];
}

export function swapStones(
  board: Board,
  a: Position,
  b: Position
): Board {
  const next = cloneBoard(board);
  const tmp = next[a.row][a.col];
  next[a.row][a.col] = next[b.row][b.col];
  next[b.row][b.col] = tmp;
  return next;
}

export function moveStone(
  board: Board,
  from: Position,
  to: Position,
  player: "human" | "ai"
): Board {
  const next = cloneBoard(board);
  next[from.row][from.col] = null;
  next[to.row][to.col] = player;
  return next;
}
