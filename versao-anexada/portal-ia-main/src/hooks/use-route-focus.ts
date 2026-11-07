import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

export function focusRegion(id: string, options?: FocusOptions) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute("tabindex")) {
    el.setAttribute("tabindex", "-1");
    const drop = () => {
      el.removeAttribute("tabindex");
      el.removeEventListener("blur", drop);
      el.removeEventListener("pointerdown", drop, true);
    };
    el.addEventListener("blur", drop);
    el.addEventListener("pointerdown", drop, true);
  }
  el.focus(options);
}

export function useRouteFocus(targetId: string) {
  const pathname = useRouterState({ select: (s) => s.resolvedLocation?.pathname });
  const last = useRef(pathname);

  useEffect(() => {
    if (pathname === undefined) return;
    const previous = last.current;
    last.current = pathname;
    if (previous === undefined || previous === pathname) return;
    let frame = 0;
    // A dialog open over the page (the palette, the presentation) hides the region until it closes. A dialog that puts the focus
    // inside the region when it closes, as the presentation does on the section of its last slide, keeps it there.
    const focus = (waited: boolean) => {
      const target = document.getElementById(targetId);
      if (target?.closest("[aria-hidden=true]")) frame = requestAnimationFrame(() => focus(true));
      else if (!(waited && target?.contains(document.activeElement))) focusRegion(targetId, { preventScroll: true });
    };
    focus(false);
    return () => cancelAnimationFrame(frame);
  }, [pathname, targetId]);
}
