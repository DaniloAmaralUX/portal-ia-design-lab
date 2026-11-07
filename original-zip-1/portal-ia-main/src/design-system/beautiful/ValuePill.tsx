import type { ReactNode } from "react";
export function ValuePill({ children, tone }: { children: ReactNode; tone?: string }) { return <span className="rounded-md bg-field px-1.5" style={tone ? { color: `var(--${tone})` } : undefined}>{children}</span>; }
