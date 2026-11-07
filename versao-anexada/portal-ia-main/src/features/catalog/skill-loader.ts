import { notFound } from "@tanstack/react-router";
import { getPlugin, getSkill, loadSkillDoc } from "@/data/catalog";

export type SkillDocText = Awaited<ReturnType<typeof loadSkillDoc>>;

export function loadPlugin(name: string) {
  const plugin = getPlugin(name);
  if (!plugin) throw notFound();
  return { plugin };
}

export async function loadSkill(pluginName: string, slug: string) {
  const skill = getSkill(slug);
  if (!skill || skill.plugin !== pluginName) throw notFound();
  return { skill, doc: await loadSkillDoc(skill.slug) };
}
