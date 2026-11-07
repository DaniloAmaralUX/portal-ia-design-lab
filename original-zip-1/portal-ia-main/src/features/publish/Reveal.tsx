import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Opens and closes by height and opacity, with the content kept in the DOM. Closed, it is inert, so its fields take no focus and
// the screen reader skips them. The padding is inside so a closed block leaves no gap in a space-y stack, and the negative margin
// keeps the focus ring of a field from being clipped by the overflow.
export function Reveal({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-(--duration-base) ease-(--ease-out-soft)",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div inert={!open} className="-mx-1 min-h-0 overflow-hidden px-1 pb-1">
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}
