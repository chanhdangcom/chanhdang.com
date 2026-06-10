import { AI_DIFFICULTY_CONFIG } from "../constants";
import {
  checkWin,
  getCandidateMoves,
  inBounds,
} from "./board";
import type { AiDifficulty, Board, Cell, Player, Position, WinLength } from "../types";

const DIRECTIONS: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

let searchNodes = 0;
let searchNodeLimit = 22_000;
let searchDeadline = Infinity;

export type FindMoveOptions = { fast?: boolean };

function beginSearch(limit: number, budgetMs: number) {
  searchNodes = 0;
  searchNodeLimit = limit;
  searchDeadline = performance.now() + budgetMs;
}

function searchExhausted(): boolean {
  return searchNodes >= searchNodeLimit || performance.now() >= searchDeadline;
}

function countLine(
  board: Board,
  pos: Position,
  player: Player,
  dr: number,
  dc: number
): { count: number; openEnds: number } {
  let count = 1;
  let openEnds = 0;

  for (const sign of [-1, 1]) {
    let r = pos.row + dr * sign;
    let c = pos.col + dc * sign;

    while (inBounds(r, c) && board[r][c] === player) {
      count++;
      r += dr * sign;
      c += dc * sign;
    }

    if (inBounds(r, c) && board[r][c] === null) {
      openEnds++;
    }
  }

  return { count, openEnds };
}

function evaluateLineScore(
  count: number,
  openEnds: number,
  winLength: WinLength
): number {
  if (openEnds === 0) return count >= winLength - 1 ? -800 : 0;
  if (count >= winLength) return 2_000_000;
  if (count === winLength - 1 && openEnds === 2) return 180_000;
  if (count === winLength - 1 && openEnds === 1) return 18_000;
  if (count === winLength - 2 && openEnds === 2) return 6_500;
  if (count === winLength - 2 && openEnds === 1) return 650;
  if (count === winLength - 3 && openEnds === 2) return 280;
  if (count === winLength - 3 && openEnds === 1) return 35;
  if (count === winLength - 4 && openEnds === 2) return 90;
  return 4;
}

export function scorePosition(
  board: Board,
  pos: Position,
  player: Player,
  winLength: WinLength,
  threatWeight = 1.15
): number {
  const prev = board[pos.row][pos.col];
  if (prev !== null) return -1;

  board[pos.row][pos.col] = player;

  if (checkWin(board, pos, player, winLength)) {
    board[pos.row][pos.col] = prev;
    return 8_000_000;
  }

  let score = 0;
  for (const [dr, dc] of DIRECTIONS) {
    const own = countLine(board, pos, player, dr, dc);
    score += evaluateLineScore(own.count, own.openEnds, winLength);
  }

  const opponent = player === "human" ? "ai" : "human";
  for (const [dr, dc] of DIRECTIONS) {
    const opp = countLine(board, pos, opponent, dr, dc);
    score += evaluateLineScore(opp.count, opp.openEnds, winLength) * threatWeight;
  }

  const center = 7;
  score += Math.max(0, 14 - Math.abs(pos.row - center) - Math.abs(pos.col - center));

  board[pos.row][pos.col] = prev;
  return score;
}

function evaluateBoard(
  board: Board,
  aiPlayer: Player,
  winLength: WinLength,
  blocked: Set<string>,
  threatWeight = 1.15
): number {
  const human = aiPlayer === "ai" ? "human" : "ai";
  const aiMoves = getTopMoves(board, aiPlayer, winLength, blocked, 12);
  const humanMoves = getTopMoves(board, human, winLength, blocked, 12);
  if (aiMoves.length === 0 && humanMoves.length === 0) return 0;

  let aiScore = 0;
  let humanScore = 0;

  for (const pos of aiMoves) {
    aiScore = Math.max(
      aiScore,
      scorePosition(board, pos, aiPlayer, winLength, threatWeight)
    );
  }
  for (const pos of humanMoves) {
    humanScore = Math.max(
      humanScore,
      scorePosition(board, pos, human, winLength, threatWeight)
    );
  }

  return aiScore - humanScore * (threatWeight + 0.05);
}

