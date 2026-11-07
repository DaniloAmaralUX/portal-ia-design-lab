import { Hand, Zap } from "lucide-react";
import { MODES, modeOf } from "@/data/modes";
import { cn } from "@/lib/utils";

export function ModeBadge({ manual, className, compact = false }: { manual: boolean; className?: string; compact?: boolean }) {
  const Icon = manual ? Hand : Zap;
  const { label, hint } = MODES[modeOf({ manual })];
  return (
    <span
      title={hint}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-micro font-medium",
        manual
          ? "border-border bg-muted text-muted-foreground"
          : "border-border bg-card text-foreground/80",
        compact && "px-2",
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" strokeWidth={2} />
      {!compact && label}
      {compact && <span className="sr-only">{label}</span>}
    </span>
  );
}
