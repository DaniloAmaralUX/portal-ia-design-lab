import type { ReactNode } from "react";

export function EntryPoint({ label, title, text, children }: { label: string; title: string; text: string; children: ReactNode }) {
  return (
    <li className="interactive-surface flex flex-col rounded-2xl border border-border bg-card p-6 shadow-xs">
      <p className="eyebrow">{label}</p>
      <h3 className="mt-2 font-display text-heading font-bold">{title}</h3>
      <p className="mt-2 text-small leading-relaxed text-muted-foreground text-pretty">{text}</p>
      <div className="mt-auto flex flex-col items-start gap-2 pt-6">{children}</div>
    </li>
  );
}
