import { SKILL_META, ALL_SKILL_TYPES } from "../constants";
import { createSkillCard } from "./skills";
import type { SkillCard, SkillCardType } from "../types";

export function createShuffledDeck(): SkillCardType[] {
  const pool: SkillCardType[] = [];
  for (const type of ALL_SKILL_TYPES) {
    const copies = SKILL_META[type].deckCopies;
    for (let i = 0; i < copies; i++) pool.push(type);
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

export function getDeckPoolStats() {
  const total = ALL_SKILL_TYPES.reduce(
    (sum, t) => sum + SKILL_META[t].deckCopies,
    0
  );
  return ALL_SKILL_TYPES.map((type) => ({
    type,
    copies: SKILL_META[type].deckCopies,
    rate: ((SKILL_META[type].deckCopies / total) * 100).toFixed(1),
  }));
}

export function drawFromDeck(deck: SkillCardType[]): {
  card: SkillCard | null;
  deck: SkillCardType[];
} {
  if (deck.length === 0) {
    return { card: null, deck: createShuffledDeck() };
  }
  const [type, ...rest] = deck;
  return { card: createSkillCard(type), deck: rest };
}
