import { catalogIndex } from "virtual:catalog-index";
import type { Area, AreaId, CatalogPlugin, CatalogSkill } from "./types";

export const MARKETPLACE_URL = catalogIndex.repoUrl;
export const MARKETPLACE_CHANNEL = catalogIndex.channel;
export const MARKETPLACE_NAME = catalogIndex.marketplace;
export const CATALOG_COMMIT = catalogIndex.commit;
export const REPO_WEB_URL = MARKETPLACE_URL.replace(/\.git$/, "");

export const catalogPlugins: CatalogPlugin[] = catalogIndex.plugins;
export const catalogSkills: CatalogSkill[] = catalogIndex.skills;

const pluginIndex = new Map(catalogPlugins.map((p) => [p.name, p]));
const skillIndex = new Map(catalogSkills.map((s) => [s.slug, s]));

export function findPlugin(name: string): CatalogPlugin | undefined {
  return pluginIndex.get(name);
}

export function findSkill(slug: string): CatalogSkill | undefined {
  return skillIndex.get(slug);
}

export function areaIdOf(pluginName: string): AreaId {
  const plugin = pluginIndex.get(pluginName);
  if (!plugin) throw new Error(`Unknown plugin: ${pluginName}`);
  return plugin.area;
}

export function pluginsOfArea(area: AreaId): string[] {
  return catalogPlugins.filter((p) => p.area === area).map((p) => p.name);
}

export function skillCountIn(area: Area): number {
  return catalogSkills.filter((s) => areaIdOf(s.plugin) === area.id).length;
}
