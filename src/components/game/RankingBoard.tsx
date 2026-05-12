import { RankingEntryRow } from "@/components/game/RankingEntryRow";
import type { RankingEntry } from "@/types/ranking";

interface RankingBoardProps {
  title: string;
  subtitle: string;
  entries: RankingEntry[];
  highlightId?: string;
}

export function RankingBoard({ title, subtitle, entries, highlightId }: RankingBoardProps) {
  return (
    <section className="space-y-3 rounded-xl border border-panel-border/70 bg-panel/80 p-5">
      <header className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground/90">{title}</h2>
        <p className="text-xs text-muted">{subtitle}</p>
      </header>

      <div className="grid grid-cols-[48px_1.2fr_1fr_1fr_1fr] gap-3 px-3 text-xs text-muted">
        <span>順位</span>
        <span>ニックネーム</span>
        <span>スコア</span>
        <span>WPM</span>
        <span>完了問題数</span>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted">まだランキング登録がありません。</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <RankingEntryRow
              key={entry.id}
              entry={entry}
              index={index}
              highlight={highlightId === entry.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
