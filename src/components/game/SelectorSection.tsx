import { type ReactNode } from "react";

interface SelectorSectionProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function SelectorSection({ title, subtitle, children }: SelectorSectionProps) {
  return (
    <section className="space-y-3 rounded-xl border border-panel-border/70 bg-panel/80 p-4 sm:p-5">
      <header className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground/90">{title}</h2>
        <p className="text-xs text-muted">{subtitle}</p>
      </header>
      {children}
    </section>
  );
}
