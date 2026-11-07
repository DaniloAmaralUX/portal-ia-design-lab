import { areas } from "@/data/areas";
import { findPlugin } from "@/data/catalog-index";
import { MODES, type Mode } from "@/data/modes";
import type { AreaId } from "@/data/types";
import { oneOf } from "@/lib/utils";

// The address of the catalog and what it keeps. This file imports nothing heavy, because the route reads it on every page, to validate the address.
export const ORDERS = ["relevancia", "plugin", "az"] as const;
export type Order = (typeof ORDERS)[number];

// The search keys are part of the page address, so they stay in Portuguese and old links keep their filters.
export type ExploreSearch = {
  q?: string;
  area?: AreaId;
  plugin?: string;
  modo?: Mode;
  ordem?: Order;
};

const AREA_IDS = areas.map((a) => a.id);
const MODE_IDS = Object.keys(MODES) as Mode[];

export function validateExploreSearch(search: Record<string, unknown>): ExploreSearch {
  return {
    q: typeof search.q === "string" && search.q.trim() ? search.q : undefined,
    area: oneOf(search.area, AREA_IDS),
    plugin: typeof search.plugin === "string" && findPlugin(search.plugin) ? search.plugin : undefined,
    modo: oneOf(search.modo, MODE_IDS),
    ordem: oneOf(search.ordem, ORDERS),
  };
}
