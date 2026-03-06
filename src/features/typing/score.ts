import { SCORE_PENALTY_PER_MISS } from "@/lib/constants";

export function calculatePenalty(mistakeCount: number): number {
  return mistakeCount * SCORE_PENALTY_PER_MISS;
}

export function calculateScore(correctChars: number, mistakeCount: number): number {
  return correctChars - calculatePenalty(mistakeCount);
}
