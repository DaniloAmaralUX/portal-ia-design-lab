import { getRouteApi } from "@tanstack/react-router";
import { AreaDot } from "@/components/AreaDot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Crumb } from "@/components/Crumb";
import { NextLink } from "@/components/NextLink";
import { areaById } from "@/data/areas";
import { formatDate, formatDuration } from "@/lib/utils";
import { IntervalVideo } from "./IntervalVideo";
import { LessonSequence } from "./LessonSequence";
import { RecordingText } from "./RecordingText";

const route = getRouteApi("/academy/treinamentos/$curso/$aula");

export function TreinamentoPage() {
  const { training, course, text } = route.useLoaderData();
  const area = training.area ? areaById[training.area] : null;
  const next = course.lessons.find((l) => l.number === training.number + 1);
  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          <Crumb key="a" to="/academy">
            Academy
          </Crumb>,
          <Crumb key="t" to="/academy/treinamentos">
            Treinamentos
          </Crumb>,
          <Crumb key="c" to="/academy/treinamentos/$curso" params={{ curso: course.slug }}>
            {course.title}
          </Crumb>,
        ]}
      />
      <h1 data-vt-target="title" className="mt-6 font-display text-headline font-bold text-balance">
        {training.title}
      </h1>
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-small tabular-nums text-muted-foreground">
        <span>
          Aula {training.number} de {course.lessons.length}
        </span>
        <span aria-hidden>·</span>
        <time dateTime={training.date}>{formatDate(training.date)}</time>
        {training.minutes && (
          <>
            <span aria-hidden>·</span>
            {formatDuration(training.minutes)}
          </>
        )}
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1.5">
          {area && <AreaDot area={area.id} />}
          {area ? area.name : "Todas as áreas"}
        </span>
      </p>
      <IntervalVideo interval={training} className="mt-8" />
      <RecordingText text={text} className="mt-10" />
      <section aria-labelledby="aulas-do-curso" className="mt-14 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 id="aulas-do-curso" className="text-small font-semibold">
          As aulas de {course.title}
        </h2>
        <div className="mt-2">
          <LessonSequence course={course} current={training.number} />
        </div>
        {next && (
          <NextLink
            to="/academy/treinamentos/$curso/$aula"
            params={{ curso: course.slug, aula: String(next.number) }}
            kicker="Próxima aula"
            label={next.title}
          />
        )}
      </section>
    </article>
  );
}
