import { InlineCode } from "@/components/InlineCode";
import type { Guide } from "@/data/guides";

export function GuideTitle({ guide }: { guide: Guide }) {
  return (
    <>
      <h1 data-vt-target="title" className="mt-6 w-fit font-display text-headline font-bold text-balance">
        {guide.title}
      </h1>
      <p className="mt-3 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty">
        <InlineCode text={guide.summary} />
      </p>
    </>
  );
}
