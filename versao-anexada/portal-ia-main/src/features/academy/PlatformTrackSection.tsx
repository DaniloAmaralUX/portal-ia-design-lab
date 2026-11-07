import { Fragment } from "react";
import { platformOf, totalsOf } from "./courses";
import { Progress } from "@/components/Progress";
import { phaseId } from "./track-outline";
import { TrackCourse } from "./TrackCourse";
import { PHASES, PRIORITIES, stepsOf, type PlatformTrack } from "./training";
import { coursesFor, durationLabel } from "./training-text";
import { useCompletedCourses } from "./use-completed-courses";

export function PlatformTrackSection({ track }: { track: PlatformTrack }) {
  const platform = platformOf(track.platform);
  const totals = totalsOf(track);
  const { completed } = useCompletedCourses();
  const all = stepsOf(track);
  const position = new Map(all.map((step, i) => [step, i + 1]));
  const columns = [...PRIORITIES.map((c) => ({ label: c.name, total: totals[c.id] })), { label: "Total", total: totals.total }];
  return (
    <section id={track.platform} aria-labelledby={`${track.platform}-titulo`} className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <h2 id={`${track.platform}-titulo`} className="font-display text-heading font-bold">
            {platform.name}
          </h2>
          <p className="mt-1 text-caption text-muted-foreground">{platform.domain}</p>
        </div>
        <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-micro font-medium text-foreground/85">{platform.language}</span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {columns.map(({ label, total }) => (
          <div key={label} className="bg-card px-3.5 py-2.5">
            <dt className="eyebrow">{label}</dt>
            <dd className="mt-0.5 font-display text-subheading font-bold tabular-nums">
              {durationLabel(total)}
              <span className="block font-sans text-caption font-normal text-muted-foreground">{coursesFor(total)}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4">
        <p className="text-caption font-medium text-foreground/85">Seu andamento nesta plataforma</p>
        <Progress completed={all.filter((p) => completed.has(p.courseId)).length} total={all.length} noun="cursos feitos" className="mt-1.5" />
      </div>
      <p className="mt-5 text-small leading-relaxed text-pretty">
        <strong className="font-semibold">Recomendação:</strong> {track.recommendation}.
      </p>
      <p className="mt-1 max-w-measure text-small leading-relaxed text-muted-foreground text-pretty">{track.coverage}</p>

      {PHASES.map((phase, i) => {
        const steps = track.phases[phase.id];
        const first = steps[0];
        if (!first) return null;
        return (
          <Fragment key={phase.id}>
            {/* The flex gap separates the number and the name on screen; the name of the heading says them as one phrase, which the
                content alone would read as "Fase 1Fundamentos". */}
            <h3
              id={phaseId(track.platform, i)}
              aria-label={`Fase ${i + 1}: ${phase.name}`}
              className="mt-10 flex items-baseline gap-2.5 font-display text-subheading font-bold"
            >
              <span className="eyebrow">Fase {i + 1}</span>
              {phase.name}
            </h3>
            <ol aria-label={`${platform.name}, fase ${i + 1}: ${phase.name}`} start={position.get(first)} className="mt-3">
              {steps.map((step) => (
                <TrackCourse key={step.courseId} step={step} position={position.get(step) ?? 0} />
              ))}
            </ol>
          </Fragment>
        );
      })}
    </section>
  );
}
