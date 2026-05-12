"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { CategorySelector } from "@/components/game/CategorySelector";
import { DifficultySelector } from "@/components/game/DifficultySelector";
import { GameModeSelector } from "@/components/game/GameModeSelector";
import { ModeSelector } from "@/components/game/ModeSelector";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/lib/labels";
import { toSearchParams } from "@/lib/sessionConfig";
import { DEFAULT_SETTINGS } from "@/types/settings";

export default function Home() {
  const router = useRouter();
  const [settings, setSettings] = useLocalStorageState(STORAGE_KEYS.settings, DEFAULT_SETTINGS);

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

      <div className="grid gap-6">
        <section className="grid gap-4 rounded-2xl border border-panel-border/70 bg-panel/85 p-5 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">カテゴリ</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              {CATEGORY_LABELS[settings.category]}
            </h2>
            <p className="mt-2 text-sm text-muted">使用する言語を選択してください。</p>
          </div>
          <CategorySelector
            value={settings.category}
            onChange={(category) => setSettings((prev) => ({ ...prev, category }))}
          />
        </section>

        <section className="grid gap-4 rounded-2xl border border-panel-border/70 bg-panel/85 p-5 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">出題モード</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">{settings.drillMode === "random_syntax" ? "ランダム構文" : "アルゴリズム"}</h2>
            <p className="mt-2 text-sm text-muted">短文スニペットかアルゴリズム連続入力を選択します。</p>
          </div>
          <ModeSelector
            value={settings.drillMode}
            onChange={(drillMode) => setSettings((prev) => ({ ...prev, drillMode }))}
          />
        </section>

        <section className="grid gap-4 rounded-2xl border border-panel-border/70 bg-panel/85 p-5 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">難易度</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              {settings.drillMode === "random_syntax"
                ? DIFFICULTY_LABELS[settings.difficulty]
                : "アルゴリズム共通"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {settings.drillMode === "random_syntax"
                ? "基本構文モードの出題内容と制限時間を調整します。"
                : "アルゴリズムモードでは難易度による出題制限はありません。"}
            </p>
          </div>
          <DifficultySelector
            value={settings.difficulty}
            onChange={(difficulty) => setSettings((prev) => ({ ...prev, difficulty }))}
            disabled={settings.drillMode === "algorithm"}
          />
        </section>

        <section className="grid gap-4 rounded-2xl border border-panel-border/70 bg-panel/85 p-5 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">ゲームモード</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              {settings.gameMode === "timed" ? "通常モード" : "無制限モード"}
            </h2>
            <p className="mt-2 text-sm text-muted">時間制限あり / なしを切り替えます。</p>
          </div>
          <GameModeSelector
            value={settings.gameMode}
            onChange={(gameMode) => setSettings((prev) => ({ ...prev, gameMode }))}
          />
        </section>
      </div>

      <section className="rounded-2xl border border-panel-border/70 bg-panel/85 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={handleStartSession}
            className="rounded-xl border border-accent bg-accent px-6 py-4 text-lg font-semibold text-[#0a1220] transition hover:bg-accent/90"
          >
            プレイ
          </button>
          <Link
            href="/rankings"
            className="rounded-xl border border-panel-border bg-background/30 px-6 py-4 text-lg font-semibold text-foreground transition hover:border-accent"
          >
            ランキング
          </Link>
          <Link
            href="/result"
            className="rounded-xl border border-panel-border bg-background/30 px-6 py-4 text-lg font-semibold text-foreground transition hover:border-accent"
          >
            最新リザルト
          </Link>
        </div>
      </section>
    </main>
  );
}
