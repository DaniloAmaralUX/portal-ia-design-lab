import { useEffect, useState, type RefObject } from "react";

// Whether a box that scrolls hides more of its content below, measured again on its scroll and when it or its content change
// size. The box fades at the bottom while it does (the outline on the right, the results of the palette), as the wide table does
// on its side (ScrollableTable): with the scrollbars that only show while scrolling, the cut would look like the end of the list.
export function useMoreBelow(ref: RefObject<HTMLElement | null>): boolean {
  const [more, setMore] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [ref]);
  return more;
}

export const fadeBelow = "[mask-image:linear-gradient(to_bottom,black_calc(100%-2.5rem),transparent)]";
