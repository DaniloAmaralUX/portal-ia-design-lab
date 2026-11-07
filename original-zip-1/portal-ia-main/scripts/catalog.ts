import type { Plugin } from "vite";
import type { CatalogIndex, Release } from "../src/data/types.ts";
import { buildConfig } from "./build-config.ts";
import { generator, loadRelease, readSkillsFile } from "./skills-source.ts";

const INDEX = "virtual:catalog-index";
const CATALOG = "virtual:catalog";
const CHANGELOG = "virtual:changelog";
const SKILL_DOCS = "virtual:skill-docs";
const SKILL_DOC = "virtual:skill-doc/";

// The catalog in short: the plugins and the skills by name and title, the commit it came from, and the clone address and the
// channel of the build.
function lightIndex(release: Release): CatalogIndex {
  return {
    marketplace: release.marketplace.name,
    commit: release.commit,
    repoUrl: buildConfig().repoUrl,
    channel: buildConfig().channel,
    plugins: release.plugins.map((p) => ({ name: p.name, title: p.displayName, area: p.area, skills: p.skills })),
    skills: release.plugins.flatMap((p) => p.skills.map((slug) => ({ slug, plugin: p.name, title: release.skills.find((s) => s.slug === slug)?.title ?? "" }))),
  };
}

// The catalog the pages show: everything but the file list of each plugin (the downloads use it) and the changelog (its own module).
function pageCatalog(release: Release) {
  return { ...release, changelog: undefined, plugins: release.plugins.map(({ files: _files, ...plugin }) => plugin) };
}

// The skills repository is the only source of the catalog: the generator in it reads the release, and the files stay where they are.
export function catalog(): Plugin {
  const isOurs = (id: string) => id === INDEX || id === CATALOG || id === CHANGELOG || id === SKILL_DOCS || id.startsWith(SKILL_DOC);
  return {
    name: "pitang-catalog",
    resolveId(id) {
      return isOurs(id) ? `\0${id}` : undefined;
    },
    async load(id) {
      const name = id.startsWith("\0") ? id.slice(1) : "";
      if (!isOurs(name)) return undefined;
      const release = loadRelease();
      if (name === INDEX) return `export const catalogIndex = ${JSON.stringify(lightIndex(release))};\n`;
      if (name === CATALOG) return `export const release = ${JSON.stringify(pageCatalog(release))};\n`;
      if (name === CHANGELOG) return `export default ${JSON.stringify(release.changelog)};\n`;
      if (name === SKILL_DOCS) {
        const loaders = release.skills.map((s) => `${JSON.stringify(s.slug)}: () => import(${JSON.stringify(`${SKILL_DOC}${s.slug}`)})`);
        return `export const skillDocs = {\n${loaders.join(",\n")}\n};\n`;
      }
      const skill = release.skills.find((s) => s.slug === name.slice(SKILL_DOC.length));
      if (!skill) throw new Error(`${name} is not a skill of the catalog`);
      const { frontmatter, corpo } = (await generator()).separarSkill(readSkillsFile(`${skill.path}/SKILL.md`).toString("utf8"));
      return `export default ${JSON.stringify({ frontmatter, body: corpo.replace(/^\s+/, "") })};\n`;
    },
  };
}
