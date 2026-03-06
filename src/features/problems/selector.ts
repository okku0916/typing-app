import { problemsData } from "@/features/problems/loader";
import type { Category, Difficulty, DrillMode, SelectedProblem } from "@/types/problem";

function randomPick<T>(values: T[]): T {
  const index = Math.floor(Math.random() * values.length);
  return values[index];
}

export function getProblemPool(params: {
  category: Category;
  difficulty: Difficulty;
  drillMode: DrillMode;
}) {
  const { category, difficulty, drillMode } = params;

  return problemsData[category][difficulty].filter(
    (problem) => problem.mode === drillMode,
  );
}

export function selectRandomProblem(params: {
  category: Category;
  difficulty: Difficulty;
  drillMode: DrillMode;
}): SelectedProblem {
  const { category, difficulty, drillMode } = params;
  const pool = getProblemPool({ category, difficulty, drillMode });

  if (pool.length === 0) {
    const fallback = problemsData[category][difficulty];
    if (fallback.length === 0) {
      throw new Error(`No problems found for ${category}/${difficulty}`);
    }

    const fallbackProblem = randomPick(fallback);
    return {
      ...fallbackProblem,
      category,
      difficulty,
    };
  }

  const selected = randomPick(pool);

  return {
    ...selected,
    category,
    difficulty,
  };
}
