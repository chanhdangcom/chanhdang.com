export type MusicPlan = "premium" | "creator";

export const MUSIC_PLAN_CONFIG = {
  premium: {
    id: "premium",
    name: "Premium",
    amount: 29_000,
    amountLabel: "29.000",
    orderCode: "PREM",
    orderLabel: "Music Premium",
  },
  creator: {
    id: "creator",
    name: "Premium Creator",
    amount: 49_000,
    amountLabel: "49.000",
    orderCode: "CREATOR",
    orderLabel: "Music Premium Creator",
  },
} as const satisfies Record<
  MusicPlan,
  {
    id: MusicPlan;
    name: string;
    amount: number;
    amountLabel: string;
    orderCode: string;
    orderLabel: string;
  }
>;

export function resolveMusicPlan(value: unknown): MusicPlan {
  return value === "creator" ? "creator" : "premium";
}

export function getMusicPlanConfig(plan: unknown) {
  return MUSIC_PLAN_CONFIG[resolveMusicPlan(plan)];
}
