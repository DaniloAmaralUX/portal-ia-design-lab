import { describe, expect, it } from "vitest";
import { plugins, skills } from "@/data/catalog";
import { markdownFor, markdownPaths } from "./machine-readable";

describe("the Markdown of the pages", () => {
  it("has a page for every plugin and every skill of the catalog", async () => {
    const paths = await markdownPaths();
    for (const plugin of plugins) expect(paths, plugin.name).toContain(`/plugins/${plugin.name}.md`);
    for (const skill of skills) expect(paths, skill.slug).toContain(`/plugins/${skill.plugin}/${skill.slug}.md`);
  });

  it("writes the page of each skill with its examples, its effects and the SKILL.md read from the skills repository", async () => {
    for (const skill of skills) {
      const text = await markdownFor(`/plugins/${skill.plugin}/${skill.slug}.md`);
      expect(text, skill.slug).toContain(`# ${skill.title}`);
      expect(text, skill.slug).toContain(skill.example);
      expect(text, skill.slug).toContain("## O que ela faz no seu projeto");
      expect(text, skill.slug).toContain("## SKILL.md");
      expect(text?.split("## SKILL.md")[1]?.trim().length, skill.slug).toBeGreaterThan(200);
    }
  });

  it("writes the page of each plugin with its skills and what it expects", async () => {
    for (const plugin of plugins) {
      const text = await markdownFor(`/plugins/${plugin.name}.md`);
      expect(text, plugin.name).toContain(`# ${plugin.displayName}`);
      for (const expected of plugin.expects) expect(text, plugin.name).toContain(expected);
    }
  });
});
