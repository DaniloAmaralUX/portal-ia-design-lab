import { useRef, useState, type ReactNode } from "react";
export function GlideMenu({ children, className = "", highlightClassName = "", rowSelector = "[data-menu-row]" }: { children: ReactNode; className?: string; highlightClassName?: string; rowSelector?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; height: number } | null>(null);
  return <div ref={host} className={`relative group/glide-menu ${className}`} onPointerLeave={() => setPosition(null)} onPointerMove={event => {
    const row = (event.target as Element).closest<HTMLElement>(rowSelector);
    if (row && host.current) { const a = row.getBoundingClientRect(), b = host.current.getBoundingClientRect(); setPosition({ top: a.top - b.top, height: a.height }); }
  }}>{position && <span aria-hidden className={`pointer-events-none absolute left-0 right-0 transition-[top,height] duration-150 ${highlightClassName || "rounded-lg bg-hover"}`} style={position} />}{children}</div>;
}
