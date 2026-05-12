import { STORAGE_KEYS } from "@/lib/constants";
import { readStorage, writeStorage } from "@/lib/storage";
import type { RankingEntry, RankingMap } from "@/types/ranking";
import type { AppSettings } from "@/types/settings";

export function buildRankingKey(config: AppSettings): string {
  if (config.drillMode === "random_syntax") {
    return `random_syntax:${config.category}:${config.difficulty}`;
  }

  return `algorithm:${config.category}`;
}

export function readRankings(): RankingMap {
  return readStorage<RankingMap>(STORAGE_KEYS.rankings, {} as RankingMap);
}

export function writeRankings(rankings: RankingMap) {
  writeStorage(STORAGE_KEYS.rankings, rankings);
}

function sortEntries(entries: RankingEntry[]) {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.wpm !== a.wpm) {
      return b.wpm - a.wpm;
    }

    return a.createdAt.localeCompare(b.createdAt);
  });
}

export function addRankingEntry(entry: RankingEntry, maxEntries = 50) {
  const rankings = readRankings();
  const key = buildRankingKey(entry.config);
  const current = rankings[key] ?? [];
  const updated = sortEntries([...current, entry]).slice(0, maxEntries);

  return {
    ...rankings,
    [key]: updated,
  };
}

export function getRankingsByKey(key: string): RankingEntry[] {
  const rankings = readRankings();
  return rankings[key] ?? [];
}

export function getRankingPosition(entry: RankingEntry) {
  const key = buildRankingKey(entry.config);
  const rankings = readRankings();
  const current = rankings[key] ?? [];
  const next = sortEntries([...current, entry]);

  return next.findIndex((item) => item.id === entry.id) + 1;
}
