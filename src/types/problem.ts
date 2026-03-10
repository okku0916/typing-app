export type Category = "cpp" | "python" | "rust";

export type Difficulty = "level_1" | "level_2" | "level_3";

export type DrillMode = "random_syntax" | "algorithm";

export interface ProblemItem {
  id: string;
  title: string;
  code: string;
  difficulty?: Difficulty;
  mode: DrillMode;
}

export type ProblemsByMode = Record<DrillMode, ProblemItem[]>;

export type ProblemsJson = Record<Category, ProblemsByMode>;

export interface SelectedProblem extends ProblemItem {
  category: Category;
}
