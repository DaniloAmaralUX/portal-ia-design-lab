import { Boxes, Puzzle } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Crumb } from "@/components/Crumb";
import { EndCard } from "@/components/EndCard";
import { NextLink } from "@/components/NextLink";
import { OutlineDetails } from "@/components/OutlineDetails";
import { OutlineRail } from "@/components/OutlineRail";
import { PrevLink } from "@/components/PrevLink";
import { Toc } from "@/components/Toc";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useActiveSection } from "@/hooks/use-active-section";
import { usePageOutline } from "@/hooks/use-page-outline";
import { useUi } from "@/store/ui";
import { AdminSection } from "./AdminSection";
import { AfterInstall } from "./AfterInstall";
import { Faq } from "./Faq";
import { GettingStartedSteps } from "./GettingStartedSteps";
import { ModeSection } from "./ModeSection";
import { TeamSection } from "./TeamSection";

export function GettingStartedPage() {
  const { ref: sections, items } = usePageOutline();
  useActiveSection(items.map((item) => item.id));
  const active = useUi((s) => s.activeSection);
  const outline = <Toc groups={[{ items }]} active={active} />;
  return (
    <Container className="pb-8 pt-10 sm:pt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-x-12">
      <article className="min-w-0 max-w-3xl">
        <Breadcrumbs
          items={[
            <Crumb key="c" to="/explorar">
              Catálogo
            </Crumb>,
            <span key="p">Primeiros passos</span>,
          ]}
        />
        <h1 className="mt-6 font-display text-headline font-bold text-balance">Do zero ao primeiro pedido, em cinco minutos</h1>
        <p className="mt-3 text-lead leading-relaxed text-muted-foreground text-pretty">
          Para quem nunca instalou uma skill. Se você já usa o Claude Code, pule para o passo 2.
        </p>
        {items.length > 0 && (
          <OutlineDetails label="Nesta página" className="mt-8 lg:hidden">
            {outline}
          </OutlineDetails>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <h2 className="flex items-center gap-2.5 font-display text-heading font-bold">
              <Puzzle strokeWidth={2.5} aria-hidden className="size-5 shrink-0 text-muted-foreground" />
              O que é uma skill
            </h2>
            <p className="mt-2 text-body leading-relaxed text-muted-foreground">
              Um manual que ensina o Claude a fazer uma tarefa do jeito do time: os passos, os modelos de documento e os cuidados.
              Você pede em português, e o Claude segue o manual.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="flex items-center gap-2.5 font-display text-heading font-bold">
              <Boxes strokeWidth={2.5} aria-hidden className="size-5 shrink-0 text-muted-foreground" />
              O que é um plugin
            </h2>
            <p className="mt-2 text-body leading-relaxed text-muted-foreground">
              Um pacote de skills do mesmo tema, como revisão de PR ou requisitos. Você instala o plugin e ganha todas as skills dele,
              que se atualizam juntas.
            </p>
          </Card>
        </div>

        <div ref={sections}>
          <GettingStartedSteps />

          <ModeSection />

          <AfterInstall />

          <TeamSection />

          <AdminSection />

          <Faq />
        </div>

        <EndCard
          readId="primeiros-passos"
          done="Você terminou os primeiros passos"
          next={
            <NextLink to="/explorar" kicker="Próximo" label="Ache a skill que resolve o seu caso, no Catálogo" />
          }
          prev={
            <PrevLink to="/academy" hash="trilhas" kicker="Academy" label="Escolha a trilha do seu papel" />
          }
        />
      </article>
      {items.length > 0 && (
        <OutlineRail label="Nesta página" className="hidden lg:block" follow={active ?? ""}>
          {outline}
        </OutlineRail>
      )}
    </Container>
  );
}
