"use client";

import { GAME_MODE_DESCRIPTIONS, GAME_MODE_LABELS } from "@/lib/labels";
import type { GameMode } from "@/types/session";

const GAME_MODES: GameMode[] = ["timed", "unlimited"];

interface GameModeSelectorProps {
  value: GameMode;
  onChange: (value: GameMode) => void;
}

export function GameModeSelector({ value, onChange }: GameModeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {GAME_MODES.map((gameMode) => {
        const active = value === gameMode;

        return (
          <button
            key={gameMode}
            type="button"
            onClick={() => onChange(gameMode)}
            className={`rounded-lg border px-4 py-3 text-left transition ${
              active
                ? "border-accent bg-accent/10"
                : "border-panel-border bg-background/30 hover:border-accent/70"
            }`}
          >
            <p className="text-sm font-medium text-foreground">{GAME_MODE_LABELS[gameMode]}</p>
            <p className="mt-1 text-xs text-muted">{GAME_MODE_DESCRIPTIONS[gameMode]}</p>
          </button>
        );
      })}
    </div>
  );
}
