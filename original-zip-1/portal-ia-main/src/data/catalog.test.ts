import { describe, expect, it } from "vitest";
import { plugins, skills } from "./catalog";

describe("the catalog", () => {
  it("lists each plugin's skills in the order the plugin gives, and every skill once", () => {
    expect(skills.map((s) => s.slug)).toEqual(plugins.flatMap((p) => p.skills));
    expect(new Set(skills.map((s) => s.slug)).size).toBe(skills.length);
    expect(skills.filter((s) => !plugins.some((p) => p.name === s.plugin)).map((s) => s.slug)).toEqual([]);
  });

  it("carries the metadata the skills repository declares, with no required field left empty", () => {
    for (const s of skills) {
      for (const field of ["title", "example", "output", "description", "creator", "updatedAt"] as const) expect(s[field], `${s.slug}.${field}`).toBeTruthy();
      for (const field of ["effects", "files"] as const) expect(s[field].length, `${s.slug}.${field}`).toBeGreaterThan(0);
      // Who contributed is optional in the skills repository: only whom the team decided to credit.
      expect(Array.isArray(s.contributors), `${s.slug}.contributors`).toBe(true);
    }
    for (const p of plugins) {
      for (const field of ["displayName", "version", "area", "lifecycle", "tagline", "audience", "creator", "intro", "updatedAt"] as const) expect(p[field], `${p.name}.${field}`).toBeTruthy();
      expect(p.expects.length, p.name).toBeGreaterThan(0);
      expect(Array.isArray(p.contributors), p.name).toBe(true);
    }
  });

  it("the plugin is Pitang's, and each skill names the person who created it", () => {
    expect(plugins.filter((p) => p.creator !== "Pitang").map((p) => p.name)).toEqual([]);
    expect(skills.filter((s) => s.creator.trim().toLowerCase() === "pitang").map((s) => s.slug)).toEqual([]);
  });

  it("every skill that triggers on its own says when to use it, in a sentence starting with Use", () => {
    expect(skills.filter((s) => !s.manual && !s.whenToUse).map((s) => s.slug)).toEqual([]);
  });

  it("every dependency points to a skill in the catalog", () => {
    const slugs = new Set(skills.map((s) => s.slug));
    expect(skills.flatMap((s) => s.requires.filter((r) => !slugs.has(r)).map((r) => `${s.slug} -> ${r}`))).toEqual([]);
  });

  it("each plugin's tracks cite only its own skills, and all of them", () => {
    for (const plugin of plugins) {
      const inTracks = plugin.tracks.flatMap((t) => t.steps.flat());
      expect(new Set(inTracks), plugin.name).toEqual(new Set(plugin.skills));
    }
  });

  it("a skill that takes no room in the skill list is manual, and the others cost their name and description", () => {
    for (const skill of skills) {
      expect(skill.listChars === null, skill.slug).toBe(skill.manual);
      if (!skill.manual) expect(skill.listChars, skill.slug).toBe([...skill.slug].length + [...skill.description].length);
    }
  });
});
