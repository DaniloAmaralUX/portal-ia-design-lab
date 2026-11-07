import { useEffect, useRef, type ReactNode } from "react";
import { outlineTitle } from "@/components/outline-class";
import { fadeBelow, useMoreBelow } from "@/hooks/use-more-below";
import { cn, scrollActiveIntoView } from "@/lib/utils";

// The outline in the column on the right of the text, fixed while the page scrolls. When the mark moves (the section the reading
// is on, or the chapter that opened), the column scrolls to keep it in sight.
export function OutlineRail({ label, className, follow, children }: { label: string; className?: string; follow?: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const placed = useRef(false);
  const more = useMoreBelow(box);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    // The column takes its place at once when the page opens, and glides after the reading (scroll-smooth, which the reduced
    // motion turns off).
    scrollActiveIntoView(el, el.querySelector('[aria-current="true"]') ? '[aria-current="true"]' : '[aria-current="page"]', placed.current ? "auto" : "instant");
    placed.current = true;
  }, [follow]);
  return (
    <aside aria-label={label} className={className}>
      <div
        ref={box}
        data-more={more}
        className={cn(
          // No overscroll-contain, as in the menu of the section (DocsLayout): the wheel over the outline goes on to the page.
          "sticky top-24 -m-1 max-h-[calc(100dvh-7rem)] scroll-smooth overflow-y-auto p-1 pb-6 [scrollbar-width:thin] [view-transition-class:fixed] [view-transition-name:page-outline]",
          more && fadeBelow,
        )}
      >
        <p className={outlineTitle}>{label}</p>
        {children}
      </div>
    </aside>
  );
}
