import { skills } from "@/data/catalog";
import { areaIdOf } from "@/data/catalog-index";
import { modeOf } from "@/data/modes";
import type { Skill } from "@/data/types";
import { searchSkills } from "@/lib/site-search";
import type { ExploreSearch, Order } from "./explore-search";

const POSITION = new Map(skills.map((s, i) => [s.slug, i]));

// The skills the filters of the address keep, searched by what the person typed, in the order they chose.
export function filterSkills(search: ExploreSearch, query: string, hasQuery: boolean, order: Order): Skill[] {
  let out = skills;
  if (search.area) out = out.filter((s) => areaIdOf(s.plugin) === search.area);
  if (search.plugin) out = out.filter((s) => s.plugin === search.plugin);
  if (search.modo) out = out.filter((s) => modeOf(s) === search.modo);
  if (hasQuery) out = searchSkills(query, out);
  if (order === "plugin") out = [...out].sort((a, b) => (POSITION.get(a.slug) ?? 0) - (POSITION.get(b.slug) ?? 0));
  if (order === "az") out = [...out].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  return out;
}
