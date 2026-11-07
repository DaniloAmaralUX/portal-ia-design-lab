import type { ReactNode } from "react";
import type { NavigateOptions } from "@tanstack/react-router";
import { BookA, BookOpen, BookText, Clapperboard, Compass, GitPullRequestCreate, GraduationCap, Home, Languages, LayoutGrid, Library, MonitorPlay, Route, Sparkles, Sprout, Wrench, type LucideIcon } from "lucide-react";
import { PluginMark } from "@/components/PluginMark";
import { pluginOf } from "@/data/catalog";
import type { Page } from "@/data/pages";
import { guideTarget } from "@/features/method";
import type { SearchHit } from "@/lib/site-search";
import { formatDate, plural } from "@/lib/utils";
import { iconClass } from "./palette-classes";
import { PaletteRow } from "./PaletteRow";

type Target = NavigateOptions;
type Hit<K extends SearchHit["kind"]> = Extract<SearchHit, { kind: K }>;
type Handler<K extends SearchHit["kind"]> = { key(hit: Hit<K>): string; target(hit: Hit<K>): Target; row(hit: Hit<K>): ReactNode };
const PAGE_ICON: Record<Page["to"], LucideIcon> = {
  "/": Home,
  "/manifesto": Sprout,
  "/academy": GraduationCap,
  "/metodo": Library,
  "/ferramentas": Wrench,
  "/explorar": Compass,
  "/plugins": LayoutGrid,
  "/primeiros-passos": BookOpen,
  "/contribuir": GitPullRequestCreate,
  "/novidades": Sparkles,
  "/academy/glossario": BookA,
  "/academy/em-portugues": Languages,
  "/academy/intervalos": Clapperboard,
  "/academy/treinamentos": MonitorPlay,
  "/academy/trilhas/$area": GraduationCap,
  "/metodo/roteiros/$area": Route,
};

const HITS: { [K in SearchHit["kind"]]: Handler<K> } = {
  skill: {
    key: (hit) => `skill:${hit.skill.slug}`,
    target: (hit) => ({ to: "/plugins/$plugin/$skill", params: { plugin: hit.skill.plugin, skill: hit.skill.slug } }),
    row: (hit) => {
      const plugin = pluginOf(hit.skill);
      return (
        <PaletteRow
          icon={<PluginMark plugin={hit.skill.plugin} area={plugin.area} size="sm" />}
          title={hit.skill.title}
          detail={<span className="font-mono">{hit.skill.slug}</span>}
          side={plugin.displayName}
        />
      );
    },
  },
  plugin: {
    key: (hit) => `plugin:${hit.plugin.name}`,
    target: (hit) => ({ to: "/plugins/$plugin", params: { plugin: hit.plugin.name } }),
    row: (hit) => (
      <PaletteRow
        icon={<PluginMark plugin={hit.plugin.name} area={hit.plugin.area} size="sm" />}
        title={hit.plugin.displayName}
        detail={<span className="font-mono">{hit.plugin.name}</span>}
      />
    ),
  },
  page: {
    key: ({ page }) => (page.params ? `page:${page.to}:${page.params.area}` : `page:${page.to}`),
    target: ({ page }) => (page.params ? { to: page.to, params: page.params } : { to: page.to }),
    row: ({ page }) => {
      const Icon = PAGE_ICON[page.to];
      return <PaletteRow icon={<Icon className={iconClass} />} title={page.title} detail={page.description} />;
    },
  },
  academy: {
    key: ({ doc }) => `academy:${doc.guide}:${doc.chapter ?? ""}:${doc.anchor ?? ""}`,
    target: ({ doc }) => guideTarget(doc),
    row: (hit) => <PaletteRow icon={<BookText className={iconClass} />} title={hit.doc.title} detail={hit.guide.label} />,
  },
  training: {
    key: ({ course, lesson }) => (lesson ? `training:${course.slug}/${lesson.number}` : `training:${course.slug}`),
    target: ({ course, lesson }) =>
      lesson
        ? { to: "/academy/treinamentos/$curso/$aula", params: { curso: course.slug, aula: String(lesson.number) } }
        : { to: "/academy/treinamentos/$curso", params: { curso: course.slug } },
    row: ({ course, lesson }) =>
      lesson ? (
        <PaletteRow icon={<MonitorPlay className={iconClass} />} title={lesson.title} detail={course.title} side={formatDate(lesson.date)} />
      ) : (
        <PaletteRow icon={<MonitorPlay className={iconClass} />} title={course.title} detail={course.summary} side={plural(course.lessons.length, "aula", "aulas")} />
      ),
  },
  interval: {
    key: ({ interval }) => `interval:${interval.slug}`,
    target: ({ interval }) => ({ to: "/academy/intervalos/$intervalo", params: { intervalo: interval.slug } }),
    row: ({ interval }) => (
      <PaletteRow icon={<Clapperboard className={iconClass} />} title={interval.title} detail={interval.summary} side={formatDate(interval.date)} />
    ),
  },
};

function handlerOf<K extends SearchHit["kind"]>(hit: Hit<K>): Handler<K> {
  return HITS[hit.kind];
}

export const hitKey = (hit: SearchHit): string => handlerOf(hit).key(hit);
export const hitTarget = (hit: SearchHit): Target => handlerOf(hit).target(hit);
export const hitRow = (hit: SearchHit): ReactNode => handlerOf(hit).row(hit);
