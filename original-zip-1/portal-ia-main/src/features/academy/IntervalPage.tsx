import { getRouteApi } from "@tanstack/react-router";
import { AreaDot } from "@/components/AreaDot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Crumb } from "@/components/Crumb";
import { areaById } from "@/data/areas";
import { formatDate, formatDuration } from "@/lib/utils";
import { IntervalVideo } from "./IntervalVideo";
import { RecordingText } from "./RecordingText";

const route = getRouteApi("/academy/intervalos/$intervalo");

export function IntervalPage() {
  const { interval, text } = route.useLoaderData();
  const area = interval.area ? areaById[interval.area] : null;
  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          <Crumb key="a" to="/academy">
            Academy
          </Crumb>,
          <Crumb key="i" to="/academy/intervalos">
            Intervalos técnicos
          </Crumb>,
        ]}
      />
      <h1 data-vt-target="title" className="mt-6 font-display text-headline font-bold text-balance">
        {interval.title}
      </h1>
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-small tabular-nums text-muted-foreground">
        <time dateTime={interval.date}>{formatDate(interval.date)}</time>
        {interval.minutes && (
          <>
            <span aria-hidden>·</span>
            {formatDuration(interval.minutes)}
          </>
        )}
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1.5">
          {area && <AreaDot area={area.id} />}
          {area ? area.name : "Todas as áreas"}
        </span>
      </p>
      <IntervalVideo interval={interval} className="mt-8" />
      <RecordingText text={text} className="mt-10" />
    </article>
  );
}
