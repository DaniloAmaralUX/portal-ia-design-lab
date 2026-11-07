import type { ReactNode } from "react";
import { DisclosureSummary } from "@/components/ui/disclosure";
import { cn } from "@/lib/utils";

// The outline folded above the text, on the screens too narrow for the column on the right; the caller hides it where the column shows.
// The padding sits on the summary and on the body, and not on the box, so the whole closed card opens it, and the 4px at the top of
// the body keep the focus ring of the first link inside the clip of the opening (details::details-content, globals.css).
export function OutlineDetails({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <details className={cn("group rounded-xl border border-border bg-card", className)}>
      <DisclosureSummary className="gap-4 px-4 py-3 text-small">{label}</DisclosureSummary>
      <div className="px-4 pb-4 pt-1">{children}</div>
    </details>
  );
}
