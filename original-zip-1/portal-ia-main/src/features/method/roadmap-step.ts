import type { LinkProps } from "@tanstack/react-router";
import { getPlugin } from "@/data/catalog";
import { getGuide } from "@/data/guides";
import type { RoadmapStep } from "@/data/roadmaps";
import { getCourse } from "@/data/trainings";
import { plural } from "@/lib/utils";
import { guideTarget } from "./guide-target";
import { titles } from "./mentions";

type Kind = RoadmapStep["kind"];
export type Shown = { label: string; title: string; detail: string | null; readId: string | null; link: LinkProps };

const SHOW: { [K in Kind]: (step: Extract<RoadmapStep, { kind: K }>) => Shown } = {
  "getting-started": () => ({ label: "Tutorial", title: "Primeiros passos", detail: null, readId: "primeiros-passos", link: { to: "/primeiros-passos" } }),
  guide: ({ guide }) => ({
    label: "Guia",
    title: getGuide(guide)?.label ?? guide,
    detail: null,
    readId: guide,
    link: guideTarget({ guide }),
  }),
  chapter: ({ guide, chapter }) => ({
    label: "Capítulo",
    title: titles[`${guide}/${chapter}`] ?? chapter,
    detail: getGuide(guide)?.label ?? null,
    readId: `${guide}/${chapter}`,
    link: guideTarget({ guide, chapter }),
  }),
  plugin: ({ plugin: name }) => {
    const plugin = getPlugin(name);
    return {
      label: "Plugin",
      title: plugin?.displayName ?? name,
      detail: plugin ? `${plugin.skills.length} skills` : null,
      readId: null,
      link: { to: "/plugins/$plugin", params: { plugin: name } },
    };
  },
  training: ({ course: slug }) => {
    const course = getCourse(slug);
    return {
      label: "Treinamento",
      title: course?.title ?? slug,
      detail: course ? plural(course.lessons.length, "aula", "aulas") : null,
      readId: null,
      link: { to: "/academy/treinamentos/$curso", params: { curso: slug } },
    };
  },
};

// What a step of a roadmap shows: its kind, its title, where it leads and the id the reading progress marks.
export function showStep(step: RoadmapStep): Shown {
  return (SHOW[step.kind] as (step: RoadmapStep) => Shown)(step);
}
