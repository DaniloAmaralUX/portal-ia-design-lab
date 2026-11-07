import { createContext, useContext } from "react";

export const CRAFT_DEFAULTS = {
  stiffness: 460,
  damping: 38,
  duration: 180,
  distance: 6,
  magnetic: 3,
};

export const CraftContext = createContext(CRAFT_DEFAULTS);
export const CraftControlsContext = createContext<(() => void) | null>(null);
export const PointerMotionContext = createContext(false);
export const useCraft = () => useContext(CraftContext);
export const usePointerMotion = () => useContext(PointerMotionContext);
