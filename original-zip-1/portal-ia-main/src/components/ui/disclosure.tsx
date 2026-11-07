import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function DisclosureSummary({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <summary
      className={cn(
        "flex cursor-pointer list-none items-center justify-between font-semibold transition-colors [&::-webkit-details-marker]:hidden",
        className,
      )}
    >
      {children}
      <ChevronDown aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
    </summary>
  );
}

export function Disclosure({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <details className="group border-t border-border">
      <DisclosureSummary className="gap-4 py-3 text-small hover:text-foreground/80">{title}</DisclosureSummary>
      <div className="space-y-4 pb-5 pt-1">{children}</div>
    </details>
  );
}
