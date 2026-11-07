import type { ReactNode } from "react";

export function NavGroup({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <p id={id} className="px-2.5 pb-1.5 text-caption font-semibold text-foreground">
        {title}
      </p>
      <ul aria-labelledby={id} className="space-y-0.5">
        {children}
      </ul>
    </div>
  );
}
