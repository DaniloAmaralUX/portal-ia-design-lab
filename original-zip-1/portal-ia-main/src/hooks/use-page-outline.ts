import { useCallback, useState } from "react";
import type { TocItem } from "@/components/toc-groups";

// The outline of a page written by hand, read from its own headings when the page attaches, so the titles are written once, in
// the sections themselves. The ref goes on the element that holds the headings.
export function usePageOutline(selector = "h2[id]"): { ref: (el: HTMLElement | null) => void; items: TocItem[] } {
  const [items, setItems] = useState<TocItem[]>([]);
  const ref = useCallback(
    (el: HTMLElement | null) => {
      if (el) setItems([...el.querySelectorAll<HTMLElement>(selector)].map((h) => ({ id: h.id, text: h.textContent?.trim() ?? "" })));
    },
    [selector],
  );
  return { ref, items };
}
