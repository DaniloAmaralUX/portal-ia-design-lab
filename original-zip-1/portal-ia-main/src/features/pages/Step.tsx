import type { ReactNode } from "react";

export function Step({ n, title, id, last = false, children }: { n: number; title: string; id?: string; last?: boolean; children: ReactNode }) {
  return (
    <li id={id} className="relative pb-12 pl-14 last:pb-0">
      {!last && <span aria-hidden className="absolute bottom-0 left-[1.1rem] top-11 w-px bg-border" />}
      <span className="tabular absolute left-0 top-0 inline-flex size-9 items-center justify-center rounded-full bg-foreground font-display text-body font-bold text-background">
        {n}
      </span>
      <h3 className="pt-1 font-display text-subheading font-bold">{title}</h3>
      <div className="mt-3 space-y-3 text-body leading-relaxed text-muted-foreground [&>p]:max-w-measure">{children}</div>
    </li>
  );
}
