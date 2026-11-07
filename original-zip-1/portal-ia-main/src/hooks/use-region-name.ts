import { useLayoutEffect, useState, type RefObject } from "react";

// A screen reader lists the regions of a page by their names, and two with the same name read as one. A region that shares its name
// with others, as two tables or two blocks of JSON, takes its place among them, from the second on.
export function useRegionName(ref: RefObject<HTMLElement | null>, label: string, active: boolean): string {
  const [name, setName] = useState(label);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const same = [...document.querySelectorAll(`[data-region-name="${CSS.escape(label)}"]`)];
    const at = same.indexOf(el);
    setName(at > 0 ? `${label} (${at + 1})` : label);
  }, [ref, label, active]);
  return name;
}