function getTopMoves(
  board: Board,
  player: Player,
  winLength: WinLength,
  blocked: Set<string>,
  topN: number,
  threatWeight = 1.15
): Position[] {
  const candidates = getCandidateMoves(board).filter(
    (p) => !board[p.row][p.col] && !blocked.has(`${p.row},${p.col}`)
  );

  if (candidates.length <= topN) return candidates;

  const top: { pos: Position; score: number }[] = [];
  for (const pos of candidates) {
    const score = scorePosition(board, pos, player, winLength, threatWeight);
    if (top.length < topN) {
      top.push({ pos, score });
      if (top.length === topN) top.sort((a, b) => b.score - a.score);
      continue;
    }
    if (score <= top[topN - 1].score) continue;
    top[topN - 1] = { pos, score };
    for (let i = topN - 1; i > 0 && top[i].score > top[i - 1].score; i--) {
      [top[i], top[i - 1]] = [top[i - 1], top[i]];
    }
  }
  top.sort((a, b) => b.score - a.score);
  return top.map((x) => x.pos);
}

function findImmediateWinCells(
  board: Board,
  player: Player,
  winLength: WinLength,
  blocked: Set<string>
): Position[] {
  const wins: Position[] = [];
  const candidates = getCandidateMoves(board).filter(
    (p) => !board[p.row][p.col] && !blocked.has(`${p.row},${p.col}`)
  );

  for (const pos of candidates) {
    const prev = board[pos.row][pos.col];
    board[pos.row][pos.col] = player;
    const win = checkWin(board, pos, player, winLength);
    board[pos.row][pos.col] = prev;
    if (win) wins.push(pos);
  }
  return wins;
}

