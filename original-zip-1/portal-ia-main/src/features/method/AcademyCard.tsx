import { ArrowRight, BookText } from "lucide-react";
import { getGuide } from "@/data/guides";
import { cn } from "@/lib/utils";
import type { GuideRef } from "./guide-target";
import { GuideLink } from "./GuideLink";

export function AcademyCard({
  id,
  title,
  excerpts,
  className,
}: {
  id: string;
  title: string;
  excerpts: (GuideRef & { title: string })[];
  className?: string;
}) {
  if (!excerpts.length) return null;
  return (
    <section aria-labelledby={id} className={cn("rounded-2xl border border-border bg-card p-5 sm:p-6", className)}>
      <h2 id={id} className="flex items-center gap-2 text-small font-semibold">
        <BookText aria-hidden strokeWidth={1.5} className="size-4 text-muted-foreground" />
        {title}
      </h2>
      <p className="mt-1 text-caption text-muted-foreground">O método por trás, nos guias da Pitang.</p>
      <ul className="mt-3 divide-y divide-border border-t border-border">
        {excerpts.map((t) => (
          <li key={`${t.guide}/${t.chapter ?? ""}#${t.anchor ?? ""}`}>
            <GuideLink slug={t.guide} chapter={t.chapter} hash={t.anchor} className="group flex items-center justify-between gap-4 py-2.5">
              <span className="min-w-0">
                <span className="block text-small font-medium decoration-foreground/30 underline-offset-4 group-hover:underline">
                  {t.title}
                </span>
                <span className="block text-caption text-muted-foreground">{getGuide(t.guide)?.label ?? t.guide}</span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-base) group-hover:translate-x-0.5"
              />
            </GuideLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
