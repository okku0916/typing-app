"use client";

import { CATEGORIES } from "@/features/problems/schema";
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS } from "@/lib/labels";
import type { Category } from "@/types/problem";

interface CategorySelectorProps {
  value: Category;
  onChange: (value: Category) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {CATEGORIES.map((category) => {
        const active = value === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-lg border px-4 py-3 text-left transition ${
              active
                ? "border-accent bg-accent/10"
                : "border-panel-border bg-background/30 hover:border-accent/70"
            }`}
          >
            <p className="text-sm font-medium text-foreground">{CATEGORY_LABELS[category]}</p>
            <p className="mt-1 text-xs text-muted">{CATEGORY_DESCRIPTIONS[category]}</p>
          </button>
        );
      })}
    </div>
  );
}
