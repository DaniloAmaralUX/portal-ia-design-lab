import source from "virtual:changelog";
import { skillNamesIn } from "@/lib/skill-name";
import type { SkillBadge } from "./types";

type ChangelogSection = { kind: string; title: string; items: string[] };
export type Release = { version: string; date: string | null; sections: ChangelogSection[] };

const SECTION_TITLES: Record<string, string> = {
  Added: "Entrou",
  Changed: "Mudou",
  Deprecated: "Vai sair",
  Removed: "Saiu",
  Fixed: "Corrigido",
  Security: "Segurança",
};

export function parseChangelog(md: string): Release[] {
  const releases: Release[] = [];
  let section: ChangelogSection | null = null;
  // What has no version yet (the Unreleased of Keep a Changelog) waits for the release, and the site shows what a release published.
  let unreleased = false;
  for (const line of md.split(/\r?\n/)) {
    const version = /^## \[([^\]]+)\](?:\s*-\s*(\d{4}-\d{2}-\d{2}))?/.exec(line);
    if (version) {
      unreleased = version[1] === "Unreleased";
      if (!unreleased) releases.push({ version: version[1] ?? "", date: version[2] ?? null, sections: [] });
      section = null;
      continue;
    }
    if (unreleased) continue;
    const title = /^### (.+)$/.exec(line);
    const current = releases.at(-1);
    if (title && current) {
      const kind = (title[1] ?? "").trim();
      section = { kind, title: SECTION_TITLES[kind] ?? kind, items: [] };
      current.sections.push(section);
      continue;
    }
    if (!section) continue;
    const item = /^- (.+)$/.exec(line);
    if (item) section.items.push(item[1] ?? "");
    else if (/^\s{2,}\S/.test(line) && section.items.length) section.items[section.items.length - 1] += ` ${line.trim()}`;
  }
  return releases;
}

export const releases: Release[] = parseChangelog(source);

const BADGE_OF_SECTION: Record<string, SkillBadge["label"] | undefined> = { Added: "Nova", Changed: "Mudou", Removed: "Mudou" };

export function badgesOf(list: Release[]): Map<string, SkillBadge> {
  const map = new Map<string, SkillBadge>();
  const latest = list[0];
  if (!latest) return map;
  for (const section of latest.sections) {
    const label = Object.hasOwn(BADGE_OF_SECTION, section.kind) ? BADGE_OF_SECTION[section.kind] : undefined;
    if (!label) continue;
    for (const item of section.items) {
      for (const slug of skillNamesIn(item)) {
        if (map.get(slug)?.label !== "Nova") map.set(slug, { label, version: latest.version });
      }
    }
  }
  return map;
}

const badgesBySkill = badgesOf(releases);

export function skillBadge(slug: string): SkillBadge | null {
  return badgesBySkill.get(slug) ?? null;
}
