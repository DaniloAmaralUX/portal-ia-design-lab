import { useEffect, useState, type RefObject } from "react";

// Whether a motion that plays by itself may play now: only while it is on screen and the tab is in front, and never while the pointer
// is over it or the focus is in it, so whoever reads it reads it still. It is the pause of WCAG 2.2.2 with no button. With reduced
// motion, nothing plays.
export function usePlayGate(ref: RefObject<HTMLElement | null>, still: boolean) {
  const [running, setRunning] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (still || !element) return;
    let onScreen = false;
    let pointer = false;
    let focus = false;
    const update = () => {
      setHeld(pointer || focus);
      setRunning(onScreen && !document.hidden && !pointer && !focus);
    };
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      update();
    });
    const enter = () => {
      pointer = true;
      update();
    };
    const leave = () => {
      pointer = false;
      update();
    };
    const focusIn = () => {
      focus = true;
      update();
    };
    const focusOut = (event: FocusEvent) => {
      focus = event.relatedTarget instanceof Node && element.contains(event.relatedTarget);
      update();
    };
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    element.addEventListener("pointerenter", enter);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("focusin", focusIn);
    element.addEventListener("focusout", focusOut);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      element.removeEventListener("pointerenter", enter);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("focusin", focusIn);
      element.removeEventListener("focusout", focusOut);
    };
  }, [ref, still]);

  return { running, held };
}
