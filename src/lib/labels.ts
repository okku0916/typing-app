import type { Category, Difficulty, DrillMode } from "@/types/problem";
import type { GameMode } from "@/types/session";

export const CATEGORY_LABELS: Record<Category, string> = {
  cpp: "C++",
  python: "Python",
  rust: "Rust",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  cpp: "STLやテンプレートを使った実戦的な記法",
  python: "読みやすい構文とアルゴリズムの定番パターン",
  rust: "所有権を意識した構文と実装テンプレート",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  level_1: "Level 1（お手軽）",
  level_2: "Level 2（おすすめ）",
  level_3: "Level 3（高級）",
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  level_1: "ワンライナー・宣言・インポート中心",
  level_2: "for / if / 関数定義などの基本ブロック",
  level_3: "実用的なアルゴリズム実装",
};

export const DRILL_MODE_LABELS: Record<DrillMode, string> = {
  random_syntax: "ランダム構文",
  algorithm: "アルゴリズム",
};

export const DRILL_MODE_DESCRIPTIONS: Record<DrillMode, string> = {
  random_syntax: "短い構文・スニペットをランダム出題",
  algorithm: "複数行コードを連続入力",
};

export const GAME_MODE_LABELS: Record<GameMode, string> = {
  timed: "通常モード",
  unlimited: "無制限モード",
};

export const GAME_MODE_DESCRIPTIONS: Record<GameMode, string> = {
  timed: "制限時間内にできるだけ多く解くスコアアタック",
  unlimited: "時間制限なしで正確性を重視して練習",
};
