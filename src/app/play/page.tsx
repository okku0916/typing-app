"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

import { CodeView } from "@/components/editor/CodeView";
import { TypingInput } from "@/components/editor/TypingInput";
import { ResultPanel } from "@/components/game/ResultPanel";
import { TimerDisplay } from "@/components/game/TimerDisplay";
import { useTypingSession } from "@/hooks/useTypingSession";
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  DRILL_MODE_LABELS,
  GAME_MODE_LABELS,
} from "@/lib/labels";
import { parseSettingsFromSearchParams } from "@/lib/sessionConfig";
import type { AppSettings } from "@/types/settings";

interface PlaySessionViewProps {
  config: AppSettings;
  initialCursor: number;
}

function PlaySessionView({ config, initialCursor }: PlaySessionViewProps) {
  const router = useRouter();
  const session = useTypingSession(config, initialCursor);

  useEffect(() => {
    if (session.status === "finished" && session.endReason === "time_up") {
      router.replace("/result");
    }
  }, [router, session.endReason, session.status]);

  const progress =
    session.engineState.reference.length === 0
      ? 100
      : Math.min(
          100,
          Math.round(
            (session.engineState.cursorIndex / session.engineState.reference.length) * 100,
          ),
        );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header className="space-y-4 rounded-xl border border-panel-border/70 bg-panel/80 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">コードタイピング</p>
            <h1 className="mt-1 text-xl font-semibold text-foreground">{session.problem.title}</h1>
            <p className="mt-2 text-sm text-muted">
              {CATEGORY_LABELS[config.category]} /{" "}
              {config.drillMode === "random_syntax"
                ? `${DIFFICULTY_LABELS[config.difficulty]} / `
                : ""}
              {DRILL_MODE_LABELS[config.drillMode]} / {GAME_MODE_LABELS[config.gameMode]}
            </p>
            <p className="mt-1 text-xs text-muted">
              解答済み問題数: <span className="code-font text-foreground">{session.completedProblems}</span>
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <TimerDisplay
              elapsedSeconds={session.elapsedSeconds}
              remainingSeconds={session.remainingSeconds}
              totalSeconds={session.totalSeconds}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>進捗</span>
            <span className="code-font">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-background/50">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <section className="space-y-4 rounded-xl border border-panel-border/70 bg-panel/70 p-5">
        <CodeView chars={session.engineState.visual} cursorIndex={session.engineState.cursorIndex} />
        <TypingInput
          onInputKey={session.inputKey}
          disabled={session.status === "finished" || session.engineState.isCompleted}
        />
      </section>

      {session.result ? (
        <div className="space-y-4">
          <ResultPanel result={session.result} />
          <div className="flex flex-wrap gap-3">
            <Link
              href="/result"
              className="rounded-md border border-accent bg-accent px-4 py-2 text-sm font-medium text-[#0b1320] transition hover:bg-accent/90"
            >
              リザルト画面へ
            </Link>
            <button
              type="button"
              onClick={session.restart}
              className="rounded-md border border-panel-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent"
            >
              もう一度プレイ
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-1 text-sm text-muted">
          <p>表示されたコードをそのまま入力してください。ミスは赤で表示され、スコアから減点されます。</p>
          {config.gameMode === "timed" ? (
            <p>通常モードでは、時間が残っている限り、問題を完了すると次の問題が自動で出題されます。</p>
          ) : (
            <p>無制限モードでは、1問完了ごとにリザルトを表示します。</p>
          )}
          {config.drillMode === "algorithm" ? (
            <p>アルゴリズムモードでは難易度による出題制限はなく、言語ごとのアルゴリズム問題から出題されます。</p>
          ) : null}
        </div>
      )}
    </main>
  );
}

function PlayPageContent() {
  const searchParams = useSearchParams();

  const config = useMemo(
    () => parseSettingsFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const initialCursor = useMemo(() => {
    const cursorParam = Number(searchParams.get("cursor"));

    if (Number.isFinite(cursorParam) && cursorParam >= 0) {
      return Math.floor(cursorParam);
    }

    return 0;
  }, [searchParams]);

  return (
    <PlaySessionView
      key={`${config.category}-${config.difficulty}-${config.drillMode}-${config.gameMode}-${initialCursor}`}
      config={config}
      initialCursor={initialCursor}
    />
  );
}

function PlayPageFallback() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6">
      <section className="w-full rounded-xl border border-panel-border/70 bg-panel/80 p-5">
        <p className="text-sm text-muted">セッションを読み込み中です...</p>
      </section>
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<PlayPageFallback />}>
      <PlayPageContent />
    </Suspense>
  );
}
