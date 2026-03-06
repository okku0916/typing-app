"use client";

import { useEffect, useRef } from "react";

interface TypingInputProps {
  onInputKey: (key: string) => void;
  disabled: boolean;
}

export function TypingInput({ onInputKey, disabled }: TypingInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted">
        Focus is captured here. Press Enter to move lines with auto-indent jump.
      </p>
      <input
        ref={inputRef}
        type="text"
        className="w-full rounded-lg border border-panel-border bg-background/40 px-3 py-2 text-sm text-foreground outline-none ring-accent focus:ring-2"
        value=""
        onKeyDown={(event) => {
          if (disabled) {
            return;
          }

          if (event.key === "Shift" || event.key === "Control" || event.key === "Alt") {
            return;
          }

          event.preventDefault();
          const key = event.key === "Enter" ? "\n" : event.key;

          if (key.length === 1 || key === "\n" || key === "Tab") {
            onInputKey(key === "Tab" ? "\t" : key);
          }
        }}
        onBlur={(event) => {
          event.currentTarget.focus();
        }}
        readOnly
        autoFocus
      />
    </div>
  );
}
