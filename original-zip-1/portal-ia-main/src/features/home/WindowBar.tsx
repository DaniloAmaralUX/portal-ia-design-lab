import type { ReactNode } from "react";
import { WindowDots } from "@/components/WindowDots";

export function WindowBar({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-terminal-border px-3.5 py-2">
      <WindowDots />
      <span className="ml-2 font-mono text-micro text-terminal-muted">claude</span>
      {children}
    </div>
  );
}
