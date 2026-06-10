import { AI_DIFFICULTY_CONFIG, MAX_HAND_SIZE, SKILL_META } from "../constants";
import { drawFromDeck } from "./deck";
import {
  cloneBoard,
  getAiStones,
  getEmptyCells,
  getHumanStones,
  posKey,
  removeStone,
} from "./board";
import { findThreatMove, scorePosition } from "./ai";
import {
  applyDomination,
  clearArea3x3,
  clearCross,
  crossKeys,
  getNeighborsAdj,
  moveStone,
  swapStones,
} from "./skill-logic";
import { getSkillSuccess } from "./skills";
import type { AiDifficulty, GameState, Position, SkillCard, SkillCardType } from "../types";

type SkillResult = Partial<GameState> & {
  used: boolean;
  usedCard?: SkillCard;
};

const AI_SKILL_PRIORITY: Partial<Record<SkillCardType, number>> = {
  snipe: 100,
  triple_step: 98,
  apocalypse: 96,
  oblivion: 94,
  domination: 92,
  surge: 90,
  double_step: 88,
  spark: 86,
  remove: 84,
  quake: 82,
  sabotage: 80,
  chain: 78,
  block: 76,
  curse: 74,
  decay: 72,
  rust: 70,
  grapple: 68,
  recall: 66,
  scout: 64,
  mark: 62,
  shield: 60,
  barrier: 58,
  inspire: 56,
  undo: 54,
  fortify: 52,
};

const RARITY_VALUE = {
  legendary: 4,
  epic: 3,
  rare: 2,
  common: 1,
} as const;

function orderAiHand(hand: SkillCard[], difficulty: AiDifficulty): SkillCard[] {
  const smart =
    difficulty === "normal" ||
    difficulty === "hard" ||
    difficulty === "master" ||
    difficulty === "genius";
  if (!smart) {
    return [...hand].sort(() => Math.random() - 0.5);
  }
  return [...hand].sort((a, b) => {
    const pa = AI_SKILL_PRIORITY[a.type] ?? 40;
    const pb = AI_SKILL_PRIORITY[b.type] ?? 40;
    if (pb !== pa) return pb - pa;
    return Math.random() - 0.5;
  });
}

export function maybeAiUseSkills(state: GameState): SkillResult {
  if (state.aiHand.length === 0 || state.aiCursed) {
    return state.aiCursed ? { used: false, aiCursed: false } : { used: false };
  }

  const config = AI_DIFFICULTY_CONFIG[state.aiDifficulty];
  let current = state;
  let usedAny = false;
  let lastCard: SkillCard | undefined;
  let lastMessage = "";

  for (let attempt = 0; attempt < config.maxSkillsPerTurn; attempt++) {
    if (current.aiHand.length === 0) break;
    if (Math.random() > config.skillChance) break;

    const shuffled = orderAiHand(current.aiHand, state.aiDifficulty);
    let applied = false;

    for (const card of shuffled) {
      const result = applyAiSkill(current, card);
      if (result.used) {
        const { used: _, usedCard, ...rest } = result;
        current = { ...current, ...rest };
        usedAny = true;
        lastCard = usedCard;
        lastMessage = rest.message ?? "";
        applied = true;
        break;
      }
    }

    if (!applied) break;
  }

  if (!usedAny) return { used: false };

  return {
    used: true,
    usedCard: lastCard,
    ...current,
    message: lastMessage || (lastCard ? getSkillSuccess(lastCard.type) : ""),
  };
}

