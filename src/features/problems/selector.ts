import { problemsData } from "@/features/problems/loader";
import type { Category, Difficulty, DrillMode, ProblemItem, SelectedProblem } from "@/types/problem";

function pickByIndex<T>(values: T[], cursor: number): T {
  const safeCursor = Math.abs(cursor) % values.length;
  return values[safeCursor];
}

function applyDifficultyFilter(pool: ProblemItem[], difficulty: Difficulty): ProblemItem[] {
  if (difficulty === "level_1") {
    return pool.filter((problem) => problem.code.split("\n").length <= 4);
  }

  if (difficulty === "level_2") {
    return pool.filter((problem) => {
      const lines = problem.code.split("\n").length;
      return lines >= 3 && lines <= 12;
    });
  }

  return pool;
}

export function getProblemPool(params: {
  category: Category;
  difficulty: Difficulty;
  drillMode: DrillMode;
}) {
  const { category, difficulty, drillMode } = params;
  const modePool = problemsData[category][drillMode];
  const filtered = applyDifficultyFilter(modePool, difficulty);

  if (filtered.length > 0) {
    return filtered;
  }

  return modePool;
}

export function selectProblemByCursor(params: {
  category: Category;
  difficulty: Difficulty;
  drillMode: DrillMode;
  cursor: number;
}): SelectedProblem {
  const { category, difficulty, drillMode, cursor } = params;
  const pool = getProblemPool({ category, difficulty, drillMode });

  if (pool.length === 0) {
    throw new Error(`No problems found for ${category}/${drillMode}`);
  }

  const selected = pickByIndex(pool, cursor);

  return {
    ...selected,
    category,
  };
}
