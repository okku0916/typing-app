"use client";

import Link from "next/link";

import { ResultPanel } from "@/components/game/ResultPanel";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { SessionResult } from "@/types/session";

export default function ResultPage() {
  const [latestResult] = useLocalStorageState<SessionResult | null>(
    STORAGE_KEYS.latestResult,
    null,
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header className="rounded-xl border border-panel-border/70 bg-panel/80 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-accent">リザルト画面</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">セッション結果</h1>
      </header>

      {latestResult ? (
        <ResultPanel result={latestResult} />
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
        <Link
          href="/play"
          className="rounded-md border border-accent bg-accent px-4 py-2 text-sm font-medium text-[#0b1320] transition hover:bg-accent/90"
        >
          すぐにプレイ
        </Link>
      </div>
    </main>
  );
}
