import { useEffect, useState, type ReactNode } from "react";
import { PointerMotionContext } from "./craft-context";

export function CraftProvider({ children }: { children: ReactNode }) {
  const [pointer, setPointer] = useState(false);
  useEffect(() => {
    const onPointer = () => setPointer(true);
    const onKey = () => setPointer(false);
    window.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("keydown", onKey, true);
    };
  }, []);
  return <PointerMotionContext.Provider value={pointer}>{children}</PointerMotionContext.Provider>;
}
