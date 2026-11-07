import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Presentation } from "lucide-react";
import { AreaMark } from "@/components/AreaMark";
import { InlineCode } from "@/components/InlineCode";
import { Button } from "@/components/ui/button";
import { areaById } from "@/data/areas";
import { DIAGRAM_GUIDES, METHOD_GROUPS, guidesIn, readingOrder, readingTime, type Guide } from "@/data/guides";
import { ROADMAPS } from "@/data/roadmaps";
import { useIntro } from "@/hooks/use-intro";
import { useReadChapters } from "@/hooks/use-read-chapters";
import { delay } from "@/lib/motion";
import { cn, formatDuration } from "@/lib/utils";
import { guideFooter, STAGE } from "./method-overview";
import { PRESENTING } from "./reading-search";

function GuideRow({ guide, readIds }: { guide: Guide; readIds: ReadonlySet<string> }) {
  const completed = guide.chapters ? [...readIds].filter((l) => l.startsWith(`${guide.slug}/`)).length : 0;
  return (
    <li
      data-vt-row
      className="group relative flex flex-col gap-3 py-4 transition-colors duration-(--duration-fast) hover:bg-accent/40 active:bg-accent/70 sm:flex-row sm:items-start sm:gap-6"
    >
      <div className="min-w-0 flex-1">
        <h4 className="w-fit text-body font-semibold underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-(--duration-fast) group-hover:decoration-foreground/30">
          <span data-vt="title">{guide.label}</span>
        </h4>
        <p className="mt-1 max-w-measure text-small leading-relaxed text-foreground/85 text-pretty">
          <InlineCode text={guide.summary} />
        </p>
        <p className="mt-2 text-caption text-muted-foreground">{guideFooter(guide, completed, readIds.has(guide.slug))}</p>
      </div>
      <div className="flex shrink-0 gap-2 sm:w-34 sm:flex-col">
        {/* The whole row reads, through the after: of Ler. Ler does not shrink on the press: a transform would make the
            button the box its after: is drawn in, the area would shrink under the pointer, and the click on the row would be lost. */}
        <Button asChild size="sm" variant="outline" className="after:absolute after:inset-0 active:scale-none">
          <Link to="/metodo/$guide" params={{ guide: guide.slug }} aria-label={`Ler: ${guide.label}`}>
            <BookOpen data-icon="inline-start" />
            Ler
          </Link>
        </Button>
        {!DIAGRAM_GUIDES.has(guide.slug) && (
          <Button asChild size="sm" variant="ghost" className="relative z-10">
            <Link
              to="/metodo/$guide"
              params={{ guide: guide.slug }}
              search={{ modo: PRESENTING }}
              aria-label={`Apresentar: ${guide.label}`}
            >
              <Presentation data-icon="inline-start" />
              Apresentar
            </Link>
          </Button>
        )}
      </div>
    </li>
  );
}

export function MethodPage() {
  useIntro();
  const { readIds } = useReadChapters();
  const intro = "animate-intro";
  return (
    <div className="max-w-4xl">
      <header>
        <p className={cn("eyebrow", intro)}>Método · como a Pitang trabalha com IA</p>
        <h1 className={cn("mt-3 font-display text-title font-extrabold text-balance", intro)} style={delay(1)}>
          Do PBI ao código revisado, com IA
        </h1>
        <p className={cn("mt-4 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty", intro)} style={delay(2)}>
          Por que adotar o desenvolvimento guiado por especificação, os requisitos que ele consome, o ciclo no Compozy, no OpenSpec
          ou no Spec Kit e um caso real que passou pelo método de ponta a ponta. Comece pelo roteiro da sua área, que junta os guias
          e as skills na ordem.
        </p>
        <p className={cn("mt-3 max-w-md text-caption text-muted-foreground text-pretty", intro)} style={delay(3)}>
          São {readingOrder.length} guias. Sem o passo a passo de cada ferramenta, a leitura leva cerca de{" "}
          {formatDuration(readingTime.base)}, e o da ferramenta do seu projeto soma de {formatDuration(readingTime.tool.min)} a{" "}
          {formatDuration(readingTime.tool.max)}.
        </p>
      </header>

      <div className={intro} style={delay(4)}>
        <section aria-labelledby="roteiros" className="mt-12">
          <h2 id="roteiros" className="font-display text-heading font-bold">
            Roteiros por área
          </h2>
          <ul className="reveal-children mt-5 grid grid-cols-1 gap-3 @2xl:grid-cols-3">
            {ROADMAPS.map((roadmap) => (
              <li key={roadmap.area}>
                <Link
                  to="/metodo/roteiros/$area"
                  params={{ area: roadmap.area }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs transition-[translate,box-shadow,border-color] duration-(--duration-base) hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md motion-reduce:hover:translate-y-0"
                >
                  <AreaMark area={roadmap.area} size="md" />
                  <span data-vt="title" className="mt-4 self-start font-display text-subheading font-bold">
                    {areaById[roadmap.area].name}
                  </span>
                  <span className="mt-1.5 text-small leading-relaxed text-muted-foreground text-pretty">{roadmap.summary}</span>
                  <span className="mt-auto flex items-center justify-between gap-2 pt-5 text-caption font-medium text-foreground/85">
                    {roadmap.steps.length} passos
                    <ArrowRight aria-hidden className="size-4 text-muted-foreground transition-transform duration-(--duration-base) group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <h2 className="mt-14 font-display text-heading font-bold">Os guias, em ordem</h2>
        <ol aria-label="Guias do Método, em ordem" className="reveal-children mt-6">
          {METHOD_GROUPS.map((group, i) => {
            const list = guidesIn(group.id);
            const last = i === METHOD_GROUPS.length - 1;
            return (
              <li key={group.id} className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-5 pb-10 last:pb-0">
                {!last && <span aria-hidden className="absolute bottom-0 left-4 top-10 w-px -translate-x-1/2 bg-border" />}
                <span className="grid size-8 place-items-center rounded-full bg-foreground font-display text-small font-bold tabular-nums text-background">
                  {i + 1}
                </span>
                <div className="min-w-0 pt-1">
                  <h3 className="font-display text-subheading font-bold">{group.name}</h3>
                  {STAGE[group.id] && <p className="mt-1 max-w-measure text-small text-foreground/85 text-pretty">{STAGE[group.id]}</p>}
                  <ul className="mt-4 divide-y divide-border border-y border-border">
                    {list
                      .filter((guide) => !guide.tool)
                      .map((guide) => (
                        <GuideRow key={guide.slug} guide={guide} readIds={readIds} />
                      ))}
                  </ul>
                  {list.some((guide) => guide.tool) && (
                    <div className="mt-5 border-l-2 border-border pl-4 sm:ml-4 sm:pl-5">
                      <p id={`${group.id}-ferramentas`} className="text-small font-semibold">
                        Passo a passo por ferramenta <span className="font-normal text-muted-foreground">· escolha uma</span>
                      </p>
                      <ul aria-labelledby={`${group.id}-ferramentas`} className="mt-2 divide-y divide-border border-y border-border">
                        {list
                          .filter((guide) => guide.tool)
                          .map((guide) => (
                            <GuideRow key={guide.slug} guide={guide} readIds={readIds} />
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
