import type { ReactNode } from "react";

export function StickyAside({ children }: { children: ReactNode }) {
  return (
    <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:-m-1 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:scroll-py-1 lg:overflow-y-auto lg:p-1 lg:[scrollbar-width:thin]">
      {children}
    </aside>
  );
}
