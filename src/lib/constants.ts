import type { Difficulty } from "@/types/problem";

export const TIME_LIMITS: Record<Difficulty, number> = {
  level_1: 60,
  level_2: 120,
  level_3: 180,
};

export const SCORE_PENALTY_PER_MISS = 1;

export const STORAGE_KEYS = {
  settings: "typing-app/settings",
  latestResult: "typing-app/latest-result",
} as const;
