import type { AppSettings } from "@/types/settings";

export interface RankingEntry {
  id: string;
  nickname: string;
  score: number;
  wpm: number;
  completedProblems: number;
  createdAt: string;
  config: AppSettings;
}

export type RankingMap = Record<string, RankingEntry[]>;
