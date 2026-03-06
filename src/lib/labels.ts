import type { Category, Difficulty, DrillMode } from "@/types/problem";
import type { GameMode } from "@/types/session";

export const CATEGORY_LABELS: Record<Category, string> = {
  cpp: "C++",
  python: "Python",
  rust: "Rust",
  competitive_programming: "Competitive",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  cpp: "STL-heavy snippets and templates",
  python: "Readable scripts and algorithm blocks",
  rust: "Ownership-safe syntax and patterns",
  competitive_programming: "Contest-oriented mixed drills",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  level_1: "Level 1",
  level_2: "Level 2",
  level_3: "Level 3",
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  level_1: "One-liners and imports",
  level_2: "Core blocks and control flow",
  level_3: "Practical algorithm implementations",
};

export const DRILL_MODE_LABELS: Record<DrillMode, string> = {
  syntax: "Random Syntax",
  algorithm: "Algorithm",
};

export const DRILL_MODE_DESCRIPTIONS: Record<DrillMode, string> = {
  syntax: "Short snippets sampled randomly",
  algorithm: "Longer multi-line coding sequences",
};

export const GAME_MODE_LABELS: Record<GameMode, string> = {
  timed: "Normal",
  unlimited: "Unlimited",
};

export const GAME_MODE_DESCRIPTIONS: Record<GameMode, string> = {
  timed: "Difficulty-based timer and score attack",
  unlimited: "No time limit, accuracy-first practice",
};
