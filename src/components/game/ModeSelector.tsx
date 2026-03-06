"use client";

import { DRILL_MODES } from "@/features/problems/schema";
import { DRILL_MODE_DESCRIPTIONS, DRILL_MODE_LABELS } from "@/lib/labels";
import type { DrillMode } from "@/types/problem";

interface ModeSelectorProps {
  value: DrillMode;
  onChange: (value: DrillMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {DRILL_MODES.map((mode) => {
        const active = value === mode;

        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`rounded-lg border px-4 py-3 text-left transition ${
              active
                ? "border-accent bg-accent/10"
                : "border-panel-border bg-background/30 hover:border-accent/70"
            }`}
          >
            <p className="text-sm font-medium text-foreground">{DRILL_MODE_LABELS[mode]}</p>
            <p className="mt-1 text-xs text-muted">{DRILL_MODE_DESCRIPTIONS[mode]}</p>
          </button>
        );
      })}
    </div>
  );
}
