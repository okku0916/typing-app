"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { RankingBoard } from "@/components/game/RankingBoard";
import { DIFFICULTY_LABELS } from "@/lib/labels";
import { buildRankingKey, getRankingsByKey } from "@/lib/rankings";
import type { RankingEntry } from "@/types/ranking";
import type { Category, Difficulty, DrillMode } from "@/types/problem";

const CATEGORY_OPTIONS: Array<{ value: Category; label: string }> = [
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
];

const MODE_OPTIONS: Array<{ value: DrillMode; label: string }> = [
  { value: "random_syntax", label: "ランダム構文" },
  { value: "algorithm", label: "アルゴリズム" },
];

const DIFFICULTY_OPTIONS: Array<{ value: Difficulty; label: string }> = [
  { value: "level_1", label: DIFFICULTY_LABELS.level_1 },
  { value: "level_2", label: DIFFICULTY_LABELS.level_2 },
  { value: "level_3", label: DIFFICULTY_LABELS.level_3 },
];

export default function RankingsPage() {
  const [category, setCategory] = useState<Category>("cpp");
  const [mode, setMode] = useState<DrillMode>("random_syntax");
  const [difficulty, setDifficulty] = useState<Difficulty>("level_2");

  const rankings = useMemo(() => {
    const key = buildRankingKey({
      category,
      drillMode: mode,
      difficulty,
      gameMode: "timed",
    });

    return getRankingsByKey(key);
  }, [category, mode, difficulty]);

  const title =
    mode === "random_syntax"
      ? `ランダム構文 (${DIFFICULTY_LABELS[difficulty]}) ランキング`
      : "アルゴリズム ランキング";

  const subtitle =
    mode === "random_syntax"
      ? "難易度別のスコア上位を表示しています。"
      : "言語別のアルゴリズム問題のスコア上位を表示しています。";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="rounded-xl border border-panel-border/70 bg-panel/80 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-accent">ランキング</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">ランキングボード</h1>
      </header>

      <section className="grid gap-4 rounded-xl border border-panel-border/70 bg-panel/70 p-5 sm:grid-cols-3">
        <div className="space-y-2">
          <p className="text-xs text-muted">言語</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCategory(option.value)}
                className={`rounded-full border px-4 py-1 text-xs transition ${
                  category === option.value
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-panel-border bg-background/30 text-muted hover:border-accent/70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted">モード</p>
          <div className="flex flex-wrap gap-2">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={`rounded-full border px-4 py-1 text-xs transition ${
                  mode === option.value
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-panel-border bg-background/30 text-muted hover:border-accent/70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted">難易度</p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDifficulty(option.value)}
                disabled={mode === "algorithm"}
                className={`rounded-full border px-4 py-1 text-xs transition ${
                  difficulty === option.value
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-panel-border bg-background/30 text-muted hover:border-accent/70"
                } ${mode === "algorithm" ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {mode === "algorithm" ? (
            <p className="text-xs text-muted">アルゴリズムは難易度で絞り込みません。</p>
          ) : null}
        </div>
      </section>

      <RankingBoard title={title} subtitle={subtitle} entries={rankings as RankingEntry[]} />

      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-md border border-panel-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent"
        >
          ホームへ戻る
        </Link>
      </div>
    </main>
  );
}
