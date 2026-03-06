interface TimerDisplayProps {
  elapsedSeconds: number;
  remainingSeconds: number | null;
  totalSeconds: number | null;
}

function toClock(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

export function TimerDisplay({ elapsedSeconds, remainingSeconds, totalSeconds }: TimerDisplayProps) {
  return (
    <div className="grid gap-2 rounded-lg border border-panel-border/70 bg-background/40 p-3 text-sm sm:grid-cols-2">
      <div>
        <p className="text-xs text-muted">経過時間</p>
        <p className="code-font text-lg text-foreground">{toClock(elapsedSeconds)}</p>
      </div>
      <div>
        <p className="text-xs text-muted">残り時間</p>
        <p className="code-font text-lg text-foreground">
          {totalSeconds === null || remainingSeconds === null
            ? "∞"
            : toClock(remainingSeconds)}
        </p>
      </div>
    </div>
  );
}
