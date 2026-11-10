import { Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";
import { AreaDot } from "@/components/AreaDot";
import { areaById } from "@/data/areas";
import type { Interval } from "@/data/types";
import { formatDate, formatDuration } from "@/lib/utils";

export function IntervalCard({ interval }: { interval: Interval }) {
  const area = interval.area ? areaById[interval.area] : null;
  return (
    <Link
      to="/academy/intervalos/$intervalo"
      params={{ intervalo: interval.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs interactive-surface"
    >
      <span className="flex items-center gap-2 text-caption tabular-nums text-muted-foreground">
        <PlayCircle aria-hidden className="size-4 shrink-0" />
        <time dateTime={interval.date}>{formatDate(interval.date)}</time>
        {interval.minutes && (
          <>
            <span aria-hidden>·</span>
            {formatDuration(interval.minutes)}
          </>
        )}
      </span>
      <span data-vt="title" className="mt-3 self-start font-display text-subheading font-bold text-balance">
        {interval.title}
      </span>
      <span className="mt-auto flex items-center justify-between gap-2 pt-5 text-caption font-medium text-foreground/85">
        <span className="inline-flex items-center gap-1.5">
          {area ? <AreaDot area={area.id} /> : null}
          {area ? area.name : "Todas as áreas"}
        </span>
        <ArrowRight aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-interaction) motion-safe:group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
