import { useState, type MouseEventHandler } from "react";
import { MorphIcon, type IconNode } from "morphicons/react";
import { useCraft } from "./craft-context";

// Lucide icon data stays separate from lucide-react components. Each consumer owns its label.
export function StateIcon({ icon, instant = false, className }: { icon: IconNode; instant?: boolean; className?: string }) {
  const { stiffness, damping } = useCraft();
  return <MorphIcon icon={icon} spring={{ stiffness, damping }} reducedMotion={instant ? "always" : "user"} className={className} strokeWidth={1.75} aria-hidden />;
}

// A keyboard click has detail=0. Keep its feedback immediate, including asynchronous confirmations.
export function usePointerFeedback() {
  const [instant, setInstant] = useState(true);
  const record: MouseEventHandler<HTMLElement> = (event) => setInstant(event.detail === 0);
  return { instant, record };
}
