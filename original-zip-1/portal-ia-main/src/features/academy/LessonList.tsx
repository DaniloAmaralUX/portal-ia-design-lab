import { ArrowUpRight } from "lucide-react";
import { ScrollableTable } from "@/components/ScrollableTable";
import { DisclosureSummary } from "@/components/ui/disclosure";
import { formatDuration, plural } from "@/lib/utils";
import type { Course } from "./courses";
import { FORMAT_LABELS } from "./lesson-format";
import { lessonUrl, type Lesson } from "./lessons";

export function LessonList({ course, lessons }: { course: Course; lessons: Lesson[] }) {
  return (
    <details className="group mt-3 rounded-xl border border-border">
      <DisclosureSummary className="gap-3 rounded-xl px-3.5 py-2.5 text-caption hover:bg-accent/50 group-open:rounded-b-none">
        Ver as {plural(lessons.filter((a) => a.format !== "quiz").length, "aula", "aulas")}, com link e tempo de cada uma
      </DisclosureSummary>
      <div className="border-t border-border">
        <ScrollableTable label={`Aulas de ${course.title}`}>
          <table className="w-full min-w-[420px] border-collapse text-caption">
            <thead className="bg-muted/70">
              <tr>
                <th scope="col" className="px-3.5 py-2 text-left font-semibold">
                  Aula
                </th>
                <th scope="col" className="px-3.5 py-2 text-right font-semibold">
                  Tempo
                </th>
                <th scope="col" className="px-3.5 py-2 text-left font-semibold">
                  Formato
                </th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.slug} className="border-b border-border last:border-0">
                  <td className="px-3.5 py-2">
                    <a
                      href={lessonUrl(course.url, lesson)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-link underline decoration-link/40 underline-offset-2 hover:decoration-link"
                    >
                      <span lang="en">{lesson.title}</span>
                      <ArrowUpRight aria-hidden className="ml-0.5 inline size-3 align-[-0.05em]" />
                      <span className="sr-only"> (abre em outra aba)</span>
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-2 text-right tabular-nums">{formatDuration(lesson.minutes)}</td>
                  <td className="px-3.5 py-2 text-foreground/85">{FORMAT_LABELS[lesson.format]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableTable>
      </div>
    </details>
  );
}
