import { release } from "virtual:catalog";
import { skillDocs } from "virtual:skill-docs";
import { areaById } from "./areas";
import { skillBadge } from "./changelog";
import { skillNamesIn } from "@/lib/skill-name";
import type { Area, Plugin, Skill } from "./types";

const SENTENCE = /(?<=\.)\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/;
const PLUGIN_REF = /\(plugin ([a-z0-9-]+)\)/g;

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function readDescription(slug: string, description: string) {
  const sentences = description.split(SENTENCE).map((s) => s.trim());
  const isUse = (s: string) => /^Use\b/.test(s);
  const isAvoid = (s: string) => /^Não use\b/.test(s) || /\buse a pg-/.test(s);
  const summary = sentences.filter((s) => !isUse(s) && !isAvoid(s)).join(" ");
  const use = sentences.find(isUse);
  const avoid = sentences.filter(isAvoid);
  const seeAlso = [...new Set(skillNamesIn(description))].filter((s) => s !== slug);
  const seeAlsoPlugins = [...description.matchAll(PLUGIN_REF)].flatMap(([, name]) => (name ? [name] : []));
  return {
    summary,
    whenToUse: use ? capitalize(use.replace(/^Use\s+/, "")) : null,
    whenNotToUse: avoid.length ? avoid.map((s) => capitalize(s.replace(/^Não use\s+/, ""))).join(" ") : null,
    seeAlso,
    seeAlsoPlugins,
  };
}

export const plugins: Plugin[] = release.plugins;

const requiredByIndex = new Map<string, string[]>();
for (const s of release.skills) {
  for (const r of s.requires) requiredByIndex.set(r, [...(requiredByIndex.get(r) ?? []), s.slug]);
}

export const skills: Skill[] = plugins.flatMap((p) =>
  p.skills.map((slug, order) => {
    const base = release.skills.find((s) => s.slug === slug);
    if (!base) throw new Error(`Skill missing from the catalog: ${slug}`);
    return {
      ...base,
      ...readDescription(slug, base.description),
      requiredBy: requiredByIndex.get(slug) ?? [],
      order,
      news: skillBadge(slug),
    };
  }),
);

const pluginIndex = new Map(plugins.map((p) => [p.name, p]));
const skillIndex = new Map(skills.map((s) => [s.slug, s]));

export function getPlugin(name: string): Plugin | undefined {
  return pluginIndex.get(name);
}

export function getSkill(slug: string): Skill | undefined {
  return skillIndex.get(slug);
}

export function pluginOf(skill: Skill): Plugin {
  const plugin = pluginIndex.get(skill.plugin);
  if (!plugin) throw new Error(`Unknown plugin: ${skill.plugin}`);
  return plugin;
}

export function skillsOf(pluginName: string): Skill[] {
  return skills.filter((s) => s.plugin === pluginName);
}

export function areaOf(plugin: Plugin): Area {
  return areaById[plugin.area];
}

// The SKILL.md of a skill comes down with its page only: the frontmatter and the body, read from the skills repository in the build.
export async function loadSkillDoc(slug: string): Promise<{ frontmatter: string; body: string }> {
  const load = skillDocs[slug];
  return load ? (await load()).default : { frontmatter: "", body: "" };
}
