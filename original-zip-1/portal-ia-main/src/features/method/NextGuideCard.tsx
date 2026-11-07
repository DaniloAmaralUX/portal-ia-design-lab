import { ArrowRight } from "lucide-react";
import type { Guide } from "@/data/guides";
import { cn } from "@/lib/utils";
import { GuideLink } from "./GuideLink";

export function NextGuideCard({ guide, className }: { guide: Guide; className?: string }) {
  if (!guide.next) return null;
  return (
    <GuideLink
      slug={guide.next.slug}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-4 transition-colors hover:border-foreground/25 sm:flex-row sm:items-center sm:gap-5",
        className,
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-caption font-semibold text-foreground/85">{guide.next.eyebrow}</span>
        <span className="mt-1 block text-small font-semibold text-foreground">{guide.next.title}</span>
        <span className="mt-1 block max-w-md text-caption leading-relaxed text-foreground/85">{guide.next.text}</span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-caption font-semibold text-foreground">
        Abrir o guia
        <ArrowRight aria-hidden className="size-3.5 transition-transform duration-(--duration-base) group-hover:translate-x-0.5" />
      </span>
    </GuideLink>
  );
}
