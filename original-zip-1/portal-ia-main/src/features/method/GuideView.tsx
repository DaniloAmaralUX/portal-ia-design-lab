import { useMemo, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EndCard } from "@/components/EndCard";
import { OutlineDetails } from "@/components/OutlineDetails";
import { DIAGRAM_GUIDES, type Guide } from "@/data/guides";
import { tableOfContents } from "@/lib/guide-text";
import { ExcerptSkills } from "./ExcerptSkills";
import { GuideDoc } from "./GuideDoc";
import { GuideFacts } from "./GuideFacts";
import { GuideLink } from "./GuideLink";
import { GuideOutline } from "./GuideOutline";
import { GuideTitle } from "./GuideTitle";
import { ModeSwitch } from "./ModeSwitch";
import { NextGuideCard } from "./NextGuideCard";
import { PipelineDiagram } from "./PipelineDiagram";
import { PresentationHost } from "./PresentationHost";
import { ReadingProgress } from "./ReadingProgress";
import { slidesOf } from "./slides";

export function GuideView({
  guide,
  doc,
  track,
  next,
  prev,
}: {
  guide: Guide;
  doc: string;
  track: ReactNode[];
  next: ReactNode;
  prev: ReactNode;
}) {
  const Diagram = DIAGRAM_GUIDES.has(guide.slug) ? PipelineDiagram : null;
  const toc = tableOfContents(guide, doc).length > 0;
  const slides = useMemo(() => slidesOf({ kicker: guide.eyebrow, title: guide.title, lead: guide.summary }, doc), [guide, doc]);

  return (
    <div className="min-w-0">
      {!Diagram && <ReadingProgress />}
      <header className="max-w-3xl">
        <Breadcrumbs items={track} />
        <GuideTitle guide={guide} />
        <GuideFacts guide={guide} reading={guide.minutes ? `~${guide.minutes} min` : null} />
        {!Diagram && <ModeSwitch className="mt-6" />}
        <NextGuideCard guide={guide} className="mt-6" />
      </header>

      {toc && (
        <OutlineDetails label="Nesta página" className="mt-8 max-w-3xl lg:hidden">
          <GuideOutline />
        </OutlineDetails>
      )}

      <div className="mt-16">
        {Diagram ? (
          <Diagram />
        ) : (
          <article>
            <GuideDoc source={doc} />
          </article>
        )}
      </div>

      <div className="max-w-3xl">
        {!Diagram && <ExcerptSkills guide={guide.slug} />}
        <p className="mt-14 border-t border-border pt-5 text-caption text-muted-foreground">
          {guide.footer && `${guide.footer} · `}
          <GuideLink slug="manifesto" hash="contato" className="link">
            Suporte
          </GuideLink>
        </p>
        <EndCard readId={guide.slug} done="Você terminou este guia" next={next} prev={prev} />
      </div>

      {!Diagram && <PresentationHost title={guide.title} slides={slides} />}
    </div>
  );
}
