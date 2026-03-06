import type { Category, Difficulty, DrillMode, SelectedProblem } from "@/types/problem";

export type GameMode = "timed" | "unlimited";

export interface SessionConfig {
  category: Category;
  difficulty: Difficulty;
  drillMode: DrillMode;
  gameMode: GameMode;
}

export interface SessionStats {
  correctChars: number;
  mistakeCount: number;
  penalty: number;
  score: number;
  elapsedSeconds: number;
  wpm: number;
  weakKeys: Array<{ key: string; count: number }>;
}

export interface SessionResult {
  config: SessionConfig;
  problem: SelectedProblem;
  stats: SessionStats;
  completedAt: string;
}
