import type { ReactNode } from "react";
import { CatalystCycle } from "./CatalystCycle";
import { CatalystRadar } from "./CatalystRadar";
import { OpenSpecFlow } from "./OpenSpecFlow";
import { figureName } from "./figure-name";

// Each figure takes the text of the image that calls it, which says what it shows, for whoever cannot see it.
const FIGURES: Record<string, (label: string) => ReactNode> = {
  "catalyst-ciclo": (label) => <CatalystCycle label={label} />,
  "catalyst-radar": (label) => <CatalystRadar label={label} />,
  "openspec-fluxo": (label) => <OpenSpecFlow label={label} />,
};

export const figureNames = Object.keys(FIGURES);

export function isFigure(src: string): boolean {
  const name = figureName(src);
  return name !== null && Object.hasOwn(FIGURES, name);
}

// The figure an image of a guide calls, or null for an image that is a file.
export function figureOf(src: string, label: string): ReactNode {
  const name = figureName(src);
  const draw = name !== null && Object.hasOwn(FIGURES, name) ? FIGURES[name] : undefined;
  return draw ? draw(label) : null;
}
