import { Arc } from "loading-dev";
import { useReducedMotion } from "motion/react";

export function LoadingIndicator({ label = "Carregando conteúdo…" }: { label?: string }) {
  const reduced = useReducedMotion();
  return <span role="status" className="inline-flex items-center gap-2 text-caption text-muted-foreground"><span aria-hidden><Arc size={16} playState={reduced ? "paused" : "running"} /></span>{label}</span>;
}
