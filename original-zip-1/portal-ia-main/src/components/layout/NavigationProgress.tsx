import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Arc } from "loading-dev";

const SHOW_DELAY = 250;
const EXIT_DURATION = 300;

export function NavigationProgress() {
  const loading = useRouterState({ select: (s) => s.status === "pending" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(loading), loading ? SHOW_DELAY : EXIT_DURATION);
    return () => clearTimeout(id);
  }, [loading]);

  const phase = loading ? "loading" : "arrived";
  return (
    <>
      {visible && <div aria-hidden data-phase={phase} className="navigation-progress pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 bg-primary" />}
      {visible && loading && (
        <div aria-hidden className="pointer-events-none fixed right-4 top-20 z-[70] flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-caption text-muted-foreground shadow-sm">
          <Arc size={16} />
          <span>Carregando…</span>
        </div>
      )}
      <p role="status" className="sr-only">
        {visible && loading ? "Carregando…" : ""}
      </p>
    </>
  );
}
