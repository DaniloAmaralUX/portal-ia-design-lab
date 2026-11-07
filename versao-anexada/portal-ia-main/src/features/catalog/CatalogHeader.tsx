import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InlineCode } from "@/components/InlineCode";
import { Container } from "@/components/ui/container";
import { Byline } from "./Byline";

export function CatalogHeader({
  crumbs,
  title,
  meta,
  by,
  summary,
  actions,
}: {
  crumbs: ReactNode[];
  title: string;
  meta: ReactNode;
  // Only the skill pages credit people for now: the plugin page leaves the byline out.
  by?: { creator: string | null; contributors: string[] };
  summary: string;
  actions: ReactNode;
}) {
  return (
    <section className="border-b border-border">
      <Container className="pb-10 pt-8 sm:pt-10">
        <Breadcrumbs items={crumbs} />
        <h1 data-vt-target="title" className="mt-8 w-fit font-display text-title font-extrabold text-balance">
          {title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-muted-foreground lg:gap-x-2.5">{meta}</div>
        {by && <Byline creator={by.creator} contributors={by.contributors} className="mt-4" />}
        <p className="mt-5 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty">
          <InlineCode text={summary} />
        </p>
        <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
      </Container>
    </section>
  );
}
