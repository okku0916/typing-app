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

export interface RankingMap {
  _version?: number;
  [key: string]: RankingEntry[] | number | undefined;
}
