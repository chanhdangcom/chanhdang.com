import { SKILL_META } from "../constants";
import type { SkillCard, SkillCardType } from "../types";

let cardCounter = 0;

export function resetCardCounter() {
  cardCounter = 0;
}

export function createSkillCard(type: SkillCardType): SkillCard {
  cardCounter += 1;
  return { id: `card-${cardCounter}`, type };
}

export function getSkillHint(type: SkillCardType): string {
  return SKILL_META[type].hint;
}

export function getSkillSuccess(type: SkillCardType): string {
  return SKILL_META[type].success;
}
