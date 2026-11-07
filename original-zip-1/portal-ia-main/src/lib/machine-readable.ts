import { areaOf, getPlugin, getSkill, loadSkillDoc, pluginOf, plugins, skills, skillsOf } from "@/data/catalog";
import { MARKETPLACE_NAME } from "@/data/catalog-index";
import { hasGuideSource, loadGuideSource } from "@/data/guide-source";
import { getGuide, guidePath, guides, sectionOf, SECTION_PATH, type Guide } from "@/data/guides";
import { chapterMarkdown, chaptersOf, pageMarkdown } from "@/lib/guide-text";
import { EFFECT_KINDS } from "@/data/effect-kinds";
import type { Plugin, Skill } from "@/data/types";
import { cliMarketplaceAdd, cliPluginInstall, invokeFromPlugin, marketplaceAdd, pluginFolderUrl, pluginInstall } from "@/lib/commands";

const url = {
  plugin: (p: Plugin) => `/plugins/${p.name}`,
  skill: (s: Skill) => `/plugins/${s.plugin}/${s.slug}`,
};

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function codeBlock(code: string, language = ""): string {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

function install(plugin: Plugin, skill?: Skill): string {
  const steps = [marketplaceAdd, pluginInstall(plugin.name), ...(skill ? [invokeFromPlugin(skill)] : [])];
  return [
    "## Instalar",
    "",
    "Numa sessão do Claude Code:",
    "",
    codeBlock(steps.join("\n")),
    "",
    "Pelo terminal:",
    "",
    codeBlock(`${cliMarketplaceAdd}\n${cliPluginInstall(plugin.name)}`, "sh"),
  ].join("\n");
}

function pluginMd(plugin: Plugin): string {
  const pluginSkills = skillsOf(plugin.name);
  return [
    `# ${plugin.displayName}`,
    "",
    `> ${plugin.tagline}`,
    "",
    plugin.intro,
    "",
    `Plugin \`${plugin.name}@${MARKETPLACE_NAME}\`, versão ${plugin.version}, de ${areaOf(plugin).name}. Mantido por ${plugin.owner}.`,
    "",
    "## Skills",
    "",
    list(pluginSkills.map((s) => `[${s.title}](${url.skill(s)}.md) (\`${s.slug}\`${s.manual ? ", só manual" : ""}): ${s.summary}`)),
    "",
    "## O que o plugin espera do projeto",
    "",
    list(plugin.expects),
    "",
    install(plugin),
    "",
    "## Ficha técnica",
    "",
    list(
      [
        `Atualizado em ${plugin.updatedAt}`,
        `Tipo de trabalho: ${plugin.category}`,
        `Para quem é: ${plugin.audience}`,
        `Dentro do plugin: ${plugin.components.skills} skills, ${plugin.components.agents} agentes, ${plugin.components.hooks} hooks, ${plugin.components.mcpServers} servidores MCP`,
        `Ocupa ${plugin.listChars} caracteres na lista de skills do Claude Code, em toda sessão`,
        `Código: ${pluginFolderUrl(plugin)}`,
      ].filter((x): x is string => Boolean(x)),
    ),
    "",
  ].join("\n");
}

async function skillMd(skill: Skill): Promise<string> {
  const plugin = pluginOf(skill);
  const parts = [
    `# ${skill.title}`,
    "",
    `> ${skill.summary}`,
    "",
    `Skill \`${skill.slug}\` do plugin [${plugin.displayName}](${url.plugin(plugin)}.md), versão ${plugin.version}. ${skill.manual ? "Só manual: roda quando alguém chama pela barra." : "Dispara sozinha quando o pedido combina com a descrição."}`,
    "",
    "## Como pedir",
    "",
    list([`"${skill.example}"`]),
    "",
    `Chamada direta: \`${invokeFromPlugin(skill)}\`.`,
    "",
    "## O que você recebe",
    "",
    skill.output,
  ];
  if (skill.whenToUse) parts.push("", "## Quando usar", "", skill.whenToUse);
  if (skill.whenNotToUse) parts.push("", "## Quando não usar", "", skill.whenNotToUse);
  if (skill.requires.length) parts.push("", "## Depende de", "", list(skill.requires.map((r) => `\`${r}\``)));
  parts.push("", "## O que ela faz no seu projeto", "");
  for (const { kind, label, means } of EFFECT_KINDS) if (skill.effects.includes(kind)) parts.push(`- ${label}: ${means}`);
  parts.push("", "O passo a passo de cada tipo está no SKILL.md, abaixo.");
  parts.push("", install(plugin, skill), "", "## SKILL.md", "", (await loadSkillDoc(skill.slug)).body.trim(), "");
  return parts.join("\n");
}

async function guideMd(guide: Guide): Promise<string> {
  return pageMarkdown(guide, await loadGuideSource(guide.slug));
}

async function chapterMd(guide: Guide, id: string): Promise<string | null> {
  const chapter = chaptersOf(guide, await loadGuideSource(guide.slug)).chapters.find((c) => c.id === id);
  return chapter ? chapterMarkdown(guide, chapter) : null;
}

// The path of every Markdown page, and the text of one, for the Vite plugin that writes them into the build and serves them in dev.
export async function markdownPaths(): Promise<string[]> {
  const paths = [...plugins.map((p) => `/plugins/${p.name}.md`), ...skills.map((s) => `/plugins/${s.plugin}/${s.slug}.md`)];
  for (const guide of guides) {
    if (!hasGuideSource(guide.slug)) continue;
    paths.push(`${guidePath(guide)}.md`);
    if (guide.chapters) {
      for (const chapter of chaptersOf(guide, await loadGuideSource(guide.slug)).chapters) paths.push(`${guidePath(guide)}/${chapter.id}.md`);
    }
  }
  return paths;
}

export async function markdownFor(pathname: string): Promise<string | null> {
  const page = /^\/([\w-]+)\.md$/.exec(pathname)?.[1];
  if (page) {
    const guide = getGuide(page);
    return guide && sectionOf(guide) === "manifesto" && hasGuideSource(guide.slug) ? guideMd(guide) : null;
  }
  const [, section, first, second] = /^\/(plugins|metodo|ferramentas)\/([\w-]+)(?:\/([\w-]+))?\.md$/.exec(pathname) ?? [];
  if (section === "plugins" && first) {
    if (!second) {
      const plugin = getPlugin(first);
      return plugin ? pluginMd(plugin) : null;
    }
    const skill = getSkill(second);
    return skill && skill.plugin === first ? skillMd(skill) : null;
  }
  const guide = first ? getGuide(first) : undefined;
  if (!guide || !hasGuideSource(guide.slug)) return null;
  if (`/${section}` !== SECTION_PATH[sectionOf(guide)]) return null;
  if (!second) return guideMd(guide);
  return guide.chapters ? chapterMd(guide, second) : null;
}
