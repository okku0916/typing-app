import type { Category, Difficulty, DrillMode } from "@/types/problem";
import type { GameMode } from "@/types/session";

export interface AppSettings {
  category: Category;
  difficulty: Difficulty;
  drillMode: DrillMode;
  gameMode: GameMode;
}

export const DEFAULT_SETTINGS: AppSettings = {
  category: "cpp",
  difficulty: "level_2",
  drillMode: "algorithm",
  gameMode: "timed",
};