function applyAiSkill(state: GameState, card: SkillCard): SkillResult {
  const blocked = new Set(state.blockedCells);

  switch (card.type) {
    case "double_step":
    case "spark":
    case "surge":
      return useCard(state, card, {
        aiExtraMovesRemaining: 1,
        blockedCells:
          card.type === "surge" && state.blockedCells.length > 0
            ? state.blockedCells.slice(1)
            : state.blockedCells,
        message: `${SKILL_META[card.type].icon} AI dùng ${SKILL_META[card.type].name}!`,
      });

    case "triple_step":
      return useCard(state, card, {
        aiExtraMovesRemaining: 2,
        message: `${SKILL_META.triple_step.icon} AI dùng ${SKILL_META.triple_step.name}!`,
      });

    case "undo": {
      const lastHuman = [...state.moveHistory]
        .reverse()
        .find((m) => m.player === "human");
      if (!lastHuman) return { used: false };
      return useCard(state, card, {
        board: removeStone(state.board, lastHuman.pos),
        moveHistory: state.moveHistory.filter(
          (m) =>
            !(
              m.player === "human" &&
              m.pos.row === lastHuman.pos.row &&
              m.pos.col === lastHuman.pos.col
            )
        ),
        message: `${SKILL_META.undo.icon} AI dùng ${SKILL_META.undo.name}!`,
      });
    }

    case "remove": {
      const targets = getHumanStones(state.board).filter(
        (p) => !state.shieldedCells.includes(posKey(p))
      );
      if (targets.length === 0) return { used: false };
      const best = pickBestHumanToRemove(state, targets);
      return useCard(state, card, {
        board: removeStone(state.board, best),
        moveHistory: state.moveHistory.filter(
          (m) => !(m.pos.row === best.row && m.pos.col === best.col)
        ),
        message: `${SKILL_META.remove.icon} AI dùng ${SKILL_META.remove.name}!`,
      });
    }

    case "snipe": {
      const targets = getHumanStones(state.board);
      if (targets.length === 0) return { used: false };
      const best = pickBestHumanToRemove(state, targets);
      return useCard(state, card, {
        board: removeStone(state.board, best),
        shieldedCells: state.shieldedCells.filter((k) => k !== posKey(best)),
        moveHistory: state.moveHistory.filter(
          (m) => !(m.pos.row === best.row && m.pos.col === best.col)
        ),
        message: `${SKILL_META.snipe.icon} AI dùng ${SKILL_META.snipe.name}!`,
      });
    }

    case "domination": {
      const targets = getHumanStones(state.board);
      if (targets.length === 0) return { used: false };
      const best = pickBestHumanToRemove(state, targets);
      return useCard(state, card, {
        board: applyDomination(state.board, best),
        message: `${SKILL_META.domination.icon} AI dùng ${SKILL_META.domination.name}!`,
      });
    }

    case "block": {
      const humanThreat = findThreatMove(
        state.board,
        state.winLength,
        state.blockedCells,
        "human",
        state.aiDifficulty
      );
      if (state.board[humanThreat.row][humanThreat.col]) return { used: false };
      return useCard(state, card, {
        blockedCells: [...state.blockedCells, posKey(humanThreat)],
        message: `${SKILL_META.block.icon} AI dùng ${SKILL_META.block.name}!`,
      });
    }

    case "barrier": {
      const humanThreat = findThreatMove(
        state.board,
        state.winLength,
        state.blockedCells,
        "human",
        state.aiDifficulty
      );
      if (state.board[humanThreat.row][humanThreat.col]) return { used: false };
      const neighbors = getNeighborsAdj(humanThreat).filter(
        (p) => !state.board[p.row][p.col] && !blocked.has(posKey(p))
      );
      if (neighbors.length === 0) return { used: false };
      const second = neighbors.sort(
        (a, b) => scoreAt(state, b, "human") - scoreAt(state, a, "human")
      )[0];
      return useCard(state, card, {
        blockedCells: [
          ...state.blockedCells,
          posKey(humanThreat),
          posKey(second),
        ],
        message: `${SKILL_META.barrier.icon} AI dùng ${SKILL_META.barrier.name}!`,
      });
    }

    case "shield": {
      const stones = getAiStones(state.board);
      if (stones.length === 0) return { used: false };
      const best = stones.sort(
        (a, b) => scoreAt(state, b, "ai") - scoreAt(state, a, "ai")
      )[0];
      const key = posKey(best);
      if (state.shieldedCells.includes(key)) return { used: false };
      return useCard(state, card, {
        shieldedCells: [...state.shieldedCells, key],
        message: `${SKILL_META.shield.icon} AI dùng ${SKILL_META.shield.name}!`,
      });
    }

    case "fortify": {
      const stones = getAiStones(state.board);
      if (stones.length === 0) return { used: false };
      const keys = stones.map(posKey);
      const merged = [...new Set([...state.shieldedCells, ...keys])];
      return useCard(state, card, {
        shieldedCells: merged,
        message: `${SKILL_META.fortify.icon} AI dùng ${SKILL_META.fortify.name}!`,
      });
    }

    case "curse":
      return useCard(state, card, {
        message: `${SKILL_META.curse.icon} AI dùng ${SKILL_META.curse.name}!`,
      });

    case "mark": {
      const threat = findThreatMove(
        state.board,
        state.winLength,
        state.blockedCells,
        "ai",
        state.aiDifficulty
      );
      return useCard(state, card, {
        scoutHighlight: threat,
        message: `${SKILL_META.mark.icon} AI dùng ${SKILL_META.mark.name}!`,
      });
    }

    case "fog":
      return useCard(state, card, {
        scoutHighlight: null,
        message: `${SKILL_META.fog.icon} AI dùng ${SKILL_META.fog.name}!`,
      });

    case "chain": {
      const humanThreat = findThreatMove(
        state.board,
        state.winLength,
        state.blockedCells,
        "human",
        state.aiDifficulty
      );
      let blocked = [...state.blockedCells];
      if (blocked.length > 0) blocked = blocked.slice(1);
      const tKey = posKey(humanThreat);
      if (!state.board[humanThreat.row][humanThreat.col] && !blocked.includes(tKey)) {
        blocked.push(tKey);
      }
      return useCard(state, card, {
        blockedCells: blocked,
        message: `${SKILL_META.chain.icon} AI dùng ${SKILL_META.chain.name}!`,
      });
    }

    case "decay":
      return useCard(state, card, {
        shieldedCells: [],
        message: `${SKILL_META.decay.icon} AI dùng ${SKILL_META.decay.name}!`,
      });

    case "sabotage": {
      if (state.humanHand.length === 0) return { used: false };
      const victim = pickWorstHumanCard(state.humanHand);
      return useCard(state, card, {
        humanHand: state.humanHand.filter((c) => c.id !== victim.id),
        message: `${SKILL_META.sabotage.icon} AI dùng ${SKILL_META.sabotage.name}!`,
      });
    }

    case "recall": {
      const lastHuman = [...state.moveHistory]
        .reverse()
        .find((m) => m.player === "human");
      if (!lastHuman) return { used: false };
      return useCard(state, card, {
        board: removeStone(state.board, lastHuman.pos),
        moveHistory: state.moveHistory.filter(
          (m) =>
            !(
              m.player === "human" &&
              m.pos.row === lastHuman.pos.row &&
              m.pos.col === lastHuman.pos.col
            )
        ),
        message: `${SKILL_META.recall.icon} AI dùng ${SKILL_META.recall.name}!`,
      });
    }

    case "oblivion": {
      const humans = getHumanStones(state.board);
      const target =
        humans.length > 0 ? pickBestHumanToRemove(state, humans) : null;
      if (!target && state.blockedCells.length === 0) return { used: false };
      let board = state.board;
      let history = state.moveHistory;
      let shields = state.shieldedCells;
      if (target) {
        board = removeStone(board, target);
        history = history.filter(
          (m) => !(m.pos.row === target.row && m.pos.col === target.col)
        );
        shields = shields.filter((k) => k !== posKey(target));
      }
      return useCard(state, card, {
        board,
        blockedCells: [],
        moveHistory: history,
        shieldedCells: shields,
        message: `${SKILL_META.oblivion.icon} AI dùng ${SKILL_META.oblivion.name}!`,
      });
    }

    case "unseal": {
      if (state.blockedCells.length === 0) return { used: false };
      const key = state.blockedCells[state.blockedCells.length - 1];
      return useCard(state, card, {
        blockedCells: state.blockedCells.filter((k) => k !== key),
        message: `${SKILL_META.unseal.icon} AI dùng ${SKILL_META.unseal.name}!`,
      });
    }

    case "rust": {
      const targets = getHumanStones(state.board).filter((p) =>
        state.shieldedCells.includes(posKey(p))
      );
      if (targets.length === 0) return { used: false };
      const best = pickBestHumanToRemove(state, targets);
      return useCard(state, card, {
        shieldedCells: state.shieldedCells.filter((k) => k !== posKey(best)),
        message: `${SKILL_META.rust.icon} AI dùng ${SKILL_META.rust.name}!`,
      });
    }

    case "grapple": {
      const humans = getHumanStones(state.board);
      const empties = getEmptyCells(state.board, blocked);
      if (humans.length === 0 || empties.length === 0) return { used: false };
      const from = pickBestHumanToRemove(state, humans);
      const neighbors = getNeighborsAdj(from).filter(
        (p) => !state.board[p.row][p.col] && !blocked.has(posKey(p))
      );
      if (neighbors.length === 0) return { used: false };
      const to = neighbors.sort(
        (a, b) => scoreAt(state, b, "human") - scoreAt(state, a, "human")
      )[0];
      return useCard(state, card, {
        board: moveStone(state.board, from, to, "human"),
        message: `${SKILL_META.grapple.icon} AI dùng ${SKILL_META.grapple.name}!`,
      });
    }

    case "quake": {
      const humans = getHumanStones(state.board);
      if (humans.length === 0) return { used: false };
      const center = pickBestHumanToRemove(state, humans);
      const cleared = crossKeys(center);
      return useCard(state, card, {
        board: clearCross(state.board, center),
        moveHistory: state.moveHistory.filter(
          (m) => !cleared.has(posKey(m.pos))
        ),
        shieldedCells: state.shieldedCells.filter((k) => !cleared.has(k)),
        message: `${SKILL_META.quake.icon} AI dùng ${SKILL_META.quake.name}!`,
      });
    }

    case "blink": {
      const humans = getHumanStones(state.board);
      if (humans.length < 2) return { used: false };
      const sorted = humans.sort(
        (a, b) => scoreAt(state, b, "human") - scoreAt(state, a, "human")
      );
      return useCard(state, card, {
        board: swapStones(state.board, sorted[0], sorted[1]),
        message: `${SKILL_META.blink.icon} AI dùng ${SKILL_META.blink.name}!`,
      });
    }

    case "inspire": {
      if (state.aiHand.length >= MAX_HAND_SIZE) return { used: false };
      const { card: drawn, deck } = drawFromDeck(state.deck);
      if (!drawn) return { used: false };
      return {
        used: true,
        usedCard: card,
        deck,
        aiHand: [...state.aiHand.filter((c) => c.id !== card.id), drawn],
        message: `${SKILL_META.inspire.icon} AI dùng ${SKILL_META.inspire.name}!`,
      };
    }

    case "apocalypse": {
      const humans = getHumanStones(state.board);
      if (humans.length === 0) return { used: false };
      const center = humans.sort(
        (a, b) => scoreAt(state, b, "human") - scoreAt(state, a, "human")
      )[0];
      const nextBoard = clearArea3x3(state.board, center);
      const clearedKeys = new Set<string>();
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          clearedKeys.add(posKey({ row: center.row + dr, col: center.col + dc }));
        }
      }
      return useCard(state, card, {
        board: nextBoard,
        moveHistory: state.moveHistory.filter(
          (m) => !clearedKeys.has(posKey(m.pos))
        ),
        shieldedCells: state.shieldedCells.filter((k) => !clearedKeys.has(k)),
        message: `${SKILL_META.apocalypse.icon} AI dùng ${SKILL_META.apocalypse.name}!`,
      });
    }

    case "swap": {
      const stones = getAiStones(state.board);
      const empties = getEmptyCells(state.board, blocked);
      if (stones.length === 0 || empties.length === 0) return { used: false };

      let bestFrom = stones[0];
      let bestTo = empties[0];
      let bestGain = -Infinity;

      for (const from of stones.slice(0, 5)) {
        for (const to of empties.slice(0, 8)) {
          const next = cloneBoard(state.board);
          next[from.row][from.col] = null;
          next[to.row][to.col] = "ai";
          const gain = scorePosition(
            next,
            to,
            "ai",
            state.winLength
          );
          if (gain > bestGain) {
            bestGain = gain;
            bestFrom = from;
            bestTo = to;
          }
        }
      }

      const next = cloneBoard(state.board);
      next[bestFrom.row][bestFrom.col] = null;
      next[bestTo.row][bestTo.col] = "ai";
      return useCard(state, card, {
        board: next,
        message: `${SKILL_META.swap.icon} AI dùng ${SKILL_META.swap.name}!`,
      });
    }

    default:
      return { used: false };
  }
}

