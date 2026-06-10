"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AI_DIFFICULTY_CONFIG,
  AI_SKILL_FLASH_MS,
  DEFAULT_WIN_LENGTH,
  MAX_HAND_SIZE,
  MULLIGAN_DISCARD_COUNT,
} from "../constants";
import { findThreatMove } from "../lib/ai";
import { executeAfterAiSkill, executeAiTurn } from "../lib/ai-turn";
import {
  checkWin,
  cloneBoard,
  createEmptyBoard,
  isBoardFull,
  placeStone,
  posKey,
  removeStone,
} from "../lib/board";
import { createShuffledDeck, drawFromDeck } from "../lib/deck";
import { beginHumanTurnWithDraw } from "../lib/turn-draw";
import {
  applyDomination,
  clearArea3x3,
  clearCross,
  crossKeys,
  formatPeekPreview,
  fortifyAllHuman,
  getNeighborsAdj,
  getScoutHighlight,
  moveStone,
  pickStrongestAiStone,
  swapStones,
} from "../lib/skill-logic";
import {
  getSkillHint,
  getSkillSuccess,
  resetCardCounter,
} from "../lib/skills";
import { TEXTS } from "../texts";
import type {
  AiDifficulty,
  GamePhase,
  GameState,
  Player,
  Position,
  SkillCard,
  WinLength,
} from "../types";

function createInitialState(
  winLength: WinLength = DEFAULT_WIN_LENGTH,
  aiDifficulty: AiDifficulty = "genius"
): GameState {
  resetCardCounter();
  const deck = createShuffledDeck();

  return beginHumanTurnWithDraw({
    board: createEmptyBoard(),
    blockedCells: [],
    shieldedCells: [],
    currentPlayer: "human",
    phase: "playing",
    activeSkill: null,
    humanHand: [],
    aiHand: [],
    winner: null,
    message: "",
    lastMove: null,
    moveHistory: [],
    extraMovesRemaining: 0,
    aiExtraMovesRemaining: 0,
    turnCount: 0,
    skillSource: null,
    winLength,
    aiDifficulty,
    deck,
    drawAnimation: null,
    aiSkillFlash: null,
    discardPicks: [],
    mulliganUsedThisTurn: false,
    scoutHighlight: null,
    aiCursed: false,
  });
}

