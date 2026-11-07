import { useCallback, useEffect, useState } from "react";

// The whole document goes full screen, and not one element of it, so the tooltips and the toasts, which the page portals to the
// body, still show on top.
export function useFullscreen() {
  const [active, setActive] = useState(() => Boolean(document.fullscreenElement));
  useEffect(() => {
    const sync = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  // The browser may refuse (no permission in a frame, a phone without the API): the presentation goes on in the window.
  const toggle = useCallback(() => {
    if (!document.fullscreenEnabled) return;
    const change = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    change.catch(() => undefined);
  }, []);
  const exit = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
  }, []);
  return { supported: Boolean(document.fullscreenEnabled), active, toggle, exit };
}
