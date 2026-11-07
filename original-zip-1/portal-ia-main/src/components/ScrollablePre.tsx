import { useRef, type ComponentProps } from "react";
import { useOverflow } from "@/hooks/use-overflow";
import { useRegionName } from "@/hooks/use-region-name";
import { cn } from "@/lib/utils";

export function ScrollablePre({ label, className, ...props }: ComponentProps<"pre"> & { label: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const { overflows } = useOverflow(ref);
  const name = useRegionName(ref, label, overflows);

  return (
    <pre
      ref={ref}
      tabIndex={overflows ? 0 : undefined}
      role={overflows ? "region" : undefined}
      aria-label={overflows ? name : undefined}
      data-region-name={overflows ? label : undefined}
      className={cn("focus-visible:-outline-offset-2", className)}
      {...props}
    />
  );
}
