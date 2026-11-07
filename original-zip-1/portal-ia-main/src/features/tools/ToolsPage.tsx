import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CatalystMark } from "@/components/CatalystMark";
import { TOOLKIT } from "@/data/catalyst-toolkit";
import { guidePath, toolGuides } from "@/data/guides";
import { useState, type ReactNode } from "react";
import { delay } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { travelling } from "@/lib/view-transition";
import { PITA_IA } from "./pita-ia";

// What the showcase of each tool shows: its mark, in its own colors, and one line of what it does.
// The mark travels into the top of the page of the tool when its card opens it (src/lib/view-transition.ts), and back on return.
const SHOWCASE: Record<string, { art: ReactNode; line: string }> = {
  [TOOLKIT.slug]: {
    art: <CatalystMark travel="item" className="w-full max-w-md [&_[data-toolkit]]:text-terminal-muted" />,
    line: "Mede o que falta escrito no seu projeto para um agente de IA trabalhar nele, e escreve o que falta com você.",
  },
};

// The page of the section Ferramentas, as the top of a product: the name of the section signed by the mark of the Pita.IA, the family
// of AI of the Pitang these tools belong to, and one sentence, with room around them. Then a
// showcase for each tool, one under the other, each with its mark, one line and the one way in, the page of the tool. One tool reads
// as the showcase of the page, and the next ones line up under it in the same size. The page comes in part by part each time it
// opens, but for the return from a tool: the mark of the tool flies back into its card, and the page stands whole under it.
export function ToolsPage() {
  const [arrive] = useState(() => {
    const travel = travelling();
    return !(travel?.direction === "back" && toolGuides.some((guide) => guidePath(guide) === travel.from));
  });
  const enter = arrive ? "animate-arrive" : undefined;
  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative">
        <header className="relative max-w-2xl pb-8 text-left">
          <h1 className="flex flex-wrap items-center gap-x-4 gap-y-3 font-display text-title font-medium tracking-[-0.02em]">
            <span className={enter}>Ferramentas</span>
            <span className={cn("inline-flex rounded-xl bg-pita-ia-plate px-3 py-2", enter)} style={delay(1)}>
              <img src={PITA_IA.src} alt="Pita.IA" width={PITA_IA.width} height={PITA_IA.height} className="block h-[0.9em] w-auto" />
            </span>
          </h1>
          <p className={cn("mt-5 text-lead leading-relaxed text-muted-foreground text-pretty", enter)} style={delay(2)}>
            As ferramentas da Pita.IA para o dia a dia de quem desenvolve, prontas para instalar no seu computador.
          </p>
        </header>
      </div>
      <ul className="grid gap-8">
        {toolGuides.map((guide, i) => {
          const showcase = SHOWCASE[guide.slug];
          return (
            <li key={guide.slug} className={enter} style={delay(3 + i)}>
              <article
                data-vt-row
                aria-labelledby={`ferramenta-${guide.slug}`}
                className={cn(
                  "group relative grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]",
                  "transition-[translate,box-shadow,border-color] duration-(--duration-base) ease-(--ease-out-soft)",
                  "motion-safe:pointer-fine:hover:-translate-y-0.5 pointer-fine:hover:border-foreground/15 pointer-fine:hover:shadow-lg",
                  "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-ring",
                )}
              >
                <div
                  aria-hidden
                  className="grid min-h-60 place-items-center bg-terminal bg-[radial-gradient(var(--terminal-border)_1px,transparent_1px)] bg-size-[14px_14px] px-10 py-16 sm:min-h-72"
                >
                  <div className="w-full max-w-md transition-transform duration-(--duration-base) ease-(--ease-out-soft) motion-safe:pointer-fine:group-hover:scale-[1.02]">
                    {showcase?.art}
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                  <h2 id={`ferramenta-${guide.slug}`} className="font-display text-headline font-bold">
                    {guide.label}
                  </h2>
                  <p className="mt-3 max-w-sm text-body leading-relaxed text-muted-foreground text-pretty">{showcase?.line ?? guide.summary}</p>
                  <Link
                    to="/ferramentas/$guide"
                    params={{ guide: guide.slug }}
                    className="mt-8 inline-flex w-fit items-center gap-1.5 font-semibold text-foreground after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none"
                  >
                    Conhecer<span className="sr-only"> o {guide.label}</span>
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-(--duration-base) ease-(--ease-out-soft) motion-safe:pointer-fine:group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
