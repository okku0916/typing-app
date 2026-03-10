"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { CategorySelector } from "@/components/game/CategorySelector";
import { DifficultySelector } from "@/components/game/DifficultySelector";
import { GameModeSelector } from "@/components/game/GameModeSelector";
import { ModeSelector } from "@/components/game/ModeSelector";
import { SelectorSection } from "@/components/game/SelectorSection";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, TIME_LIMITS } from "@/lib/constants";
import { DIFFICULTY_LABELS } from "@/lib/labels";
import { toSearchParams } from "@/lib/sessionConfig";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { SessionResult } from "@/types/session";

export default function Home() {
  const router = useRouter();
  const [settings, setSettings] = useLocalStorageState(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const [latestResult] = useLocalStorageState<SessionResult | null>(
    STORAGE_KEYS.latestResult,
    null,
  );

  const handleStartSession = () => {
    const params = toSearchParams(settings);
    const cursor = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    params.set("cursor", String(cursor));
    router.push(`/play?${params.toString()}`);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="rounded-2xl border border-panel-border/70 bg-panel/85 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-accent">プログラミング特化タイピング</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">CodeTyping</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          プログラマーと競技プログラマー向けの、コード入力に特化したタイピング練習アプリです。
          複数行コードでは Enter で次行インデントまで自動でカーソルが進みます。
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <SelectorSection title="カテゴリ" subtitle="使用する言語を選択">
          <CategorySelector
            value={settings.category}
            onChange={(category) => setSettings((prev) => ({ ...prev, category }))}
          />
        </SelectorSection>

        <SelectorSection title="出題モード" subtitle="短文スニペットかアルゴリズム連続入力を選択">
          <ModeSelector
            value={settings.drillMode}
            onChange={(drillMode) => setSettings((prev) => ({ ...prev, drillMode }))}
          />
        </SelectorSection>

        <SelectorSection
          title="難易度"
          subtitle={
            settings.drillMode === "random_syntax"
              ? "基本構文モードの出題内容と制限時間を調整"
              : "アルゴリズムモードでは難易度による出題制限はありません"
          }
        >
          <DifficultySelector
            value={settings.difficulty}
            onChange={(difficulty) => setSettings((prev) => ({ ...prev, difficulty }))}
            disabled={settings.drillMode === "algorithm"}
          />
        </SelectorSection>

        <SelectorSection title="ゲームモード" subtitle="時間制限あり / なしを切り替え">
          <GameModeSelector
            value={settings.gameMode}
            onChange={(gameMode) => setSettings((prev) => ({ ...prev, gameMode }))}
          />
        </SelectorSection>
      </div>

      <section className="rounded-xl border border-panel-border/70 bg-panel/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted">現在の制限時間</p>
            <p className="code-font text-xl text-foreground">
              {settings.gameMode === "unlimited"
                ? "無制限"
                : settings.drillMode === "random_syntax"
                  ? `${TIME_LIMITS[settings.difficulty]} 秒（${DIFFICULTY_LABELS[settings.difficulty]}）`
                  : `${TIME_LIMITS.level_3} 秒（アルゴリズム共通）`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStartSession}
              className="rounded-md border border-accent bg-accent px-5 py-2 text-sm font-semibold text-[#0a1220] transition hover:bg-accent/90"
            >
              セッション開始
            </button>
            <Link
              href="/result"
              className="rounded-md border border-panel-border px-5 py-2 text-sm font-semibold text-foreground transition hover:border-accent"
            >
              最新リザルト
            </Link>
          </div>
        </div>

        {latestResult ? (
          <div className="mt-4 rounded-lg border border-panel-border bg-background/35 p-3">
            <p className="text-xs text-muted">前回セッションの概要</p>
            <p className="mt-2 text-sm text-foreground">
              スコア {latestResult.stats.score} / WPM {latestResult.stats.wpm} / ミス数{" "}
              {latestResult.stats.mistakeCount} / 完了問題数 {latestResult.stats.completedProblems}
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
