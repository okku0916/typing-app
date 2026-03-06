export type Category = "cpp" | "python" | "rust" | "competitive_programming";

export type Difficulty = "level_1" | "level_2" | "level_3";

export type DrillMode = "syntax" | "algorithm";

export interface ProblemItem {
  id: string;
  title: string;
  code: string;
  mode: DrillMode;
}

export type ProblemsByDifficulty = Record<Difficulty, ProblemItem[]>;

export type ProblemsJson = Record<Category, ProblemsByDifficulty>;

export interface SelectedProblem extends ProblemItem {
  category: Category;
  difficulty: Difficulty;
}
