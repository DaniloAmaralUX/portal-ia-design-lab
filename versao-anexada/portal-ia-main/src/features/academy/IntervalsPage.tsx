import { getRouteApi, Link } from "@tanstack/react-router";
import { AreaDot } from "@/components/AreaDot";
import { EmptyState } from "@/components/EmptyState";
import { areaById, areas } from "@/data/areas";
import { intervals } from "@/data/intervals";
import { cn, plural } from "@/lib/utils";
import { IntervalCard } from "./IntervalCard";

const route = getRouteApi("/academy/intervalos/");

const chip = "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-small font-medium transition-colors";
const chipActive = "border-foreground bg-foreground text-background";
const chipIdle = "border-border bg-card text-foreground/85 hover:border-foreground/30 hover:text-foreground";

export function IntervalsPage() {
  const { area } = route.useSearch();
  const list = area ? intervals.filter((i) => i.area === area) : intervals;
  return (
    <div className="max-w-4xl">
      <header>
        <p className="eyebrow">Academy · intervalos técnicos</p>
        <h1 className="mt-3 font-display text-title font-extrabold text-balance">Intervalos técnicos</h1>
        <p className="mt-4 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty">
          As gravações dos intervalos técnicos da Pitang. Cada intervalo abre com o vídeo e o texto que explica o que foi mostrado.
        </p>
      </header>

      {intervals.length > 0 && (
        <nav aria-label="Filtrar por área" className="mt-8 flex flex-wrap gap-2">
          <Link to="/academy/intervalos" search={{}} aria-current={area ? undefined : "page"} className={cn(chip, area ? chipIdle : chipActive)}>
            Todas as áreas
          </Link>
          {areas.map((a) => (
            <Link
              key={a.id}
              to="/academy/intervalos"
              search={{ area: a.id }}
              aria-current={area === a.id ? "page" : undefined}
              className={cn(chip, area === a.id ? chipActive : chipIdle)}
            >
              <AreaDot area={a.id} />
              {a.name}
            </Link>
          ))}
        </nav>
      )}

      {list.length > 0 ? (
        <>
          <p className="mt-6 text-small text-muted-foreground" aria-live="polite">
            {plural(list.length, "intervalo", "intervalos")}
            {area ? ` de ${areaById[area].name}` : ""}
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-3 @2xl:grid-cols-3">
            {list.map((interval) => (
              <li key={interval.slug}>
                <IntervalCard interval={interval} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-8">
          <EmptyState
            title={area ? `Nenhum intervalo de ${areaById[area].name} ainda` : "Nenhum intervalo técnico publicado ainda"}
            description={area ? "Os intervalos das outras áreas continuam em Todas as áreas." : "Cada intervalo aparece aqui quando a gravação e o texto dele forem publicados."}
          >
            {area && (
              <Link to="/academy/intervalos" search={{}} className="text-small link">
                Ver todos os intervalos
              </Link>
            )}
          </EmptyState>
        </div>
      )}
    </div>
  );
}
