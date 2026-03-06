import type {
  Category,
  Difficulty,
  DrillMode,
  ProblemItem,
  ProblemsByDifficulty,
  ProblemsJson,
} from "@/types/problem";

export const CATEGORIES: Category[] = [
  "cpp",
  "python",
  "rust",
  "competitive_programming",
];

export const DIFFICULTIES: Difficulty[] = ["level_1", "level_2", "level_3"];

export const DRILL_MODES: DrillMode[] = ["syntax", "algorithm"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseProblemItem(value: unknown, path: string): ProblemItem {
  if (!isRecord(value)) {
    throw new Error(`${path}: problem must be an object`);
  }

  const id = value.id;
  const title = value.title;
  const code = value.code;
  const mode = value.mode;

  if (typeof id !== "string" || id.length === 0) {
    throw new Error(`${path}.id: id must be a non-empty string`);
  }

  if (typeof title !== "string" || title.length === 0) {
    throw new Error(`${path}.title: title must be a non-empty string`);
  }

  if (typeof code !== "string" || code.length === 0) {
    throw new Error(`${path}.code: code must be a non-empty string`);
  }

  if (mode !== "syntax" && mode !== "algorithm") {
    throw new Error(`${path}.mode: mode must be syntax or algorithm`);
  }

  return { id, title, code, mode };
}

function parseDifficultyBucket(value: unknown, path: string): ProblemItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, index) => parseProblemItem(item, `${path}[${index}]`));
}

export function parseProblemsData(raw: unknown): ProblemsJson {
  if (!isRecord(raw)) {
    throw new Error("problems.json must be an object");
  }

  const result = {} as ProblemsJson;

  for (const category of CATEGORIES) {
    const categoryValue = raw[category];
    const categoryRecord = isRecord(categoryValue) ? categoryValue : {};
    const parsedCategory = {} as ProblemsByDifficulty;

    for (const difficulty of DIFFICULTIES) {
      parsedCategory[difficulty] = parseDifficultyBucket(
        categoryRecord[difficulty],
        `${category}.${difficulty}`,
      );
    }

    result[category] = parsedCategory;
  }

  return result;
}
