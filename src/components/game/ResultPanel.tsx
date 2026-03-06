import type { SessionResult } from "@/types/session";

interface ResultPanelProps {
  result: SessionResult;
}

export function ResultPanel({ result }: ResultPanelProps) {
  const { stats } = result;

  return (
    <section className="space-y-4 rounded-xl border border-panel-border/70 bg-panel p-5">
      <h2 className="text-lg font-semibold text-foreground">Result</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-panel-border bg-background/40 p-3">
          <p className="text-xs text-muted">Score</p>
          <p className="code-font mt-1 text-2xl text-accent">{stats.score}</p>
        </div>
        <div className="rounded-lg border border-panel-border bg-background/40 p-3">
          <p className="text-xs text-muted">WPM</p>
          <p className="code-font mt-1 text-2xl text-success">{stats.wpm}</p>
        </div>
        <div className="rounded-lg border border-panel-border bg-background/40 p-3">
          <p className="text-xs text-muted">Mistakes</p>
          <p className="code-font mt-1 text-2xl text-danger">{stats.mistakeCount}</p>
        </div>
      </div>

      <div className="rounded-lg border border-panel-border bg-background/40 p-3">
        <p className="text-xs text-muted">Weak Keys Top 3</p>
        {stats.weakKeys.length === 0 ? (
          <p className="mt-2 text-sm text-success">No mistakes. Great accuracy.</p>
        ) : (
          <ul className="mt-2 grid gap-2 sm:grid-cols-3">
            {stats.weakKeys.map((item) => (
              <li
                key={item.key}
                className="code-font rounded-md border border-panel-border bg-panel px-3 py-2 text-sm text-foreground"
              >
                {item.key} x {item.count}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
