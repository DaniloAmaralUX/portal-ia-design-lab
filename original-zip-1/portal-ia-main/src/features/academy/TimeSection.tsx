import { ScrollableTable } from "@/components/ScrollableTable";
import { cn, formatDuration, plural } from "@/lib/utils";
import { platformOf, totalsOf } from "./courses";
import { PriorityBadge } from "./PriorityBadge";
import { PriorityLegend } from "./PriorityLegend";
import { PRIORITIES, type PlatformTrack } from "./training";
import { coursesFor, durationLabel } from "./training-text";

export function TimeSection({ platforms }: { platforms: PlatformTrack[] }) {
  const minimum = platforms.reduce(
    (total, t) => {
      const essentials = totalsOf(t).essential;
      return { courses: total.courses + essentials.courses, minutes: total.minutes + essentials.minutes };
    },
    { courses: 0, minutes: 0 },
  );
  return (
    <section aria-labelledby="tempo-da-trilha" className="mt-12">
      <h2 id="tempo-da-trilha" className="font-display text-heading font-bold">
        Tempo da trilha por classificação
      </h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <ScrollableTable label="Tempo da trilha por plataforma e classificação">
          <table className="w-full min-w-[520px] border-collapse text-caption">
            <thead className="bg-muted/70">
              <tr>
                <th scope="col" className="px-3.5 py-2.5 text-left font-semibold">
                  Plataforma
                </th>
                {PRIORITIES.map((c) => (
                  <th key={c.id} scope="col" className="px-3.5 py-2.5 text-right font-semibold">
                    <PriorityBadge priority={c.id} />
                  </th>
                ))}
                <th scope="col" className="px-3.5 py-2.5 text-right font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((t) => {
                const totals = totalsOf(t);
                return (
                  <tr key={t.platform} className="border-b border-border last:border-0">
                    <th scope="row" className="px-3.5 py-2.5 text-left font-semibold">
                      <a href={`#${t.platform}`} className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
                        {platformOf(t.platform).name}
                      </a>
                    </th>
                    {[...PRIORITIES.map((c) => totals[c.id]), totals.total].map((total, i) => (
                      <td key={i} className="px-3.5 py-2.5 text-right tabular-nums">
                        <span className={cn("block whitespace-nowrap", total.courses ? "text-small font-semibold" : "text-muted-foreground")}>{durationLabel(total)}</span>
                        {total.courses > 0 && <span className="block text-muted-foreground">{coursesFor(total)}</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollableTable>
      </div>
      <p className="mt-3 max-w-md text-caption leading-relaxed text-muted-foreground">
        O mínimo da trilha são os essenciais das três plataformas: {plural(minimum.courses, "curso", "cursos")},{" "}
        {formatDuration(minimum.minutes)}. Recomendados e opcionais entram depois, conforme disponibilidade e projeto.
      </p>
      <PriorityLegend className="mt-6" />
    </section>
  );
}
