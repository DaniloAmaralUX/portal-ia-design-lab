import { describe, expect, it } from "vitest";
import { areas } from "./areas";
import { catalogPlugins, catalogSkills, CATALOG_COMMIT, MARKETPLACE_NAME, MARKETPLACE_URL, pluginsOfArea, REPO_WEB_URL } from "./catalog-index";
import { plugins, skills } from "./catalog";

describe("the light catalog index", () => {
  it("lists the same plugins as the catalog, in the same order, with name, title, area and skills", () => {
    expect(catalogPlugins).toEqual(plugins.map((p) => ({ name: p.name, title: p.displayName, area: p.area, skills: p.skills })));
  });

  it("lists the same skills as the catalog, in the same order, with slug, plugin and title", () => {
    expect(catalogSkills).toEqual(skills.map((s) => ({ slug: s.slug, plugin: s.plugin, title: s.title })));
  });

  it("names the marketplace and the commit the catalog was built from", () => {
    expect(MARKETPLACE_NAME).toBeTruthy();
    expect(CATALOG_COMMIT).toMatch(/^[0-9a-f]{7,}$/);
    expect(REPO_WEB_URL).toBe(MARKETPLACE_URL.replace(/\.git$/, ""));
  });

  it("puts each plugin in the area the skills repository gives it, and every plugin in one area", () => {
    const placed = areas.flatMap((a) => pluginsOfArea(a.id));
    expect([...placed].sort()).toEqual(plugins.map((p) => p.name).sort());
    for (const plugin of plugins) expect(pluginsOfArea(plugin.area)).toContain(plugin.name);
  });
});
