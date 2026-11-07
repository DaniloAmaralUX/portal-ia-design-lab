import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Notice({ icon: Icon, className, children }: { icon: LucideIcon; className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex gap-3 rounded-xl border border-border bg-muted/60 px-4 py-3 text-small text-foreground/85", className)}>
      <Icon strokeWidth={1.5} aria-hidden className="mt-0.5 size-4 shrink-0 text-foreground/70" />
      {children}
    </div>
  );
}
