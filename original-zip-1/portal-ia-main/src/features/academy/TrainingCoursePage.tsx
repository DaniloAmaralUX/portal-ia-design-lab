import { getRouteApi } from "@tanstack/react-router";
import { AreaDot } from "@/components/AreaDot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Crumb } from "@/components/Crumb";
import { NextLink } from "@/components/NextLink";
import { areaById } from "@/data/areas";
import { formatDate, formatDuration, plural } from "@/lib/utils";
import { LessonSequence } from "./LessonSequence";
import { courseMinutes } from "./training-course";

const route = getRouteApi("/academy/treinamentos/$curso/");

export function TrainingCoursePage() {
  const { course } = route.useLoaderData();
  const area = course.area ? areaById[course.area] : null;
  const minutes = courseMinutes(course);
  const first = course.lessons[0];
  const last = course.lessons.at(-1);
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
        ]}
      />
      <h1 data-vt-target="title" className="mt-6 font-display text-headline font-bold text-balance">
        {course.title}
      </h1>
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-small tabular-nums text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          {area && <AreaDot area={area.id} />}
          {area ? area.name : "Todas as áreas"}
        </span>
        <span aria-hidden>·</span>
        {plural(course.lessons.length, "aula", "aulas")}
        {minutes > 0 && (
          <>
            <span aria-hidden>·</span>
            {formatDuration(minutes)}
          </>
        )}
        {first && last && (
          <>
            <span aria-hidden>·</span>
            <span>
              <time dateTime={first.date}>{formatDate(first.date)}</time>
              {last.date !== first.date && (
                <>
                  {" a "}
                  <time dateTime={last.date}>{formatDate(last.date)}</time>
                </>
              )}
            </span>
          </>
        )}
      </p>
      <p className="mt-4 max-w-measure text-lead leading-relaxed text-muted-foreground text-pretty">{course.summary}</p>
      <section aria-labelledby="aulas" className="mt-10 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 id="aulas" className="text-small font-semibold">
          As aulas
        </h2>
        <div className="mt-2">
          <LessonSequence course={course} />
        </div>
        {first && (
          <NextLink
            to="/academy/treinamentos/$curso/$aula"
            params={{ curso: course.slug, aula: String(first.number) }}
            kicker="Comece pela aula 1"
            label={first.title}
          />
        )}
      </section>
    </article>
  );
}
