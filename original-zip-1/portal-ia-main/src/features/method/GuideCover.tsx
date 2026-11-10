import { Link } from "@tanstack/react-router";
import { ArrowRight, Presentation } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Crumb } from "@/components/Crumb";
import { ReadMark } from "@/components/ReadMark";
import { Button } from "@/components/ui/button";
import { GUIDE_GROUPS, type Guide } from "@/data/guides";
import { useReadChapters } from "@/hooks/use-read-chapters";
import { partsOf, type ChapterMeta } from "@/lib/guide-text";
import { GuideDoc } from "./GuideDoc";
import { GuideFacts } from "./GuideFacts";
import { GuideTitle } from "./GuideTitle";
import { NextGuideCard } from "./NextGuideCard";
import { PRESENTING } from "./reading-search";

export function GuideCover({ guide, opening, chapters }: { guide: Guide; opening: string; chapters: ChapterMeta[] }) {
  const group = GUIDE_GROUPS.find((g) => g.id === guide.group);
  const { readIds } = useReadChapters();
  const isRead = (c: ChapterMeta) => readIds.has(`${guide.slug}/${c.id}`);
  const completed = chapters.filter(isRead).length;
  const next = completed > 0 && completed < chapters.length ? (chapters.find((c) => !isRead(c)) ?? chapters[0]) : chapters[0];
  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[
          <Crumb key="a" to="/metodo">
            Método
          </Crumb>,
          <span key="g">{group?.name}</span>,
        ]}
      />
      <GuideTitle guide={guide} />
      <GuideFacts guide={guide} reading={guide.minutes ? `~${guide.minutes} min, em ${chapters.length} capítulos` : null} />
      {next && (
        <div className="mt-7">
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/metodo/$guide/$chapter" params={{ guide: guide.slug, chapter: next.id }}>
                {next === chapters[0] || completed === chapters.length ? "Começar a leitura" : "Continuar a leitura"}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/metodo/$guide/$chapter" params={{ guide: guide.slug, chapter: chapters[0]?.id ?? next.id }} search={{ modo: PRESENTING }}>
                <Presentation data-icon="inline-start" />
                Apresentar
              </Link>
            </Button>
          </div>
          {completed > 0 && (
            <p className="mt-3 text-caption text-muted-foreground">
              Você leu {completed} de {chapters.length} capítulos{completed < chapters.length ? `. O próximo é ${next.title}.` : "."}
            </p>
          )}
        </div>
      )}

      {opening && (
        <div className="mt-10">
          <GuideDoc source={opening} />
        </div>
      )}

      <section aria-labelledby="capitulos" className="mt-20">
        <h2 id="capitulos" className="font-display text-heading font-bold">
          Capítulos
        </h2>
        <div className="mt-6 space-y-8">
          {partsOf(chapters).map(({ part, chapters: list }, i) => (
            <div key={`${part}-${i}`}>
              {part && <h3 className="mb-2 text-small font-semibold text-foreground">{part}</h3>}
              <ol className="divide-y divide-border border-y border-border">
                {list.map((c) => (
                  <li key={c.id}>
                    <Link
                      to="/metodo/$guide/$chapter"
                      params={{ guide: guide.slug, chapter: c.id }}
                      className="group flex items-baseline gap-4 py-3 transition-colors duration-(--duration-fast) hover:bg-accent/40"
                    >
                      <span className="w-9 shrink-0 font-mono text-caption tabular-nums text-muted-foreground">{c.number}</span>
                      <span className="min-w-0 flex-1">
                        <span
                          data-vt="title"
                          className="block w-fit text-small font-medium decoration-foreground/30 underline-offset-4 group-hover:underline"
                        >
                          {c.title}
                        </span>
                      </span>
                      {isRead(c) && <ReadMark />}
                      <span className="shrink-0 text-caption tabular-nums text-muted-foreground">{c.minutes} min</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <NextGuideCard guide={guide} className="mt-12" />
    </div>
  );
}