function pickBestBlock(
  board: Board,
  threats: Position[],
  winLength: WinLength,
  blocked: Set<string>,
  threatWeight: number
): Position {
  let best = threats[0];
  let bestScore = -Infinity;
  for (const pos of threats) {
    const s = scorePosition(board, pos, "ai", winLength, threatWeight);
    if (s > bestScore) {
      bestScore = s;
      best = pos;
    }
  }
  return best;
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  aiPlayer: Player,
  winLength: WinLength,
  blocked: Set<string>,
  branchFactor: number,
  threatWeight: number
): number {
  if (++searchNodes > searchNodeLimit || performance.now() >= searchDeadline) {
    return evaluateBoard(board, aiPlayer, winLength, blocked, threatWeight);
  }

  const humanPlayer = aiPlayer === "ai" ? "human" : "ai";

  if (depth === 0) {
    return evaluateBoard(board, aiPlayer, winLength, blocked, threatWeight);
  }

  const current = maximizing ? aiPlayer : humanPlayer;
  const top = getTopMoves(
    board,
    current,
    winLength,
    blocked,
    branchFactor,
    threatWeight
  );

  if (top.length === 0) {
    return evaluateBoard(board, aiPlayer, winLength, blocked, threatWeight);
  }

  if (maximizing) {
    let maxEval = -Infinity;
    for (const pos of top) {
      const prev: Cell = board[pos.row][pos.col];
      board[pos.row][pos.col] = aiPlayer;
      if (checkWin(board, pos, aiPlayer, winLength)) {
        board[pos.row][pos.col] = prev;
        return 10_000_000;
      }
      const ev = minimax(
        board,
        depth - 1,
        alpha,
        beta,
        false,
        aiPlayer,
        winLength,
        blocked,
        branchFactor,
        threatWeight
      );
      board[pos.row][pos.col] = prev;
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const pos of top) {
    const prev: Cell = board[pos.row][pos.col];
    board[pos.row][pos.col] = humanPlayer;
    if (checkWin(board, pos, humanPlayer, winLength)) {
      board[pos.row][pos.col] = prev;
      return -10_000_000;
    }
    const ev = minimax(
      board,
      depth - 1,
      alpha,
      beta,
      true,
      aiPlayer,
      winLength,
      blocked,
      branchFactor,
      threatWeight
    );
    board[pos.row][pos.col] = prev;
    minEval = Math.min(minEval, ev);
    beta = Math.min(beta, ev);
    if (beta <= alpha) break;
  }
  return minEval;
}

export function findBestMove(
  board: Board,
  winLength: WinLength,
  blockedCells: string[] = [],
  aiPlayer: Player = "ai",
  difficulty: AiDifficulty = "normal",
  options: FindMoveOptions = {}
): Position {
  const config = AI_DIFFICULTY_CONFIG[difficulty];
  const fast = options.fast === true;
  const depth = fast ? Math.max(2, config.depth - 2) : config.depth;
  const nodeLimit = fast
    ? Math.floor(config.maxSearchNodes * 0.35)
    : config.maxSearchNodes;
  const budgetMs = fast
    ? Math.floor(config.searchBudgetMs * 0.4)
    : config.searchBudgetMs;
  beginSearch(nodeLimit, budgetMs);

  const blocked = new Set(blockedCells);
  const workBoard = board.map((row) => [...row]) as Board;
  const candidates = getCandidateMoves(workBoard).filter(
    (p) => !workBoard[p.row][p.col] && !blocked.has(`${p.row},${p.col}`)
  );

  if (candidates.length === 0) {
    return { row: 7, col: 7 };
  }

  const humanPlayer = "human";
  const tw = config.threatWeight;

  const aiWins = findImmediateWinCells(
    workBoard,
    aiPlayer,
    winLength,
    blocked
  );
  if (aiWins.length > 0) return aiWins[0];

  const humanThreats = findImmediateWinCells(
    workBoard,
    humanPlayer,
    winLength,
    blocked
  );
  if (humanThreats.length === 1) return humanThreats[0];
  if (humanThreats.length >= 2) {
    return pickBestBlock(workBoard, humanThreats, winLength, blocked, tw);
  }

  const rootBranch = Math.min(config.topMoves, 12);
  const searchBranch = Math.min(config.topMoves, config.searchBranch);
  const ranked = getTopMoves(
    workBoard,
    aiPlayer,
    winLength,
    blocked,
    rootBranch,
    tw
  ).map((pos) => ({
    pos,
    heuristic: scorePosition(workBoard, pos, aiPlayer, winLength, tw),
  }));
  ranked.sort((a, b) => b.heuristic - a.heuristic);

  if (depth <= 1 && Math.random() < config.noise) {
    const pick = ranked[Math.floor(Math.random() * ranked.length)] ?? ranked[0];
    return pick.pos;
  }

  let best = ranked[0]?.pos ?? candidates[0];
  let bestScore = -Infinity;
  const searchDepth = Math.max(depth - 1, 0);

  for (const { pos } of ranked) {
    if (searchExhausted() && bestScore > -Infinity) break;

    const prev = workBoard[pos.row][pos.col];
    workBoard[pos.row][pos.col] = aiPlayer;
    const score =
      searchDepth === 0
        ? scorePosition(workBoard, pos, aiPlayer, winLength, tw)
        : minimax(
            workBoard,
            searchDepth,
            -Infinity,
            Infinity,
            false,
            aiPlayer,
            winLength,
            blocked,
            searchBranch,
            tw
          );
    workBoard[pos.row][pos.col] = prev;

    if (score > bestScore) {
      bestScore = score;
      best = pos;
    }
  }

  if (config.noise > 0 && Math.random() < config.noise * 0.5) {
    const alt = ranked[Math.min(1, ranked.length - 1)];
    if (alt) return alt.pos;
  }

  return best;
}

/** Gợi ý / skill — tìm nhanh, không dùng full budget của AI. */
export function findThreatMove(
  board: Board,
  winLength: WinLength,
  blockedCells: string[],
  player: Player,
  difficulty: AiDifficulty = "hard"
): Position {
  return findBestMove(board, winLength, blockedCells, player, difficulty, {
    fast: true,
  });
}

export function rankMoves(
  board: Board,
  winLength: WinLength,
  player: Player,
  blockedCells: string[] = [],
  difficulty: AiDifficulty = "normal"
): Position[] {
  const blocked = new Set(blockedCells);
  const config = AI_DIFFICULTY_CONFIG[difficulty];
  return getTopMoves(
    board,
    player,
    winLength,
    blocked,
    config.topMoves,
    config.threatWeight
  );
}
