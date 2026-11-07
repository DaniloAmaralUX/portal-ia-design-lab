// Mainline Hero composition and breakpoints, adapted to Portal IA. See LICENSE.
import type { ReactNode } from "react";

import {
  ArrowRight,
  Blend,
  ChartNoAxesColumn,
  CircleDot,
  Diamond,
} from "lucide-react";

import { MainlineDashedLine as DashedLine } from "./MainlineDashedLine";
import { MainlineButton as Button } from "./MainlineButton";

const features = [
  {
    title: "Aprenda no seu ritmo",
    description: "Trilhas de capacitação organizadas para o seu papel.",
    icon: CircleDot,
  },
  {
    title: "Conhecimento do time",
    description: "Guias que conectam pessoas, métodos e ferramentas.",
    icon: Blend,
  },
  {
    title: "Da pergunta à entrega",
    description: "Um caminho claro para trabalhar com IA.",
    icon: Diamond,
  },
  {
    title: "Acompanhe seu caminho",
    description: "Encontre o próximo passo para continuar aprendendo.",
    icon: ChartNoAxesColumn,
  },
];

export const MainlineHero = ({ preview }: { preview: ReactNode }) => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        {/* Left side - Main content */}
        <div className="flex-1">
          <h1 className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl xl:whitespace-nowrap">
            O portal de IA da Pitang
          </h1>

          <p className="text-muted-foreground text-1xl mt-5 md:text-3xl">
            Aprenda, encontre seu caminho e use o conhecimento do time para construir com IA.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <Button asChild>
              <a href="/prototipos/mainline/academy">
                Começar minha trilha
              </a>
            </Button>
            <Button
              variant="outline"
              className="from-background h-auto gap-2 bg-linear-to-r to-transparent shadow-md"
              asChild
            >
              <a
                href="/prototipos/mainline/catalogo"
                className="max-w-56 truncate text-start md:max-w-none"
              >
                Explorar o conhecimento
                <ArrowRight className="stroke-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="relative flex flex-1 flex-col justify-center gap-5 max-lg:pt-10 lg:pl-10">
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-2.5 lg:gap-5">
                <Icon className="text-foreground mt-1 size-4 shrink-0 lg:size-5" />
                <div>
                  <h2 className="font-text text-foreground font-semibold">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground max-w-76 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
        <div className="relative h-[793px] w-full">
          {preview}
        </div>
      </div>
    </section>
  );
};
