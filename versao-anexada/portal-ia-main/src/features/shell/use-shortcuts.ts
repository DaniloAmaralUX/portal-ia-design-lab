import { useEffect } from "react";
import { useUi } from "@/store/ui";

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function useGlobalShortcuts() {
  const setPaletteOpen = useUi((s) => s.setPaletteOpen);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!useUi.getState().paletteOpen);
        return;
      }
      if (e.key === "/" && !isTyping(e.target) && !useUi.getState().paletteOpen) {
        e.preventDefault();
        const field = document.querySelector<HTMLInputElement>("[data-page-search]");
        if (field) {
          field.focus();
          field.select();
        } else {
          setPaletteOpen(true);
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setPaletteOpen]);
}
