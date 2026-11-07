import { Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";
import { RichText } from "@/components/RichText";
import { SectionHeading } from "./SectionHeading";
import { Container } from "@/components/ui/container";
import { releases } from "@/data/changelog";
import { intervals } from "@/data/intervals";
import { courses } from "@/data/trainings";
import { formatDate } from "@/lib/utils";

type NewsItem =
  | { kind: "Skill"; title: string; date: string; text: string }
  | { kind: "Treinamento"; title: string; date: string; summary: string; to: "/academy/treinamentos/$curso"; params: { curso: string } }
  | { kind: "Intervalo técnico"; title: string; date: string; summary: string; to: "/academy/intervalos/$intervalo"; params: { intervalo: string } };

export function WhatsNewSection() {
  const latest = releases[0];
  const order = ["Added", "Changed", "Removed"];
  const items: NewsItem[] = [
    ...(latest
      ? [...latest.sections]
          .sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
          .flatMap((section) =>
            section.items.map((item) => ({
              kind: "Skill" as const,
              title: section.title,
              date: latest.date ?? "",
              text: item,
            })),
          )
      : []),
    ...courses.map((course) => ({
      kind: "Treinamento" as const,
      title: course.title,
      date: course.lessons.reduce((date, lesson) => (lesson.date > date ? lesson.date : date), ""),
      summary: course.summary,
      to: "/academy/treinamentos/$curso" as const,
      params: { curso: course.slug },
    })),
    ...intervals.map((interval) => ({
      kind: "Intervalo técnico" as const,
      title: interval.title,
      date: interval.date,
      summary: interval.summary,
      to: "/academy/intervalos/$intervalo" as const,
      params: { intervalo: interval.slug },
    })),
  ]
    .filter((item) => item.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  if (items.length === 0) return null;

  return (
    <section className="mt-14 sm:mt-16" aria-labelledby="novidades-title">
      <Container>
        <SectionHeading
          id="novidades-title"
          title="Novidades"
          description="O que há de novo no catálogo de skills e na Academy."
          action={
            <Link
              to="/novidades"
              className="inline-flex items-center gap-1.5 text-small font-semibold link-text"
            >
              Todas as novidades
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          }
        />
        <ul className="reveal-children mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item) =>
            item.kind === "Skill" ? (
              <li key={`${item.kind}-${item.text}`} className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                <p className="flex items-center gap-2 text-caption tabular-nums text-muted-foreground">
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                </p>
                <p className="eyebrow mt-4">{item.title}</p>
                <p className="mt-2 text-small leading-relaxed text-foreground/85">
                  <RichText text={item.text} />
                </p>
              </li>
            ) : (
              <li key={`${item.kind}-${item.title}`}>
                <Link
                  to={item.to}
                  params={item.params}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-[border-color,box-shadow] duration-(--duration-fast) hover:border-foreground/20 hover:shadow-sm"
                >
                  <span className="flex items-center gap-2 text-caption tabular-nums text-muted-foreground">
                    <PlayCircle aria-hidden className="size-4 shrink-0" />
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                  </span>
                  <span className="eyebrow mt-4">{item.kind}</span>
                  <span className="mt-2 font-display text-subheading font-bold text-balance">{item.title}</span>
                  <span className="mt-1.5 line-clamp-3 text-small leading-relaxed text-muted-foreground text-pretty">
                    {item.summary}
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </Container>
    </section>
  );
}
