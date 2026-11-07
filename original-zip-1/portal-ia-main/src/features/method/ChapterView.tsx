import { useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Crumb } from "@/components/Crumb";
import { EndCard } from "@/components/EndCard";
import { NextLink } from "@/components/NextLink";
import { OutlineDetails } from "@/components/OutlineDetails";
import { PrevLink } from "@/components/PrevLink";
import { ReadingProgress } from "./ReadingProgress";
import { readingOrder, sectionOf, type Guide } from "@/data/guides";
import { chapterBody, type ChapterMeta } from "@/lib/guide-text";
import { ExcerptSkills } from "./ExcerptSkills";
import { GuideDoc, type AnchorResolver } from "./GuideDoc";
import { GuideLink } from "./GuideLink";
import { guideTarget } from "./guide-target";
import { GuideOutline } from "./GuideOutline";
import { ModeSwitch } from "./ModeSwitch";
import { PresentationHost } from "./PresentationHost";
import { LAST_SLIDE, PRESENTING } from "./reading-search";
import { slidesOf } from "./slides";

// The page at the root of each section, for the first crumb: the guides of the Method, and the tools of Ferramentas.
const HOME = {
  method: { to: "/metodo", label: "Método" },
  tools: { to: "/ferramentas", label: "Ferramentas" },
} as const;

export function ChapterView({
  guide,
  chapters,
  anchors,
  i,
  chapter,
  source,
}: {
  guide: Guide;
  chapters: ChapterMeta[];
  anchors: Record<string, string>;
  i: number;
  chapter: ChapterMeta;
  source: string;
}) {
  const navigate = useNavigate();
  const resolve = useCallback<AnchorResolver>(
    (id) => {
      const target = Object.hasOwn(anchors, id) ? anchors[id] : undefined;
      return target ? { guide: guide.slug, chapter: target, here: target === chapter.id } : null;
    },
    [anchors, guide.slug, chapter.id],
  );
  const body = chapterBody(source);
  const slides = useMemo(
    () => slidesOf({ kicker: [guide.label, chapter.part].filter(Boolean).join(" · "), number: chapter.number, title: chapter.title }, body),
    [guide.label, chapter, body],
  );
  const prev = chapters[i - 1];
  const next = chapters[i + 1];
  const tool = sectionOf(guide) === "tools";
  const home = HOME[tool ? "tools" : "method"];
  const at = (id?: string) => guideTarget({ guide: guide.slug, chapter: id });
  // A tool is out of the reading order of the Method: its last chapter leads back to its page.
  const nextGuide = next || tool ? undefined : readingOrder[readingOrder.findIndex((g) => g.slug === guide.slug) + 1];
  // The presentation runs through the guide: past the last slide comes the next chapter, and before the first, the last slide of the previous one.
  const after = next && {
    label: `Próximo capítulo: ${next.title}`,
    go: () => void navigate({ ...at(next.id), search: { modo: PRESENTING, slide: 1 } }),
  };
  const before = prev && {
    label: `Capítulo anterior: ${prev.title}`,
    go: () => void navigate({ ...at(prev.id), search: { modo: PRESENTING, slide: LAST_SLIDE } }),
  };

  return (
    <article className="max-w-3xl">
      <ReadingProgress />
      <Breadcrumbs
        items={[
          <Crumb key="m" to={home.to}>
            {home.label}
          </Crumb>,
          <Crumb key="g" {...at()}>
            {guide.label}
          </Crumb>,
          ...(chapter.part ? [<span key="p">{chapter.part}</span>] : []),
        ]}
      />
      <h1 id={chapter.id} data-vt-target="title" className="mt-6 w-fit font-display text-headline font-bold text-balance">
        {chapter.number && (
          <>
            <span className="mr-1.5 align-[0.12em] font-mono text-[0.62em] font-medium tabular-nums text-muted-foreground">{chapter.number}</span>{" "}
          </>
        )}
        {chapter.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <p className="text-caption text-muted-foreground">
          Capítulo {i + 1} de {chapters.length} · ~{chapter.minutes} min de leitura
        </p>
        <ModeSwitch />
      </div>

      <OutlineDetails label="Neste guia" className="mt-8 lg:hidden">
        <GuideOutline />
      </OutlineDetails>

      <div className="mt-10">
        <GuideDoc source={body} level="chapter" resolve={resolve} />
      </div>

      <ExcerptSkills guide={guide.slug} chapter={chapter.id} />

      {!next && (
        <p className="mt-14 border-t border-border pt-5 text-caption text-muted-foreground">
          {guide.footer && `${guide.footer} · `}
          <GuideLink slug="manifesto" hash="contato" className="link">
            Suporte
          </GuideLink>
        </p>
      )}

      <EndCard
        readId={`${guide.slug}/${chapter.id}`}
        done="Você terminou este capítulo"
        next={
          next ? (
            <NextLink {...at(next.id)} kicker="Próximo capítulo" label={`${next.number ? `${next.number} ` : ""}${next.title}`} />
          ) : nextGuide ? (
            <NextLink to="/metodo/$guide" params={{ guide: nextGuide.slug }} kicker="Você terminou o guia. Próximo guia" label={nextGuide.label} />
          ) : tool ? (
            <NextLink {...at()} kicker="Você chegou ao último capítulo. Volte à página" label={guide.label} />
          ) : (
            <NextLink to="/explorar" kicker="Você terminou os guias do Método. Próximo" label="Ache a skill que resolve o seu caso, no Catálogo" />
          )
        }
        prev={
          prev ? (
            <PrevLink {...at(prev.id)} kicker="Capítulo anterior" label={prev.title} />
          ) : (
            <PrevLink {...at()} activeOptions={{ exact: true }} kicker="Início do guia" label={guide.label} />
          )
        }
      />

      <PresentationHost title={`${chapter.number ? `${chapter.number} ` : ""}${chapter.title} · ${guide.label}`} slides={slides} resolve={resolve} before={before} after={after} />
    </article>
  );
}
