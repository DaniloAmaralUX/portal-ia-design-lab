import { useRef, type ReactNode } from "react";
import { useOverflow } from "@/hooks/use-overflow";
import { useRegionName } from "@/hooks/use-region-name";
import { cn } from "@/lib/utils";

export function ScrollableTable({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { overflows: focusable, moreRight } = useOverflow(ref, { skipInteractive: true });
  const name = useRegionName(ref, label, focusable);

  return (
    <div
      ref={ref}
      tabIndex={focusable ? 0 : undefined}
      role={focusable ? "region" : undefined}
      aria-label={focusable ? name : undefined}
      data-region-name={focusable ? label : undefined}
      className={cn(
        "overflow-x-auto focus-visible:-outline-offset-2",
        moreRight && "[mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
