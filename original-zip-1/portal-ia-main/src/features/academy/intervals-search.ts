import { areas } from "@/data/areas";
import type { AreaId } from "@/data/types";
import { parseAsStringLiteral } from "nuqs/server";

// The search key is part of the page address, so it stays in Portuguese.
export type IntervalsSearch = { area?: AreaId };

const areaParser = parseAsStringLiteral(areas.map((a) => a.id));

export function validateIntervalsSearch(search: Record<string, unknown>): IntervalsSearch {
  return { area: typeof search.area === "string" ? areaParser.parse(search.area) ?? undefined : undefined };
}
