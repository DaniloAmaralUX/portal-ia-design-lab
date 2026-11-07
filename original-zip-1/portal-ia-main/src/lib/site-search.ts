import { documents as academyDocuments, type AcademyDocument } from "virtual:academy-index/documents";
import { areaById } from "@/data/areas";
import { plugins, skills } from "@/data/catalog";
import { getGuide, type Guide } from "@/data/guides";
import { intervals } from "@/data/intervals";
import { PAGES, type Page } from "@/data/pages";
import { courses } from "@/data/trainings";
import type { AreaId, Interval, Plugin, Skill, Training, TrainingCourse } from "@/data/types";
import { search, buildIndex, type SearchDocument, type SearchIndex, type SearchResult } from "@/lib/search";

export type SearchHit =
  | { kind: "skill"; skill: Skill }
  | { kind: "plugin"; plugin: Plugin }
  | { kind: "academy"; doc: AcademyDocument; guide: Guide }
  | { kind: "page"; page: Page }
  | { kind: "training"; course: TrainingCourse; lesson: Training | null }
  | { kind: "interval"; interval: Interval };

function audienceOf(area: AreaId | null): string {
  return area ? `${areaById[area].name} ${areaById[area].audience}` : "";
}

function documents(): SearchDocument<SearchHit>[] {
  const out: SearchDocument<SearchHit>[] = [];
  const pluginsByName = new Map(plugins.map((p) => [p.name, p]));
  for (const skill of skills) {
    const plugin = pluginsByName.get(skill.plugin);
    out.push({
      id: `skill:${skill.slug}`,
      item: { kind: "skill", skill },
      fields: [
        { text: skill.title, weight: 6 },
        { text: skill.slug, weight: 4 },
        { text: skill.example, weight: 3 },
        { text: skill.whenToUse ?? "", weight: 2 },
        { text: skill.output, weight: 2 },
        { text: `${plugin?.displayName ?? ""} ${skill.plugin}`, weight: 2.5 },
        { text: `${plugin?.tagline ?? ""} ${plugin?.keywords.join(" ") ?? ""}`, weight: 2 },
        { text: plugin ? `${audienceOf(plugin.area)} ${plugin.category}` : "", weight: 1.5 },
        { text: skill.summary, weight: 1.5 },
      ],
    });
  }
  for (const plugin of plugins) {
    out.push({
      id: `plugin:${plugin.name}`,
      item: { kind: "plugin", plugin },
      fields: [
        { text: plugin.displayName, weight: 6 },
        { text: plugin.name, weight: 4 },
        { text: `${plugin.tagline} ${plugin.keywords.join(" ")}`, weight: 3 },
        { text: `${plugin.intro} ${plugin.category} ${audienceOf(plugin.area)}`, weight: 2 },
        { text: skills.filter((s) => s.plugin === plugin.name).map((s) => s.title).join(" "), weight: 1.5 },
      ],
    });
  }
  for (const doc of academyDocuments) {
    const guide = getGuide(doc.guide);
    if (!guide) continue;
    out.push({
      id: `academy:${doc.guide}:${doc.chapter ?? doc.anchor ?? ""}`,
      item: { kind: "academy", doc, guide },
      fields: [
        { text: doc.title, weight: 5 },
        { text: guide.label, weight: 2 },
        { text: doc.text, weight: 1.5 },
      ],
    });
  }
  for (const course of courses) {
    out.push({
      id: `training:${course.slug}`,
      item: { kind: "training", course, lesson: null },
      fields: [
        { text: course.title, weight: 6 },
        { text: course.summary, weight: 2 },
        { text: `treinamento curso aulas video gravacao ${audienceOf(course.area)}`, weight: 1.5 },
      ],
    });
    for (const lesson of course.lessons) {
      out.push({
        id: `training:${course.slug}/${lesson.number}`,
        item: { kind: "training", course, lesson },
        fields: [
          { text: lesson.title, weight: 5 },
          { text: course.title, weight: 4 },
          { text: lesson.summary, weight: 2 },
          { text: `treinamento aula video gravacao ${audienceOf(course.area)}`, weight: 1.5 },
        ],
      });
    }
  }
  for (const interval of intervals) {
    out.push({
      id: `interval:${interval.slug}`,
      item: { kind: "interval", interval },
      fields: [
        { text: interval.title, weight: 6 },
        { text: interval.summary, weight: 2 },
        { text: `intervalo tecnico video gravacao ${audienceOf(interval.area)}`, weight: 1.5 },
      ],
    });
  }
  for (const page of PAGES) {
    out.push({
      id: page.params ? `page:${page.to}:${page.params.area}` : `page:${page.to}`,
      item: { kind: "page", page },
      fields: [
        { text: page.title, weight: 5 },
        { text: page.keywords, weight: 3 },
      ],
    });
  }
  return out;
}

// Built on the first search, and not when the site starts, as every page carries this module and most visits search nothing.
let index: SearchIndex<SearchHit> | undefined;

export function searchSite(query: string, filter?: (hit: SearchHit) => boolean): SearchResult<SearchHit>[] {
  index ??= buildIndex(documents());
  return search(index, query, filter);
}

export function searchSkills(query: string, inside: Skill[]): Skill[] {
  const allowed = new Set(inside.map((s) => s.slug));
  return searchSite(query, (a) => a.kind === "skill" && allowed.has(a.skill.slug)).flatMap((r) =>
    r.item.kind === "skill" ? [r.item.skill] : [],
  );
}

let hits: SearchHit[] | undefined;

// Every page the search can lead to, in the order of the index: skills, plugins, guides, trainings, technical breaks and the fixed pages.
export function siteHits(): SearchHit[] {
  hits ??= documents().map((d) => d.item);
  return hits;
}
