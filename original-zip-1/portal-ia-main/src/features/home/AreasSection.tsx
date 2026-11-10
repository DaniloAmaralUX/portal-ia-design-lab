import { Link } from "@tanstack/react-router";
import { ArrowRight, Palette } from "lucide-react";
import { AreaMark } from "@/components/AreaMark";
import { areaStyle } from "@/components/area-style";
import { Mark } from "@/components/Mark";
import { SectionHeading } from "./SectionHeading";
import { Container } from "@/components/ui/container";
import { areas } from "@/data/areas";
import { findPlugin, pluginsOfArea, skillCountIn } from "@/data/catalog-index";
import { cn, plural } from "@/lib/utils";

const MAX_PLUGINS = 3;

// The area that comes next, without skills in the catalog yet: a card of its own under the areas, with no count and no links.
function UpcomingArea() {
  return (
    <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-7 lg:flex-row lg:items-center lg:gap-6">
      <div className="flex items-center gap-4 lg:w-80 lg:shrink-0">
        <Mark icon={Palette} size="lg" />
        <div className="min-w-0">
          <h3 className="font-display text-heading font-bold">Design</h3>
          <p className="mt-0.5 text-caption font-medium text-muted-foreground">Designers de UX e UI</p>
        </div>
      </div>
      <p className="text-small leading-relaxed text-muted-foreground text-pretty lg:flex-1">As skills, a capacitação e o roteiro de design chegam em breve.</p>
      <span className="self-start rounded-full border border-border bg-background px-2.5 py-0.5 text-micro font-semibold text-foreground/85 lg:self-center">Em breve</span>
    </div>
  );
}

export function AreasSection() {
  return (
    <section className="mt-24 sm:mt-28" aria-labelledby="areas-title">
      <Container>
        <SectionHeading
          id="areas-title"
          title="Comece pela sua área"
          description="Você não precisa saber o nome da skill. A sua área leva às skills dela, à trilha de capacitação do seu papel e ao roteiro do Método, com os guias e as skills na ordem."
        />
        <div className="reveal-children mt-10 grid grid-cols-1 gap-4 md:auto-rows-fr md:grid-cols-2">
          {areas.map((area) => {
            const tone = areaStyle[area.id];
            const count = skillCountIn(area);
            const names = pluginsOfArea(area.id).map((name) => findPlugin(name)?.title ?? name);
            const shown = names.slice(0, MAX_PLUGINS);
            const rest = names.slice(MAX_PLUGINS);
            return (
              <div
                key={area.id}
                className={cn(
                  "group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-[translate,box-shadow,border-color] duration-(--duration-base) hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0 sm:p-7",
                  tone.border,
                )}
              >
                <div className="flex items-center gap-4">
                  <AreaMark area={area.id} size="lg" />
                  <div className="min-w-0">
                    <h3 className="font-display text-heading font-bold">
                      <Link to="/explorar" search={{ area: area.id }} className="after:absolute after:inset-0 after:rounded-2xl">
                        {area.name}
                        <span className="sr-only">{count > 0 ? ` com ${plural(count, "skill", "skills")}` : ", com as skills em breve"}</span>
                      </Link>
                    </h3>
                    <p className="mt-0.5 text-caption font-medium text-muted-foreground">{area.audience}</p>
                  </div>
                </div>
                <p className="mt-4 text-small leading-relaxed text-muted-foreground text-pretty">{area.pitch}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {shown.map((name) => (
                    <span key={name} className="rounded-full bg-muted px-2 py-0.5 text-micro text-muted-foreground">
                      {name}
                    </span>
                  ))}
                  {rest.length > 0 && (
                    <span title={rest.join(", ")} className="rounded-full border border-dashed border-border px-2 py-0.5 text-micro text-muted-foreground">
                      <span aria-hidden>+{rest.length}</span>
                      <span className="sr-only">e mais {rest.join(", ")}</span>
                    </span>
                  )}
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-6 text-small">
                  {count > 0 ? (
                    <span className={cn("inline-flex items-center gap-1 font-semibold", tone.text)}>
                      {plural(count, "skill", "skills")}
                      <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  ) : (
                    <span className="font-medium text-muted-foreground">Skills em breve</span>
                  )}
                  <span className="relative z-10 flex items-center gap-x-6">
                    <Link
                      to="/academy/trilhas/$area"
                      params={{ area: area.id }}
                      className="inline-flex min-h-6 items-center font-medium text-muted-foreground underline decoration-foreground/30 underline-offset-2 hover:text-foreground"
                    >
                      Capacitação
                      <span className="sr-only"> de {area.name}</span>
                    </Link>
                    <Link
                      to="/metodo/roteiros/$area"
                      params={{ area: area.id }}
                      className="inline-flex min-h-6 items-center font-medium text-muted-foreground underline decoration-foreground/30 underline-offset-2 hover:text-foreground"
                    >
                      Roteiro
                      <span className="sr-only"> de {area.name}</span>
                    </Link>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <UpcomingArea />
      </Container>
    </section>
  );
}
