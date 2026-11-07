import { useEffect } from "react";
import { useUi } from "@/store/ui";

const SPY_TOP = 112;

export function useActiveSection(ids: string[]) {
  const key = ids.join(" ");
  useEffect(() => {
    const list = key ? key.split(" ") : [];
    if (!list.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= SPY_TOP) current = id;
      }
      const end = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      useUi.getState().setActiveSection(end ? (list.at(-1) ?? null) : current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      useUi.getState().setActiveSection(null);
    };
  }, [key]);
}
