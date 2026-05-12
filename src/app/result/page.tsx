"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { RankingBoard } from "@/components/game/RankingBoard";
import { RankingSubmission } from "@/components/game/RankingSubmission";
import { ResultPanel } from "@/components/game/ResultPanel";
import { useLocalStorageState, useLocalStorageVersion } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { buildRankingKey, getRankingsByKey } from "@/lib/rankings";
import { DIFFICULTY_LABELS } from "@/lib/labels";
import { toSearchParams } from "@/lib/sessionConfig";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { AppSettings } from "@/types/settings";
import type { RankingEntry } from "@/types/ranking";
import type { SessionResult } from "@/types/session";

export default function ResultPage() {
  const router = useRouter();
  const [highlightId, setHighlightId] = useState<string | undefined>(undefined);
  const [rankPosition, setRankPosition] = useState<number | null>(null);
  const [latestResult] = useLocalStorageState<SessionResult | null>(
    STORAGE_KEYS.latestResult,
    null,
  );
  const [settings] = useLocalStorageState<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const rankingsVersion = useLocalStorageVersion(STORAGE_KEYS.rankings);

  const rankingEntries = useMemo(() => {
    if (!latestResult) {
      return [];
    }

    void rankingsVersion;
    const key = buildRankingKey(latestResult.config);
    return getRankingsByKey(key);
  }, [latestResult, rankingsVersion]);

  const rankingTitle = latestResult
    ? latestResult.config.drillMode === "random_syntax"
      ? `ランダム構文 (${DIFFICULTY_LABELS[latestResult.config.difficulty]}) ランキング`
      : "アルゴリズム ランキング"
    : "ランキング";

  const rankingSubtitle = latestResult
    ? latestResult.config.drillMode === "random_syntax"
      ? "難易度別のスコア上位を表示しています。"
      : "言語別のアルゴリズム問題のスコア上位を表示しています。"
    : "";

  const handleQuickPlay = () => {
    const params = toSearchParams(settings);
    const cursor = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    params.set("cursor", String(cursor));
    router.push(`/play?${params.toString()}`);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header className="rounded-xl border border-panel-border/70 bg-panel/80 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-accent">リザルト画面</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">セッション結果</h1>
        {latestResult ? (
          <p className="mt-2 text-sm text-muted">
            {latestResult.endReason === "time_up"
              ? "時間切れで終了した結果です。"
              : "問題を完了して終了した結果です。"}
          </p>
        ) : null}
      </header>

      {latestResult ? (
        <div className="space-y-4">
          <ResultPanel result={latestResult} />
          <RankingSubmission
            result={latestResult}
            onSubmitted={(entry, rank) => {
              setHighlightId(entry.id);
              setRankPosition(rank);
            }}
          />
          <RankingBoard
            title={rankingTitle}
            subtitle={rankingSubtitle}
            entries={rankingEntries as RankingEntry[]}
            highlightId={highlightId}
          />
          {rankPosition ? (
            <div className="rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm text-foreground">
              あなたの順位: <span className="code-font">#{rankPosition}</span>
            </div>
          ) : null}
        </div>
      ) : (
        <section className="rounded-xl border border-panel-border/70 bg-panel/80 p-5">
          <p className="text-sm text-muted">まだ結果がありません。まずは1回プレイしてください。</p>
        </section>
      )}

      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-md border border-panel-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent"
        >
          ホームへ戻る
        </Link>
        <button
          type="button"
          onClick={handleQuickPlay}
          className="rounded-md border border-accent bg-accent px-4 py-2 text-sm font-medium text-[#0b1320] transition hover:bg-accent/90"
        >
          すぐにプレイ
        </button>
      </div>
    </main>
  );
}
