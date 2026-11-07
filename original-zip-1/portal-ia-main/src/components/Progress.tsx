import { LiquidProgress } from "@/components/devl/LiquidProgress";
import NumberFlow from "@number-flow/react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePointerMotion } from "@/components/craft/craft-context";

export function Progress({
  completed,
  total,
  noun,
  className,
  insideLink = false,
}: {
  completed: number;
  total: number;
  noun: string;
  className?: string;
  insideLink?: boolean;
}) {
  const part = total ? Math.round((completed / total) * 100) : 0;
  const reduce = useReducedMotion();
  const pointer = usePointerMotion();
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="min-w-0 flex-1" aria-hidden={insideLink || undefined}>
        <LiquidProgress value={part} size="default" tone="success" aria-label={`${completed} de ${total} ${noun}`} className="bg-muted" />
      </div>
      <span className="shrink-0 text-caption tabular-nums text-muted-foreground">
        <NumberFlow value={completed} locales="pt-BR" animated={!reduce && pointer} transformTiming={{ duration: 240 }} /> de {total}
        {insideLink && <span className="sr-only"> {noun}</span>}
      </span>
    </div>
  );
}
