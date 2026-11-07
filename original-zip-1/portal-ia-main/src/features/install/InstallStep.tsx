import type { ReactNode } from "react";

export function InstallStep({ n, title, children }: { n: number; title: ReactNode; children: ReactNode }) {
  return (
    <li className="relative pl-9">
      <span className="tabular absolute left-0 top-0 inline-flex size-6 items-center justify-center rounded-full bg-foreground font-mono text-micro font-semibold text-background">
        {n}
      </span>
      <p className="mb-2 text-small font-medium leading-6">{title}</p>
      {children}
    </li>
  );
}
