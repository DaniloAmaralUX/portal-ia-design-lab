import { areas } from "@/data/areas";
import type { AreaId } from "@/data/types";
import { oneOf } from "@/lib/utils";

// The search key is part of the page address, so it stays in Portuguese.
export type IntervalsSearch = { area?: AreaId };

const AREA_IDS = areas.map((a) => a.id);

export function validateIntervalsSearch(search: Record<string, unknown>): IntervalsSearch {
  return { area: oneOf(search.area, AREA_IDS) };
}
