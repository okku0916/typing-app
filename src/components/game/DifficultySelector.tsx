"use client";

import { DIFFICULTIES } from "@/features/problems/schema";
import { DIFFICULTY_DESCRIPTIONS, DIFFICULTY_LABELS } from "@/lib/labels";
import { TIME_LIMITS } from "@/lib/constants";
import type { Difficulty } from "@/types/problem";

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
  disabled?: boolean;
}

export function DifficultySelector({ value, onChange, disabled = false }: DifficultySelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {DIFFICULTIES.map((difficulty) => {
        const active = value === difficulty;

        return (
          <button
            key={difficulty}
            type="button"
            disabled={disabled}
            onClick={() => onChange(difficulty)}
            className={`rounded-lg border px-4 py-3 text-left transition ${
              active
                ? "border-accent bg-accent/10"
                : "border-panel-border bg-background/30 hover:border-accent/70"
            } ${disabled ? "cursor-not-allowed opacity-50 hover:border-panel-border" : ""}`}
          >
            <p className="text-sm font-medium text-foreground">
              {DIFFICULTY_LABELS[difficulty]}
            </p>
            <p className="mt-1 text-xs text-muted">{DIFFICULTY_DESCRIPTIONS[difficulty]}</p>
            <p className="mt-2 text-xs text-warning">{TIME_LIMITS[difficulty]} 秒</p>
          </button>
        );
      })}
    </div>
  );
}
