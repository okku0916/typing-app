import type { RankingEntry } from "@/types/ranking";

interface RankingEntryRowProps {
  entry: RankingEntry;
  index: number;
  highlight?: boolean;
}

export function RankingEntryRow({ entry, index, highlight = false }: RankingEntryRowProps) {
  return (
    <div
      className={`grid grid-cols-[56px_1.2fr_1fr_1fr_1fr] items-center gap-3 rounded-md border px-3 py-3 text-sm ${
        highlight
          ? "border-accent/60 bg-accent/10"
          : "border-panel-border bg-background/30"
      }`}
    >
      <span className="code-font text-base text-foreground">#{index + 1}</span>
      <span className="truncate text-base font-semibold text-foreground">{entry.nickname}</span>
      <span className="code-font text-base text-foreground">{entry.score}</span>
      <span className="code-font text-base text-foreground">{entry.wpm}</span>
      <span className="code-font text-base text-foreground">{entry.completedProblems}</span>
    </div>
  );
}
