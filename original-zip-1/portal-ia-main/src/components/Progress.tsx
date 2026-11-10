import { cn } from "@/lib/utils";

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
  const bar = insideLink
    ? { "aria-hidden": true }
    : { role: "progressbar", "aria-valuemin": 0, "aria-valuemax": total, "aria-valuenow": completed, "aria-label": `${completed} de ${total} ${noun}` };
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div {...bar} className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-success transition-[width] duration-(--duration-slow) ease-out motion-reduce:transition-none"
          style={{ width: `${part}%` }}
        />
      </div>
      <span className="shrink-0 text-caption tabular-nums text-muted-foreground">
        {completed} de {total}
        {insideLink && <span className="sr-only"> {noun}</span>}
      </span>
    </div>
  );
}
