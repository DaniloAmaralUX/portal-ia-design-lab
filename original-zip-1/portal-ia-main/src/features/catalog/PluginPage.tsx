import type { ReactNode } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { CircleCheck } from "lucide-react";
import { InlineCode } from "@/components/InlineCode";
import { Card } from "@/design-system/primitives";
import { Container } from "@/components/ui/container";
import { areaOf, skillsOf } from "@/data/catalog";
import { InstallPanel } from "@/features/install";
import { LearnInMethod } from "@/features/method";
import { formatDate } from "@/lib/utils";
import { EffectsSummary } from "./EffectsSummary";
import { Facts } from "./Facts";
import { Inventory } from "./Inventory";
import { PluginHeader } from "./PluginHeader";
import { PluginSkills } from "./PluginSkills";
import { StickyAside } from "./StickyAside";
import { trustFacts } from "./trust-facts";

const route = getRouteApi("/plugins/$plugin/");

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mb-5 font-display text-heading font-bold">
      {children}
    </h2>
  );
}

export function PluginPage() {
  const { plugin } = route.useLoaderData();
  const list = skillsOf(plugin.name);
  const area = areaOf(plugin);
  const kinds = [...new Set(list.flatMap((s) => s.effects))];
  const trust = trustFacts({ lifecycle: plugin.lifecycle, listChars: plugin.listChars });

  return (
    <>
      <PluginHeader plugin={plugin} />

      <Container className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-16">
          <section id="skills" aria-labelledby="skills-title">
            <SectionTitle id="skills-title">{list.length === 1 ? "A skill do plugin" : `As ${list.length} skills do plugin`}</SectionTitle>
            <PluginSkills plugin={plugin} />
          </section>

          <section aria-labelledby="espera">
            <SectionTitle id="espera">O que o plugin espera do projeto</SectionTitle>
            <ul className="max-w-measure space-y-3">
              {plugin.expects.map((item) => (
                <li key={item} className="flex gap-3 text-body leading-relaxed">
                  <CircleCheck aria-hidden strokeWidth={1.5} className="mt-1 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-foreground/85">
                    <InlineCode text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section id="instalar" aria-labelledby="instalar-title">
            <SectionTitle id="instalar-title">Instalação</SectionTitle>
            <Card className="p-5 sm:p-6">
              <InstallPanel plugin={plugin} />
            </Card>
          </section>

          <LearnInMethod slugs={list.map((s) => s.slug)} />
        </div>

        <StickyAside>
          <Card className="p-5">
            <h2 className="mb-4 text-small font-semibold lg:mb-3">Ficha técnica</h2>
            <Facts
              items={[
                { label: "Versão", value: <span className="font-mono">{plugin.version}</span> },
                { label: "Atualizado em", value: formatDate(plugin.updatedAt) },
                ...(plugin.category !== area.name ? [{ label: "Tipo de trabalho", value: plugin.category }] : []),
                { label: "Mantido por", value: plugin.owner },
                trust.state,
                trust.listSpace,
                { label: "Para quem é", value: <span className="font-normal text-foreground/80">{plugin.audience}</span> },
                { label: "Dentro do plugin", value: <Inventory components={plugin.components} /> },
                {
                  label: "No projeto",
                  value: (
                    <span className="block">
                      <EffectsSummary kinds={kinds} className="justify-end" />
                      <span className="mt-1 block text-micro font-normal text-muted-foreground">detalhes em cada skill</span>
                    </span>
                  ),
                },
                {
                  label: "Palavras-chave",
                  value: (
                    <span className="flex flex-wrap justify-end gap-1">
                      {plugin.keywords.map((k) => (
                        <span key={k} className="rounded-md bg-muted px-1.5 py-px font-mono text-micro font-normal text-muted-foreground">
                          {k}
                        </span>
                      ))}
                    </span>
                  ),
                },
              ]}
            />
          </Card>
        </StickyAside>
      </Container>
    </>
  );
}