function useCard(
  state: GameState,
  card: SkillCard,
  effect: Partial<GameState>
): SkillResult {
  return {
    used: true,
    usedCard: card,
    ...effect,
    aiHand: state.aiHand.filter((c) => c.id !== card.id),
    message: effect.message ?? getSkillSuccess(card.type),
  };
}

function pickBestHumanToRemove(state: GameState, targets: Position[]): Position {
  return targets.sort(
    (a, b) => scoreAt(state, b, "human") - scoreAt(state, a, "human")
  )[0];
}

function scoreAt(
  state: GameState,
  pos: Position,
  player: "human" | "ai"
): number {
  const tw = AI_DIFFICULTY_CONFIG[state.aiDifficulty].threatWeight;
  return scorePosition(state.board, pos, player, state.winLength, tw);
}

function pickWorstHumanCard(hand: SkillCard[]): SkillCard {
  return [...hand].sort((a, b) => {
    const ra = RARITY_VALUE[SKILL_META[a.type].rarity];
    const rb = RARITY_VALUE[SKILL_META[b.type].rarity];
    if (rb !== ra) return rb - ra;
    const pa = AI_SKILL_PRIORITY[a.type] ?? 40;
    const pb = AI_SKILL_PRIORITY[b.type] ?? 40;
    return pb - pa;
  })[0];
}
