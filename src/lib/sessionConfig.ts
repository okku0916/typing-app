import { CATEGORIES, DIFFICULTIES, DRILL_MODES } from "@/features/problems/schema";
import { DEFAULT_SETTINGS, type AppSettings } from "@/types/settings";

function isOneOf<T extends string>(value: string | null, values: readonly T[]): value is T {
  return value !== null && (values as readonly string[]).includes(value);
}

const GAME_MODES = ["timed", "unlimited"] as const;

export function parseSettingsFromSearchParams(params: URLSearchParams): AppSettings {
  const categoryParam = params.get("category");
  const difficultyParam = params.get("difficulty");
  const drillModeParam = params.get("drillMode");
  const gameModeParam = params.get("gameMode");

  return {
    category: isOneOf(categoryParam, CATEGORIES)
      ? categoryParam
      : DEFAULT_SETTINGS.category,
    difficulty: isOneOf(difficultyParam, DIFFICULTIES)
      ? difficultyParam
      : DEFAULT_SETTINGS.difficulty,
    drillMode: isOneOf(drillModeParam, DRILL_MODES)
      ? drillModeParam
      : DEFAULT_SETTINGS.drillMode,
    gameMode: isOneOf(gameModeParam, GAME_MODES)
      ? gameModeParam
      : DEFAULT_SETTINGS.gameMode,
  };
}

export function toSearchParams(settings: AppSettings): URLSearchParams {
  const params = new URLSearchParams();

  params.set("category", settings.category);
  params.set("difficulty", settings.difficulty);
  params.set("drillMode", settings.drillMode);
  params.set("gameMode", settings.gameMode);

  return params;
}
