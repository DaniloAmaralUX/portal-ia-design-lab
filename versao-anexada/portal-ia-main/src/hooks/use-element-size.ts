import { useCallback, useState } from "react";

export type Size = { width: number; height: number };

// The size of an element, scroll bar included, through the ref this returns: a scroll bar that shows does not change it, so
// whoever lays the page out by it does not do it again for that. The first size is read when the element attaches: the observer
// reports only on the next frame, and not at all while the tab is hidden. The next sizes wait for the resize to stop.
export function useElementSize<T extends HTMLElement>(settle = 120): [(el: T | null) => (() => void) | undefined, Size | null] {
  const [size, setSize] = useState<Size | null>(null);
  const ref = useCallback(
    (el: T | null) => {
      if (!el) return undefined;
      const read = () => setSize((prev) => (prev?.width === el.offsetWidth && prev.height === el.offsetHeight ? prev : { width: el.offsetWidth, height: el.offsetHeight }));
      read();
      let timer = 0;
      const observer = new ResizeObserver(() => {
        window.clearTimeout(timer);
        timer = window.setTimeout(read, settle);
      });
      observer.observe(el);
      return () => {
        observer.disconnect();
        window.clearTimeout(timer);
      };
    },
    [settle],
  );
  return [ref, size];
}
