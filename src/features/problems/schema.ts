import type {
  Category,
  Difficulty,
  DrillMode,
  ProblemItem,
  ProblemsByMode,
  ProblemsJson,
} from "@/types/problem";

export const CATEGORIES: Category[] = ["cpp", "python", "rust"];

export const DIFFICULTIES: Difficulty[] = ["level_1", "level_2", "level_3"];

export const DRILL_MODES: DrillMode[] = ["random_syntax", "algorithm"];

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
  const difficulty = value.difficulty;
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

  if (difficulty !== "level_1" && difficulty !== "level_2" && difficulty !== "level_3") {
    throw new Error(`${path}.difficulty: difficulty must be level_1, level_2, or level_3`);
  }

  if (mode !== "random_syntax" && mode !== "algorithm") {
    throw new Error(`${path}.mode: mode must be random_syntax or algorithm`);
  }

  return { id, title, code, difficulty, mode };
}

function parseModeBucket(value: unknown, mode: DrillMode, path: string): ProblemItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, index) => {
    const parsed = parseProblemItem(item, `${path}[${index}]`);

    if (parsed.mode !== mode) {
      throw new Error(
        `${path}[${index}].mode: expected ${mode}, received ${parsed.mode}`,
      );
    }

    return parsed;
  });
}

export function parseProblemsData(raw: unknown): ProblemsJson {
  if (!isRecord(raw)) {
    throw new Error("problems.json must be an object");
  }

  const result = {} as ProblemsJson;

  for (const category of CATEGORIES) {
    const categoryValue = raw[category];
    const categoryRecord = isRecord(categoryValue) ? categoryValue : {};
    const parsedCategory = {} as ProblemsByMode;

    for (const mode of DRILL_MODES) {
      parsedCategory[mode] = parseModeBucket(
        categoryRecord[mode],
        mode,
        `${category}.${mode}`,
      );
    }

    result[category] = parsedCategory;
  }

  return result;
}
