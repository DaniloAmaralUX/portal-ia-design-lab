import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

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
      <p role="status" className="sr-only">
        {visible && loading ? "Carregando…" : ""}
      </p>
    </>
  );
}
