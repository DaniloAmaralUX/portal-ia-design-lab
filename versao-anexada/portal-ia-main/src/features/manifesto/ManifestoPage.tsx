import { useMemo } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { EndCard } from "@/components/EndCard";
import { NextLink } from "@/components/NextLink";
import { OutlineDetails } from "@/components/OutlineDetails";
import { OutlineRail } from "@/components/OutlineRail";
import { PrevLink } from "@/components/PrevLink";
import { Toc } from "@/components/Toc";
import { Container } from "@/components/ui/container";
import { ExcerptSkills, GuideDoc, ModeSwitch, PresentationHost, ReadingProgress, slidesOf } from "@/features/method";
import { useActiveSection } from "@/hooks/use-active-section";
import { useIntro } from "@/hooks/use-intro";
import { tableOfContents } from "@/lib/guide-text";
import { delay } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useUi } from "@/store/ui";
import { withoutLeadLinks } from "./manifesto-text";
import { ManifestoClosing } from "./ManifestoClosing";

const route = getRouteApi("/manifesto");

const EYEBROW = "Manifesto · por que a Pitang adota IA";

export function ManifestoPage() {
  useIntro();
  const { guide, doc } = route.useLoaderData();
  const text = withoutLeadLinks(doc);
  const items = tableOfContents(guide, doc);
  useActiveSection(items.map((item) => item.id));
  const active = useUi((s) => s.activeSection);
  const slides = useMemo(() => slidesOf({ kicker: EYEBROW, title: guide.title, lead: guide.summary }, text), [guide, text]);
  const intro = "animate-intro";
  return (
    <Container className="pb-20 pt-6 sm:pt-8">
      <ReadingProgress />
      <div className="@container mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className={cn("eyebrow", intro)}>{EYEBROW}</p>
          <h1 data-vt-target="title" className={cn("mt-3 font-display text-title font-extrabold text-balance", intro)} style={delay(1)}>
            {guide.title}
          </h1>
          <p className={cn("mt-4 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty", intro)} style={delay(2)}>
            {guide.summary}
          </p>
          <div className={cn("mt-6", intro)} style={delay(2)}>
            <ModeSwitch />
          </div>
        </header>

        <div className={cn("mt-12 grid grid-cols-1 gap-x-12 lg:grid-cols-[minmax(0,1fr)_13rem]", intro)} style={delay(3)}>
          <div className="min-w-0 max-w-3xl">
            {items.length > 0 && (
              <OutlineDetails label="Nesta página" className="mb-10 lg:hidden">
                <Toc groups={[{ items }]} active={active} />
              </OutlineDetails>
            )}
            <article>
              <GuideDoc source={text} />
            </article>
            <ExcerptSkills guide={guide.slug} />
            <ManifestoClosing />
            <p className="mt-14 border-t border-border pt-5 text-caption text-muted-foreground">
              {guide.footer && `${guide.footer} · `}
              <Link to="/manifesto" hash="contato" className="link">
                Suporte
              </Link>
            </p>
            <EndCard
              readId={guide.slug}
              done="Você terminou este guia"
              next={<NextLink to="/academy/em-portugues" kicker="Próximo" label="Estudar em português: legenda e tradução" />}
              prev={<PrevLink to="/academy" activeOptions={{ exact: true }} kicker="Academy" label="Visão geral" />}
            />
          </div>
          {items.length > 0 && (
            <OutlineRail label="Nesta página" className="hidden lg:block" follow={active ?? ""}>
              <Toc groups={[{ items }]} active={active} />
            </OutlineRail>
          )}
        </div>
      </div>
      <PresentationHost title={guide.title} slides={slides} />
    </Container>
  );
}
