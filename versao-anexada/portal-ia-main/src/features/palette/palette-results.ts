import type { SearchHit } from "@/lib/site-search";
import { fold } from "@/lib/text";

export const LIMIT: Record<SearchHit["kind"], number> = { skill: 8, plugin: 4, academy: 6, training: 4, interval: 4, page: 4 };
export const GROUP: Record<SearchHit["kind"], string> = {
  skill: "Skills",
  plugin: "Plugins",
  academy: "Guias",
  training: "Treinamentos",
  interval: "Intervalos técnicos",
  page: "Páginas",
};

export function matches(query: string, text: string): boolean {
  const target = fold(text);
  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => target.includes(t));
}

// The hits in the order they came, in one group for each kind, each group kept to its limit.
export function groupHits(hits: SearchHit[]): { kind: SearchHit["kind"]; items: SearchHit[] }[] {
  const groups: { kind: SearchHit["kind"]; items: SearchHit[] }[] = [];
  for (const item of hits) {
    let group = groups.find((g) => g.kind === item.kind);
    if (!group) groups.push((group = { kind: item.kind, items: [] }));
    if (group.items.length < LIMIT[item.kind]) group.items.push(item);
  }
  return groups;
}
