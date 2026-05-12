"use client";

import { useState } from "react";

import { addRankingEntry, buildRankingKey, readRankings, writeRankings } from "@/lib/rankings";
import type { RankingEntry } from "@/types/ranking";
import type { SessionResult } from "@/types/session";

interface RankingSubmissionProps {
  result: SessionResult;
  onSubmitted: (entry: RankingEntry, rank: number) => void;
}

export function RankingSubmission({ result, onSubmitted }: RankingSubmissionProps) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = () => {
    const trimmed = nickname.trim();

    if (trimmed.length === 0) {
      setError("ニックネームを入力してください。");
      return;
    }

    if (trimmed.length > 16) {
      setError("ニックネームは16文字以内にしてください。");
      return;
    }

    if (hasSubmitted) {
      setError("このセッションはすでに登録済みです。");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const entry: RankingEntry = {
      id: result.rankingId ?? `ranking-${Date.now()}`,
      nickname: trimmed,
      score: result.stats.score,
      wpm: result.stats.wpm,
      completedProblems: result.stats.completedProblems,
      createdAt: new Date().toISOString(),
      config: result.config,
    };

    const updated = addRankingEntry(entry);
    const key = buildRankingKey(result.config);
    const updatedEntries = Array.isArray(updated[key]) ? updated[key] : [];
    const rank = updatedEntries.findIndex((item) => item.id === entry.id) + 1;

    writeRankings(updated);
    onSubmitted(entry, rank);
    setHasSubmitted(true);
    setIsSubmitting(false);
  };

  const key = buildRankingKey(result.config);
  const rankingEntries = readRankings()[key];
  const totalEntries = Array.isArray(rankingEntries) ? rankingEntries.length : 0;

  return (
    <section className="space-y-4 rounded-xl border border-panel-border/70 bg-panel/80 p-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">ランキングに登録</h2>
        <p className="mt-1 text-sm text-muted">ニックネームを入力してランキングに登録できます。</p>
        <p className="mt-1 text-xs text-muted">現在の登録数: {totalEntries} 件</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="例: coder123"
          className="w-full rounded-md border border-panel-border bg-background/40 px-3 py-2 text-sm text-foreground outline-none ring-accent focus:ring-2"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || hasSubmitted}
          className="rounded-md border border-accent bg-accent px-4 py-2 text-sm font-semibold text-[#0a1220] transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {hasSubmitted ? "登録済み" : "登録する"}
        </button>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </section>
  );
}
