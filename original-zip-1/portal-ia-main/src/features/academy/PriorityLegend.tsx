import { cn } from "@/lib/utils";
import { PriorityBadge } from "./PriorityBadge";
import { PRIORITIES } from "./training";

export function PriorityLegend({ className }: { className?: string }) {
  return (
    <dl className={cn("grid gap-x-4 gap-y-2 text-small sm:grid-cols-[auto_minmax(0,1fr)]", className)}>
      {PRIORITIES.map((c) => (
        <div key={c.id} className="contents">
          <dt className="pt-px">
            <PriorityBadge priority={c.id} />
          </dt>
          <dd className="mb-2 text-foreground/85 sm:mb-0">{c.when.charAt(0).toUpperCase() + c.when.slice(1)}.</dd>
        </div>
      ))}
    </dl>
  );
}
