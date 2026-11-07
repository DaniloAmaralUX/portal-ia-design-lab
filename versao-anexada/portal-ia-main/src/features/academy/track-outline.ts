import type { TocGroup } from "@/components/toc-groups";
import { platformOf } from "./courses";
import { PHASES, type PlatformTrack } from "./training";

export function phaseId(platform: string, index: number): string {
  return `${platform}-fase-${index + 1}`;
}

// The outline of a track: the time table, each platform with the phases it has, and what comes after the courses.
export function trackOutline(platforms: PlatformTrack[]): TocGroup[] {
  return [
    { items: [{ id: "tempo-da-trilha", text: "Tempo da trilha" }] },
    ...platforms.map((track) => ({
      label: { text: platformOf(track.platform).name, id: track.platform },
      items: PHASES.flatMap((phase, i) =>
        track.phases[phase.id].length ? [{ id: phaseId(track.platform, i), text: phase.name, context: platformOf(track.platform).name }] : [],
      ),
    })),
    { items: [{ id: "depois-dos-cursos", text: "Depois dos cursos" }] },
  ];
}
