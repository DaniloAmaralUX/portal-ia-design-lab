import type { ReactNode } from "react";
import { DialRoot, useDialKitController } from "dialkit";
import "dialkit/styles.css";
import { useUi } from "@/store/ui";
import { CRAFT_DEFAULTS, CraftContext, CraftControlsContext } from "./craft-context";

const config = {
  "Rigidez": [CRAFT_DEFAULTS.stiffness, 240, 640, 10] as [number, number, number, number],
  "Amortecimento": [CRAFT_DEFAULTS.damping, 28, 56, 1] as [number, number, number, number],
  "Duração (ms)": [CRAFT_DEFAULTS.duration, 100, 260, 10] as [number, number, number, number],
  "Deslocamento (px)": [CRAFT_DEFAULTS.distance, 0, 10, 1] as [number, number, number, number],
  "Magnetismo (px)": [CRAFT_DEFAULTS.magnetic, 0, 4, 0.5] as [number, number, number, number],
};

// Development only. All sliders drive real interactions; no shortcuts or persisted overrides.
export function CraftTuning({ children }: { children: ReactNode }) {
  const controls = useDialKitController("Movimento do portal", config, { id: "portal-craft" });
  const p = controls.values;
  const theme = useUi((s) => s.theme);
  const settings = {
    stiffness: p.Rigidez,
    damping: p.Amortecimento,
    duration: p["Duração (ms)"],
    distance: p["Deslocamento (px)"],
    magnetic: p["Magnetismo (px)"],
  };
  return (
    <CraftContext.Provider value={settings}>
      <CraftControlsContext.Provider value={() => controls.setOpen(true)}>
      {children}
      <DialRoot position="bottom-left" defaultOpen={false} theme={theme} versions="menu" />
      </CraftControlsContext.Provider>
    </CraftContext.Provider>
  );
}
