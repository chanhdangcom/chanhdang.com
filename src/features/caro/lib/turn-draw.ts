import { MAX_HAND_SIZE } from "../constants";
import { drawFromDeck } from "./deck";
import type { GameState } from "../types";

/** Rút 1 lá cho AI khi bắt đầu lượt AI (không animation). */
export function drawForAiAtTurnStart(s: GameState): GameState {
  if (s.aiHand.length >= MAX_HAND_SIZE) return s;
  const { card, deck } = drawFromDeck(s.deck);
  if (!card) return s;
  return { ...s, deck, aiHand: [...s.aiHand, card] };
}

/** Bắt đầu lượt người chơi — rút 1 lá (có animation nếu rút được). */
export function beginHumanTurnWithDraw(s: GameState): GameState {
  if (s.humanHand.length >= MAX_HAND_SIZE) {
    return {
      ...s,
      currentPlayer: "human",
      phase: "playing",
      drawAnimation: null,
      mulliganUsedThisTurn: false,
    };
  }
  const { card, deck } = drawFromDeck(s.deck);
  if (!card) {
    return {
      ...s,
      currentPlayer: "human",
      phase: "playing",
      drawAnimation: null,
      mulliganUsedThisTurn: false,
    };
  }
  return {
    ...s,
    currentPlayer: "human",
    deck,
    drawAnimation: { card, for: "human" },
    phase: "drawing_card",
    mulliganUsedThisTurn: false,
  };
}
