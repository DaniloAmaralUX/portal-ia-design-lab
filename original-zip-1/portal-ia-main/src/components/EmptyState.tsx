import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

export function EmptyState({ title, description, children }: { title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center">
      {/* Search-empty composition adapted from devl.dev/r/no-results.json. */}
      <div aria-hidden className="mb-4 flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-xs">
        <SearchX className="size-5 text-muted-foreground" />
      </div>
      <p className="font-display text-heading font-semibold [overflow-wrap:anywhere]">{title}</p>
      {description && <p className="mt-2 max-w-md text-small leading-relaxed text-muted-foreground">{description}</p>}
      {children && <div className="mt-5 flex flex-col items-center gap-6">{children}</div>}
    </div>
  );
}
