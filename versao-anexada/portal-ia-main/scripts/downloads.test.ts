import { unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { zipName } from "../src/shared/zip-name.ts";
import { buildZips } from "./downloads.ts";
import { loadRelease, readSkillsFile } from "./skills-source.ts";

const release = loadRelease();
const zips = buildZips();
const entries = (name: string) => unzipSync(zips.get(name) ?? new Uint8Array());

describe("the downloads", () => {
  it("has one zip for each plugin and one for each skill, named in one place", () => {
    const expected = [
      ...release.plugins.map((p) => zipName(p.name, p.version)),
      ...release.skills.map((s) => zipName(s.slug, release.plugins.find((p) => p.name === s.plugin)?.version ?? "")),
    ];
    expect([...zips.keys()].sort()).toEqual([...new Set(expected)].sort());
  });

  it("puts in a plugin's zip the files the skills repository keeps for it, byte for byte, and nothing else", () => {
    for (const plugin of release.plugins) {
      const files = entries(zipName(plugin.name, plugin.version));
      expect(Object.keys(files).sort(), plugin.name).toEqual(plugin.files.map((f) => `${plugin.name}/${f}`).sort());
      const readme = files[`${plugin.name}/README.md`];
      expect(Buffer.from(readme ?? []).equals(readSkillsFile(`${plugin.path}/README.md`)), plugin.name).toBe(true);
    }
  });

  it("puts in a skill's zip its folder and the folders of the skills it requires", () => {
    for (const skill of release.skills) {
      const version = release.plugins.find((p) => p.name === skill.plugin)?.version ?? "";
      const files = entries(zipName(skill.slug, version));
      const wanted = [skill.slug, ...skill.requires].flatMap((slug) => (release.skills.find((s) => s.slug === slug)?.files ?? []).map((f) => `${slug}/${f}`));
      expect(Object.keys(files).sort(), skill.slug).toEqual(wanted.sort());
      expect(Buffer.from(files[`${skill.slug}/SKILL.md`] ?? []).equals(readSkillsFile(`${skill.path}/SKILL.md`)), skill.slug).toBe(true);
    }
  });

  it("gives the same bytes every time the same release is built", () => {
    const again = buildZips();
    for (const [name, zip] of zips) expect(Buffer.from(again.get(name) ?? []).equals(Buffer.from(zip)), name).toBe(true);
  });
});
