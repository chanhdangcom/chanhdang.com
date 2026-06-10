import { maybeAiUseSkills } from "./ai-skills";
import { findBestMove } from "./ai";
import { beginHumanTurnWithDraw, drawForAiAtTurnStart } from "./turn-draw";
import {
  checkWin,
  cloneBoard,
  isBoardFull,
  placeStoneInPlace,
  posKey,
} from "./board";
import { TEXTS } from "../texts";
import type { GameState, Player, Position } from "../types";
function placeAiStones(s: GameState): GameState {
  const blocked = new Set(s.blockedCells);
  const board = cloneBoard(s.board);
  let history = [...s.moveHistory];
  let lastMove = s.lastMove;
  let extraLeft = s.aiExtraMovesRemaining;
  let stonesPlaced = 0;

  const placeOne = (): "ok" | "no_move" | "ai_win" => {
    let chosen = findBestMove(
      board,
      s.winLength,
      s.blockedCells,
      "ai",
      s.aiDifficulty,
      { fast: stonesPlaced > 0 }
    );
    stonesPlaced += 1;

    if (board[chosen.row][chosen.col] || blocked.has(posKey(chosen))) {
      let fallback: Position | null = null;
      outer: for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
          const key = `${r},${c}`;
          if (!board[r][c] && !blocked.has(key)) {
            fallback = { row: r, col: c };
            break outer;
          }
        }
      }
      if (!fallback) return "no_move";
      chosen = fallback;
    }

    placeStoneInPlace(board, chosen, "ai");
    history = [...history, { pos: chosen, player: "ai" as Player }];
    lastMove = chosen;

    if (checkWin(board, chosen, "ai", s.winLength)) return "ai_win";
    return "ok";
  };

  const first = placeOne();
  if (first === "no_move") {
    return {
      ...s,
      board,
      phase: "game_over",
      winner: "human",
      lastMove,
      moveHistory: history,
      message: "AI không còn nước đi!",
      aiExtraMovesRemaining: 0,
      drawAnimation: null,
      aiSkillFlash: null,
    };
  }
  if (first === "ai_win") {
    return {
      ...s,
      board,
      phase: "game_over",
      winner: "ai",
      message: TEXTS.aiWin,
      lastMove,
      moveHistory: history,
      aiExtraMovesRemaining: 0,
      drawAnimation: null,
      aiSkillFlash: null,
    };
  }

  while (extraLeft > 0) {
    extraLeft -= 1;
    const result = placeOne();
    if (result === "no_move") break;
    if (result === "ai_win") {
      return {
        ...s,
        board,
        phase: "game_over",
        winner: "ai",
        message: TEXTS.aiWin,
        lastMove,
        moveHistory: history,
        aiExtraMovesRemaining: 0,
        drawAnimation: null,
        aiSkillFlash: null,
      };
    }
  }

  if (isBoardFull(board)) {
    return {
      ...s,
      board,
      phase: "game_over",
      winner: "human",
      message: TEXTS.draw,
      drawAnimation: null,
      aiSkillFlash: null,
    };
  }

  return beginHumanTurnWithDraw({
    ...s,
    board,
    lastMove,
    moveHistory: history,
    blockedCells: [],
    aiExtraMovesRemaining: 0,
    turnCount: s.turnCount + 1,
    aiSkillFlash: null,
    scoutHighlight: null,
  });
}

/** Chạy toàn bộ lượt AI — gọi ngoài React setState để không block UI. */
export function executeAiTurn(snapshot: GameState): GameState {
  let s: GameState = { ...snapshot };
  s = drawForAiAtTurnStart(s);

  if (s.aiCursed) {
    s = { ...s, aiCursed: false };
  } else {
    const skillFx = maybeAiUseSkills(s);
    if (skillFx.used && skillFx.usedCard) {
      const { used: _, usedCard, ...rest } = skillFx;
      s = { ...s, ...rest };
      return {
        ...s,
        phase: "ai_skill_flash",
        aiSkillFlash: usedCard,
      };
    }
  }

  return placeAiStones(s);
}

export function executeAfterAiSkill(snapshot: GameState): GameState {
  return placeAiStones({ ...snapshot, phase: "ai_thinking" });
}
