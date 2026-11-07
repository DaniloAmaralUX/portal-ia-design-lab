import { useEffect, useState, type RefObject } from "react";

const INTERACTIVE = "a[href], button, input, select, textarea";

// With skipInteractive, an element that holds links or controls does not count as overflowing: its content is already reachable, so it needs no focus stop.
export function useOverflow(ref: RefObject<HTMLElement | null>, { skipInteractive = false } = {}) {
  const [state, setState] = useState({ overflows: false, moreRight: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const overflows = el.scrollWidth > el.clientWidth + 1 && !(skipInteractive && el.querySelector(INTERACTIVE));
      const moreRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setState((prev) => (prev.overflows === overflows && prev.moreRight === moreRight ? prev : { overflows, moreRight }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    // A web font that arrives after the first measure widens the text without resizing the box the observer watches.
    document.fonts.addEventListener("loadingdone", measure);
    void document.fonts.ready.then(measure);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [ref, skipInteractive]);
  return state;
}
