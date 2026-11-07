import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCraft } from "@/components/craft/craft-context";
import { cn } from "@/lib/utils";
import { pickNearest, type ItemRect } from "./pick-nearest";

// Adapted from Fluid Functionalism's measured hover highlight. Links remain links, not tabs.
export function FluidGroup({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const rects = useRef<ItemRect[]>([]);
  const [highlight, setHighlight] = useState<{ index: number; rect: ItemRect } | null>(null);
  const { stiffness, damping } = useCraft();
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const el = container.current;
    if (!el) return;
    const measure = () => {
      const parent = el.getBoundingClientRect();
      rects.current = Array.from(el.querySelectorAll<HTMLElement>("[data-fluid-item]")).map((item) => {
        const r = item.getBoundingClientRect();
        return { left: r.left - parent.left + el.scrollLeft, top: r.top - parent.top + el.scrollTop, width: r.width, height: r.height };
      });
      setHighlight(null);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.querySelectorAll("[data-fluid-item]").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [children]);

  const rect = highlight?.rect;
  return (
    <div
      ref={container}
      aria-label={label}
      className={cn("relative isolate", className)}
      onPointerMove={(event) => {
        const el = container.current;
        if (!el || event.pointerType !== "mouse") return;
        const parent = el.getBoundingClientRect();
        const index = pickNearest({ axis: "xy", point: { x: event.clientX, y: event.clientY }, rects: rects.current, containerRect: parent, scroll: { x: el.scrollLeft, y: el.scrollTop }, border: { x: 0, y: 0 }, layoutSize: { width: el.offsetWidth, height: el.offsetHeight } });
        const r = index === null ? undefined : rects.current[index];
        const x = event.clientX - parent.left + el.scrollLeft;
        const y = event.clientY - parent.top + el.scrollTop;
        // Gaps never look clickable. No synthetic click routing or change to keyboard behavior.
        if (r && index !== null && x >= r.left && x <= r.left + r.width && y >= r.top && y <= r.top + r.height) {
          setHighlight((previous) => previous?.index === index ? previous : { index, rect: { ...r } });
        } else setHighlight(null);
      }}
      onPointerLeave={() => setHighlight(null)}
      onFocusCapture={() => setHighlight(null)}
    >
      <AnimatePresence>
        {rect && <motion.span aria-hidden data-slot="fluid-hover-highlight" className="pointer-events-none absolute left-0 top-0 -z-10 rounded-[inherit] bg-accent" initial={{ opacity: 0, x: rect.left, y: rect.top, width: rect.width, height: rect.height }} animate={{ opacity: 1, x: rect.left, y: rect.top, width: rect.width, height: rect.height }} exit={{ opacity: 0, transition: { duration: 0.06 } }} transition={reduce ? { duration: 0 } : { type: "spring", stiffness, damping, opacity: { duration: 0.08 } }} />}
      </AnimatePresence>
      {children}
    </div>
  );
}
