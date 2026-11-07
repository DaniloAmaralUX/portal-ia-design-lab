import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { InlineCode } from "@/components/InlineCode";
import { ReadMark } from "@/components/ReadMark";
import type { RoadmapStep } from "@/data/roadmaps";
import { showStep } from "./roadmap-step";

const itemClass = "group flex items-start gap-4 py-4 transition-colors duration-(--duration-fast) hover:bg-accent/40";

export function RoadmapItem({ step, readIds }: { step: RoadmapStep; readIds: ReadonlySet<string> }) {
  const { label, title, detail, readId, link } = showStep(step);
  return (
    <Link {...link} className={itemClass}>
      <span className="min-w-0 flex-1">
        <span className="eyebrow block">{label}</span>
        <span className="mt-1 flex items-center gap-2 text-body font-semibold decoration-foreground/30 underline-offset-4 group-hover:underline">
          {title}
          {readId && readIds.has(readId) && <ReadMark />}
        </span>
        {detail && <span className="block text-caption text-muted-foreground">{detail}</span>}
        <span className="mt-1 block text-small leading-relaxed text-foreground/85 text-pretty">
          <InlineCode text={step.reason} />
        </span>
      </span>
      <ArrowRight aria-hidden className="mt-6 size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-base) group-hover:translate-x-0.5" />
    </Link>
  );
}
