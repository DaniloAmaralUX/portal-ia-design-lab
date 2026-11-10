import { Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { intervals } from "@/data/intervals";
import { courses } from "@/data/trainings";
import { formatDate } from "@/lib/utils";
import { SectionHeading } from "@/features/home/SectionHeading";

type AcademyNewsItem =
  | { kind: "Treinamento"; title: string; date: string; to: "/academy/treinamentos/$curso"; params: { curso: string } }
  | { kind: "Intervalo técnico"; title: string; date: string; to: "/academy/intervalos/$intervalo"; params: { intervalo: string } };

const recentItems = (): AcademyNewsItem[] =>
  [
    ...courses.map((course) => ({
      kind: "Treinamento" as const,
      title: course.title,
      date: course.lessons.reduce((latest, lesson) => (lesson.date > latest ? lesson.date : latest), ""),
      to: "/academy/treinamentos/$curso" as const,
      params: { curso: course.slug },
    })),
    ...intervals.map((interval) => ({
      kind: "Intervalo técnico" as const,
      title: interval.title,
      date: interval.date,
      to: "/academy/intervalos/$intervalo" as const,
      params: { intervalo: interval.slug },
    })),
  ]
    .filter((item) => item.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

export function RecentAcademySection({ className }: { className?: string }) {
  const items = recentItems();
  if (items.length === 0) return null;

  return (
    <section className={className} aria-labelledby="academy-novidades-title">
      <Container>
        <SectionHeading
          id="academy-novidades-title"
          title="Novidades da Academy"
          description="Os treinamentos e intervalos técnicos publicados mais recentemente."
          action={
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-small font-semibold">
              <Link to="/academy/treinamentos" className="inline-flex items-center gap-1.5 link-text">
                Treinamentos <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link to="/academy/intervalos" className="inline-flex items-center gap-1.5 link-text">
                Intervalos <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          }
        />
        <ul className="reveal-children mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item) => (
            <li key={`${item.kind}-${item.title}`}>
              <Link
                to={item.to}
                params={item.params}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs interactive-surface"
              >
                <span className="flex items-center gap-2 text-caption tabular-nums text-muted-foreground">
                  <PlayCircle aria-hidden className="size-4 shrink-0" />
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                </span>
                <span className="eyebrow mt-4">{item.kind}</span>
                <span className="mt-2 font-display text-subheading font-bold text-balance">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
