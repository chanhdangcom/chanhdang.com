import { BOARD_SIZE } from "../constants";
import type { Board, Cell, Player, Position, WinLength } from "../types";

export function posKey({ row, col }: Position): string {
  return `${row},${col}`;
}

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array<Cell>(BOARD_SIZE).fill(null)
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function placeStoneInPlace(
  board: Board,
  pos: Position,
  player: Player
): void {
  board[pos.row][pos.col] = player;
}

export function placeStone(
  board: Board,
  pos: Position,
  player: Player
): Board {
  const next = cloneBoard(board);
  next[pos.row][pos.col] = player;
  return next;
}

export function removeStone(board: Board, pos: Position): Board {
  const next = cloneBoard(board);
  next[pos.row][pos.col] = null;
  return next;
}

export function checkWin(
  board: Board,
  pos: Position,
  player: Player,
  winLength: WinLength
): boolean {
  const directions: [number, number][] = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    let count = 1;

    for (const sign of [-1, 1]) {
      let r = pos.row + dr * sign;
      let c = pos.col + dc * sign;
      while (inBounds(r, c) && board[r][c] === player) {
        count++;
        r += dr * sign;
        c += dc * sign;
      }
    }

    if (count >= winLength) return true;
  }

  return false;
}

export function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

export function getNeighbors(pos: Position, radius = 2): Position[] {
  const result: Position[] = [];
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      if (dr === 0 && dc === 0) continue;
      const row = pos.row + dr;
      const col = pos.col + dc;
      if (inBounds(row, col)) result.push({ row, col });
    }
  }
  return result;
}

export function getCandidateMoves(board: Board): Position[] {
  const stones: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col]) stones.push({ row, col });
    }
  }

  if (stones.length === 0) {
    const mid = Math.floor(BOARD_SIZE / 2);
    return [{ row: mid, col: mid }];
  }

  const seen = new Set<string>();
  const candidates: Position[] = [];

  for (const stone of stones) {
    for (const neighbor of getNeighbors(stone, 2)) {
      const key = posKey(neighbor);
      if (board[neighbor.row][neighbor.col] || seen.has(key)) continue;
      seen.add(key);
      candidates.push(neighbor);
    }
  }

  return candidates;
}

export function getHumanStones(board: Board): Position[] {
  const result: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === "human") result.push({ row, col });
    }
  }
  return result;
}

export function getAiStones(board: Board): Position[] {
  const result: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === "ai") result.push({ row, col });
    }
  }
  return result;
}

export function getEmptyCells(
  board: Board,
  blocked: Set<string> = new Set()
): Position[] {
  const result: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const key = posKey({ row, col });
      if (!board[row][col] && !blocked.has(key)) {
        result.push({ row, col });
      }
    }
  }
  return result;
}
