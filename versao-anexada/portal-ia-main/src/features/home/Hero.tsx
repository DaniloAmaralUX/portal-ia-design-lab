import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { BrandArcs } from "@/components/BrandArcs";
import { Container } from "@/components/ui/container";
import { Term } from "@/components/Term";
import { TerminalDemo } from "./TerminalDemo";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useIntro } from "@/hooks/use-intro";
import { delay } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { catalogPlugins, catalogSkills } from "@/data/catalog-index";
import { suggestions } from "@/data/areas";

export function Hero() {
  useIntro();
  const intro = "animate-intro";
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    void navigate({ to: "/explorar", search: q ? { q } : {} });
  }

  return (
    <section className="relative overflow-hidden">
      <Container className="relative grid grid-cols-1 items-center gap-14 pb-16 pt-10 sm:pt-16 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8 lg:pb-24 lg:pt-20">
        <div className="relative z-10 @container">
          <h1 className={cn("font-display text-display font-extrabold @min-[30rem]:text-display-wide", intro)}>
            <span className="block">Peça em português.</span>
            <span className="block text-balance text-brand-red-text">O Claude faz do jeito Pitang.</span>
          </h1>

          {/* On a phone the sentence is the biggest text of the top, the paint the LCP counts, so it shows at once: Chrome takes a
              text that comes in from transparent only when it paints again, a second later, when the intro ends. */}
          <p className="mt-6 max-w-[34rem] text-lead leading-relaxed text-muted-foreground text-pretty">
            São {catalogSkills.length} <Term id="skill">skills</Term> em {catalogPlugins.length} <Term id="plugin">plugins</Term> para revisar PR, especificar requisitos, automatizar testes e
            documentar sistemas. Ache a que resolve o seu problema e instale com dois comandos.
          </p>

          <form onSubmit={submit} role="search" className={cn("mt-8 max-w-[36rem]", intro)} style={delay(2)}>
            <label htmlFor="hero-search" className="sr-only">
              O que você precisa fazer?
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-input bg-card p-1.5 pl-4 shadow-md transition-[border-color,box-shadow] focus-within:border-foreground/60 focus-within:shadow-lg contrast-more:focus-within:border-foreground has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring">
              <Search strokeWidth={1.5} className="size-5 shrink-0 text-muted-foreground max-sm:hidden" />
              <input
                id="hero-search"
                data-page-search
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="O que você precisa fazer?"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 bg-transparent text-field outline-none placeholder:text-muted-foreground focus-visible:outline-none"
              />
              <Kbd className="mr-1 hidden sm:inline-flex">/</Kbd>
              <Button type="submit" className="rounded-xl max-sm:w-10 max-sm:px-0 sm:pe-4.5">
                <span className="max-sm:sr-only">Buscar</span>
                <ArrowRight aria-hidden />
              </Button>
            </div>
          </form>

          <div className={cn("mt-4 flex flex-wrap items-center gap-2", intro)} style={delay(3)}>
            <span className="mr-0.5 text-caption text-muted-foreground">Sugestões:</span>
            {suggestions.map((s) => (
              <Link
                key={s.q}
                to="/explorar"
                search={{ q: s.q }}
                className="rounded-full border border-border bg-card/80 px-3 py-1 text-caption text-foreground/85 transition-colors hover:border-foreground/20 hover:bg-accent hover:text-foreground"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={cn("relative mx-auto w-full max-w-[560px] sm:py-14 lg:mx-0 lg:justify-self-end lg:py-0", intro)} style={delay(2)}>
          <BrandArcs className="floating-arcs pointer-events-none absolute left-1/2 top-1/2 hidden w-[108%] max-w-none -translate-x-[47%] -translate-y-1/2 sm:block" />
          <TerminalDemo className="relative mx-auto sm:w-[90%]" />
        </div>
      </Container>
    </section>
  );
}
