import { findPlugin } from "@/data/catalog-index";

export type PluginsSearch = { kit?: string };

export function validatePluginsSearch(search: Record<string, unknown>): PluginsSearch {
  const kit = typeof search.kit === "string" ? search.kit.split(",").filter((n) => findPlugin(n)).join(",") : "";
  return kit ? { kit } : {};
}