export function useCaroGame() {
  const [state, setState] = useState<GameState>(() => createInitialState());
  const stateRef = useRef(state);
  const thinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skillTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiRunIdRef = useRef(0);

  stateRef.current = state;

  const runAiAsync = useCallback((snapshot: GameState, runId: number) => {
    const run = () => {
      if (aiRunIdRef.current !== runId) return;
      const next = executeAiTurn(snapshot);
      if (aiRunIdRef.current !== runId) return;
      setState(next);
    };

    setTimeout(run, 0);
  }, []);

  const runAfterSkillAsync = useCallback((snapshot: GameState, runId: number) => {
    const run = () => {
      if (aiRunIdRef.current !== runId) return;
      const next = executeAfterAiSkill(snapshot);
      if (aiRunIdRef.current !== runId) return;
      setState(next);
    };

    setTimeout(run, 0);
  }, []);

  useEffect(() => {
    if (state.phase !== "ai_thinking") return;

    const runId = ++aiRunIdRef.current;
    const turnAtSchedule = state.turnCount;
    const snapshot = state;
    const delay = AI_DIFFICULTY_CONFIG[state.aiDifficulty].thinkMs;

    thinkTimerRef.current = setTimeout(() => {
      if (
        stateRef.current.phase !== "ai_thinking" ||
        stateRef.current.turnCount !== turnAtSchedule
      ) {
        return;
      }
      runAiAsync(snapshot, runId);
    }, delay);

    return () => {
      if (thinkTimerRef.current) clearTimeout(thinkTimerRef.current);
    };
  }, [state.phase, state.turnCount, runAiAsync]);

  useEffect(() => {
    if (state.phase !== "ai_skill_flash") return;

    const runId = ++aiRunIdRef.current;
    const snapshot = state;

    skillTimerRef.current = setTimeout(() => {
      if (stateRef.current.phase !== "ai_skill_flash") return;
      runAfterSkillAsync(snapshot, runId);
    }, AI_SKILL_FLASH_MS);

    return () => {
      if (skillTimerRef.current) clearTimeout(skillTimerRef.current);
    };
  }, [state.phase, state.aiSkillFlash, runAfterSkillAsync]);

  const completeDrawAnimation = useCallback(() => {
    setState((s) => {
      if (!s.drawAnimation || s.drawAnimation.for !== "human") return s;
      return {
        ...s,
        humanHand: [...s.humanHand, s.drawAnimation.card],
        drawAnimation: null,
        phase: "playing",
      };
    });
  }, []);

  const finishMulligan = useCallback((s: GameState, picks: string[]): GameState => {
    const remaining = s.humanHand.filter((c) => !picks.includes(c.id));
    const { card, deck } = drawFromDeck(s.deck);
    if (!card) {
      return {
        ...s,
        humanHand: remaining,
        discardPicks: [],
        phase: "playing",
        mulliganUsedThisTurn: true,
        message: TEXTS.mulliganDone,
      };
    }
    return {
      ...s,
      humanHand: [...remaining, card],
      deck,
      discardPicks: [],
      phase: "playing",
      mulliganUsedThisTurn: true,
      message: TEXTS.mulliganDone,
    };
  }, []);

  const toggleDiscardPick = useCallback((card: SkillCard) => {
    setState((s) => {
      if (s.phase !== "select_discard") return s;
      const has = s.discardPicks.includes(card.id);
      let picks = has
        ? s.discardPicks.filter((id) => id !== card.id)
        : [...s.discardPicks, card.id];

      if (picks.length > MULLIGAN_DISCARD_COUNT) {
        picks = picks.slice(-MULLIGAN_DISCARD_COUNT);
      }

      if (picks.length === MULLIGAN_DISCARD_COUNT) {
        return finishMulligan(s, picks);
      }

      return {
        ...s,
        discardPicks: picks,
        message: TEXTS.mulliganPick(MULLIGAN_DISCARD_COUNT - picks.length),
      };
    });
  }, [finishMulligan]);

  const startMulligan = useCallback(() => {
    setState((s) => {
      if (
        s.phase !== "playing" ||
        s.currentPlayer !== "human" ||
        s.mulliganUsedThisTurn ||
        s.humanHand.length < MULLIGAN_DISCARD_COUNT
      ) {
        return s;
      }
      return {
        ...s,
        phase: "select_discard" as GamePhase,
        discardPicks: [],
        message: TEXTS.mulliganPick(MULLIGAN_DISCARD_COUNT),
      };
    });
  }, []);

  const cancelMulligan = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: "playing",
      discardPicks: [],
      message: "",
    }));
  }, []);

  const selectSkill = useCallback((card: SkillCard) => {
    setState((s) => {
      if (s.phase === "select_discard") return s;

      if (
        s.phase !== "playing" ||
        s.currentPlayer !== "human" ||
        s.winner
      ) {
        return s;
      }
      if (!s.humanHand.find((c) => c.id === card.id)) return s;

      const consume = (patch: Partial<GameState>): GameState => ({
        ...s,
        ...patch,
        humanHand: s.humanHand.filter((c) => c.id !== card.id),
        message: patch.message ?? getSkillSuccess(card.type),
      });

      if (card.type === "double_step") {
        return consume({
          extraMovesRemaining: 1,
          message: TEXTS.doubleStepMsg,
        });
      }

      if (card.type === "triple_step") {
        return consume({
          extraMovesRemaining: 2,
          message: TEXTS.tripleStepMsg,
        });
      }

      if (card.type === "scout") {
        const highlight = getScoutHighlight(s);
        return consume({
          scoutHighlight: highlight,
          message: TEXTS.scoutDone(highlight.row + 1, highlight.col + 1),
        });
      }

      if (card.type === "fortify") {
        return consume({
          shieldedCells: [
            ...new Set([...s.shieldedCells, ...fortifyAllHuman(s.board)]),
          ],
        });
      }

      if (card.type === "curse") {
        return consume({ aiCursed: true });
      }

      if (card.type === "spark") {
        return consume({
          extraMovesRemaining: 1,
          message: TEXTS.sparkMsg,
        });
      }

      if (card.type === "surge") {
        const blocked =
          s.blockedCells.length > 0 ? s.blockedCells.slice(1) : s.blockedCells;
        return consume({
          extraMovesRemaining: 1,
          blockedCells: blocked,
          message: TEXTS.surgeMsg,
        });
      }

      if (card.type === "mark") {
        const pos = findThreatMove(
          s.board,
          s.winLength,
          s.blockedCells,
          "human",
          "hard"
        );
        return consume({
          scoutHighlight: pos,
          message: TEXTS.markDone(pos.row + 1, pos.col + 1),
        });
      }

      if (card.type === "fog") {
        return consume({ scoutHighlight: null });
      }

      if (card.type === "chain") {
        const threat = findThreatMove(
          s.board,
          s.winLength,
          s.blockedCells,
          "human",
          "hard"
        );
        let blocked = [...s.blockedCells];
        if (blocked.length > 0) blocked = blocked.slice(1);
        const tKey = posKey(threat);
        if (!s.board[threat.row][threat.col] && !blocked.includes(tKey)) {
          blocked.push(tKey);
        }
        return consume({ blockedCells: blocked });
      }

      if (card.type === "peek") {
        const preview = formatPeekPreview(s.deck);
        return consume({
          message: preview
            ? TEXTS.peekDone(preview)
            : "Bộ bài sắp hết!",
        });
      }

      if (card.type === "decay") {
        return consume({ shieldedCells: [] });
      }

      if (card.type === "inspire") {
        if (s.humanHand.length >= MAX_HAND_SIZE) {
          return { ...s, message: TEXTS.handFull };
        }
        const handWithout = s.humanHand.filter((c) => c.id !== card.id);
        const { card: drawn, deck } = drawFromDeck(s.deck);
        return {
          ...s,
          humanHand: drawn ? [...handWithout, drawn] : handWithout,
          deck,
          message: getSkillSuccess(card.type),
        };
      }

      if (card.type === "sabotage") {
        if (s.aiHand.length === 0) {
          return { ...s, message: TEXTS.sabotageEmpty };
        }
        const idx = Math.floor(Math.random() * s.aiHand.length);
        return consume({
          aiHand: s.aiHand.filter((_, i) => i !== idx),
        });
      }

      if (card.type === "recall") {
        const lastHuman = [...s.moveHistory]
          .reverse()
          .find((m) => m.player === "human");
        if (!lastHuman) return { ...s, message: TEXTS.noRecallTarget };
        return consume({
          board: removeStone(s.board, lastHuman.pos),
          moveHistory: s.moveHistory.filter(
            (m) =>
              !(
                m.player === "human" &&
                m.pos.row === lastHuman.pos.row &&
                m.pos.col === lastHuman.pos.col
              )
          ),
          lastMove:
            s.lastMove?.row === lastHuman.pos.row &&
            s.lastMove?.col === lastHuman.pos.col
              ? null
              : s.lastMove,
        });
      }

      if (card.type === "oblivion") {
        const target = pickStrongestAiStone(s.board, s.winLength);
        if (!target && s.blockedCells.length === 0) {
          return { ...s, message: TEXTS.oblivionNoTarget };
        }
        let board = s.board;
        let history = s.moveHistory;
        let shields = s.shieldedCells;
        let lastMove = s.lastMove;
        if (target) {
          const tKey = posKey(target);
          board = removeStone(board, target);
          history = history.filter(
            (m) => !(m.pos.row === target.row && m.pos.col === target.col)
          );
          shields = shields.filter((k) => k !== tKey);
          if (lastMove?.row === target.row && lastMove?.col === target.col) {
            lastMove = null;
          }
        }
        return consume({
          board,
          blockedCells: [],
          moveHistory: history,
          shieldedCells: shields,
          lastMove,
        });
      }

      if (card.type === "undo") {
        const lastAi = [...s.moveHistory]
          .reverse()
          .find((m) => m.player === "ai");
        if (!lastAi) return { ...s, message: TEXTS.noUndoTarget };
        return consume({
          board: removeStone(s.board, lastAi.pos),
          moveHistory: s.moveHistory.filter(
            (m) =>
              !(
                m.player === "ai" &&
                m.pos.row === lastAi.pos.row &&
                m.pos.col === lastAi.pos.col
              )
          ),
          lastMove:
            s.lastMove?.row === lastAi.pos.row &&
            s.lastMove?.col === lastAi.pos.col
              ? null
              : s.lastMove,
        });
      }

      return {
        ...s,
        activeSkill: card,
        skillSource: null,
        phase: "select_skill_target" as GamePhase,
        message: getSkillHint(card.type),
      };
    });
  }, []);

  const handleCellClick = useCallback((pos: Position) => {
    setState((s) => {
      if (s.winner || s.phase === "drawing_card" || s.phase === "select_discard")
        return s;

      if (s.phase === "select_skill_target" && s.activeSkill) {
        return applySkillAt(s, pos);
      }

      if (s.currentPlayer !== "human") return s;
      if (s.phase !== "playing" && s.phase !== "extra_move") return s;

      const key = posKey(pos);
      if (s.board[pos.row][pos.col]) return s;
      if (s.blockedCells.includes(key)) {
        return { ...s, message: TEXTS.sealedCell };
      }

      const nextBoard = placeStone(s.board, pos, "human");
      const history = [...s.moveHistory, { pos, player: "human" as Player }];

      if (checkWin(nextBoard, pos, "human", s.winLength)) {
        return {
          ...s,
          board: nextBoard,
          phase: "game_over",
          winner: "human",
          lastMove: pos,
          moveHistory: history,
          extraMovesRemaining: 0,
          drawAnimation: null,
          message: TEXTS.youWin,
        };
      }

      if (s.extraMovesRemaining > 0) {
        return {
          ...s,
          board: nextBoard,
          phase: "extra_move",
          lastMove: pos,
          moveHistory: history,
          extraMovesRemaining: s.extraMovesRemaining - 1,
          message:
            s.extraMovesRemaining > 1
              ? TEXTS.extraMoveMsgMulti(s.extraMovesRemaining - 1)
              : TEXTS.extraMoveMsg,
        };
      }

      if (s.phase === "extra_move") {
        if (isBoardFull(nextBoard)) {
          return {
            ...s,
            board: nextBoard,
            phase: "game_over",
            winner: "human",
            lastMove: pos,
            moveHistory: history,
            message: TEXTS.draw,
            drawAnimation: null,
          };
        }
        return {
          ...s,
          board: nextBoard,
          currentPlayer: "ai",
          phase: "ai_thinking",
          lastMove: pos,
          moveHistory: history,
          turnCount: s.turnCount + 1,
          message: "",
          scoutHighlight: null,
        };
      }

      if (isBoardFull(nextBoard)) {
        return {
          ...s,
          board: nextBoard,
          phase: "game_over",
          winner: "human",
          lastMove: pos,
          moveHistory: history,
          message: TEXTS.draw,
          drawAnimation: null,
        };
      }

      return {
        ...s,
        board: nextBoard,
        currentPlayer: "ai",
        phase: "ai_thinking",
        lastMove: pos,
        moveHistory: history,
        turnCount: s.turnCount + 1,
        message: "",
        scoutHighlight: null,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    aiRunIdRef.current += 1;
    if (thinkTimerRef.current) clearTimeout(thinkTimerRef.current);
    if (skillTimerRef.current) clearTimeout(skillTimerRef.current);
    setState((s) => createInitialState(s.winLength, s.aiDifficulty));
  }, []);

  const setWinLength = useCallback((winLength: WinLength) => {
    setState((s) => {
      if (s.moveHistory.length > 0) return s;
      return createInitialState(winLength, s.aiDifficulty);
    });
  }, []);

  const setAiDifficulty = useCallback((aiDifficulty: AiDifficulty) => {
    setState((s) => {
      if (s.moveHistory.length > 0) return s;
      return createInitialState(s.winLength, aiDifficulty);
    });
  }, []);

  const cancelSkill = useCallback(() => {
    setState((s) => ({
      ...s,
      activeSkill: null,
      skillSource: null,
      phase: "playing",
      message: "",
    }));
  }, []);

  return {
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
    canChangeRules: state.moveHistory.length === 0,
  };
}

function applySkillAt(s: GameState, pos: Position): GameState {
  const card = s.activeSkill;
  if (!card) return s;

  const key = posKey(pos);
  const cell = s.board[pos.row][pos.col];
  const consumeCard = (next: Partial<GameState>): GameState => ({
    ...s,
    ...next,
    humanHand: s.humanHand.filter((c) => c.id !== card.id),
    activeSkill: null,
    skillSource: null,
    phase: "playing",
    message: next.message ?? getSkillSuccess(card.type),
  });

  switch (card.type) {
    case "remove": {
      if (cell !== "ai") return s;
      if (s.shieldedCells.includes(key)) {
        return { ...s, message: TEXTS.shieldProtected };
      }
      return consumeCard({
        board: removeStone(s.board, pos),
        moveHistory: s.moveHistory.filter(
          (m) => !(m.pos.row === pos.row && m.pos.col === pos.col)
        ),
      });
    }
    case "snipe": {
      if (cell !== "ai") return s;
      return consumeCard({
        board: removeStone(s.board, pos),
        shieldedCells: s.shieldedCells.filter((k) => k !== key),
        moveHistory: s.moveHistory.filter(
          (m) => !(m.pos.row === pos.row && m.pos.col === pos.col)
        ),
      });
    }
    case "domination": {
      if (cell !== "ai") return s;
      return consumeCard({ board: applyDomination(s.board, pos) });
    }
    case "block": {
      if (cell) return s;
      return consumeCard({ blockedCells: [...s.blockedCells, key] });
    }
    case "barrier": {
      if (!s.skillSource) {
        if (cell) return s;
        return {
          ...s,
          skillSource: pos,
          message: TEXTS.barrierSecond,
        };
      }
      if (cell) return s;
      const adj = getNeighborsAdj(s.skillSource).some(
        (p) => p.row === pos.row && p.col === pos.col
      );
      if (!adj) return { ...s, message: TEXTS.barrierAdjacent };
      return consumeCard({
        blockedCells: [
          ...s.blockedCells,
          posKey(s.skillSource),
          key,
        ],
      });
    }
    case "shield": {
      if (cell !== "human") return s;
      if (s.shieldedCells.includes(key)) return s;
      return consumeCard({ shieldedCells: [...s.shieldedCells, key] });
    }
    case "apocalypse": {
      const nextBoard = clearArea3x3(s.board, pos);
      const clearedKeys = new Set<string>();
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          clearedKeys.add(
            posKey({ row: pos.row + dr, col: pos.col + dc })
          );
        }
      }
      return consumeCard({
        board: nextBoard,
        moveHistory: s.moveHistory.filter(
          (m) => !clearedKeys.has(posKey(m.pos))
        ),
        shieldedCells: s.shieldedCells.filter((k) => !clearedKeys.has(k)),
      });
    }
    case "swap": {
      if (!s.skillSource) {
        if (cell !== "human") return s;
        return {
          ...s,
          skillSource: pos,
          message: TEXTS.swapDest,
        };
      }
      if (cell) return s;
      const next = cloneBoard(s.board);
      next[pos.row][pos.col] = "human";
      next[s.skillSource.row][s.skillSource.col] = null;
      return consumeCard({ board: next });
    }
    case "unseal": {
      if (!s.blockedCells.includes(key)) {
        return { ...s, message: TEXTS.unsealInvalid };
      }
      return consumeCard({
        blockedCells: s.blockedCells.filter((k) => k !== key),
      });
    }
    case "mend": {
      if (cell !== "human" || !s.shieldedCells.includes(key)) {
        return { ...s, message: TEXTS.mendNoShield };
      }
      return consumeCard({
        shieldedCells: s.shieldedCells.filter((k) => k !== key),
      });
    }
    case "rust": {
      if (cell !== "ai" || !s.shieldedCells.includes(key)) {
        return { ...s, message: TEXTS.rustNoShield };
      }
      return consumeCard({
        shieldedCells: s.shieldedCells.filter((k) => k !== key),
      });
    }
    case "blink": {
      if (!s.skillSource) {
        if (cell !== "human") return s;
        return {
          ...s,
          skillSource: pos,
          message: TEXTS.blinkSecond,
        };
      }
      if (cell !== "human") return s;
      if (pos.row === s.skillSource.row && pos.col === s.skillSource.col) {
        return s;
      }
      return consumeCard({
        board: swapStones(s.board, s.skillSource, pos),
      });
    }
    case "grapple": {
      if (!s.skillSource) {
        if (cell !== "ai") return s;
        return {
          ...s,
          skillSource: pos,
          message: TEXTS.grappleDest,
        };
      }
      if (cell) return s;
      const adj = getNeighborsAdj(s.skillSource).some(
        (p) => p.row === pos.row && p.col === pos.col
      );
      if (!adj) return { ...s, message: TEXTS.barrierAdjacent };
      return consumeCard({
        board: moveStone(s.board, s.skillSource, pos, "ai"),
        moveHistory: s.moveHistory.map((m) =>
          m.pos.row === s.skillSource!.row &&
          m.pos.col === s.skillSource!.col &&
          m.player === "ai"
            ? { ...m, pos }
            : m
        ),
      });
    }
    case "quake": {
      const cleared = crossKeys(pos);
      return consumeCard({
        board: clearCross(s.board, pos),
        moveHistory: s.moveHistory.filter(
          (m) => !cleared.has(posKey(m.pos))
        ),
        shieldedCells: s.shieldedCells.filter((k) => !cleared.has(k)),
      });
    }
    default:
      return s;
  }
}
