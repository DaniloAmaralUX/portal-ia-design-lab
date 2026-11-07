import type { ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { textOf } from "@/components/markdown-text";
import { docText, markdownBase, measure } from "@/components/markdown-base";
import { slugify } from "@/lib/text";
import { cn } from "@/lib/utils";

// The id of a heading in a skill's text: the text of the heading as an address-safe slug, with the prefix that keeps it from clashing with the page's own ids.
function headingId(children: ReactNode): string {
  return `doc-${slugify(textOf(children)).slice(0, 64)}`;
}

const skillComponents: Components = {
  ...markdownBase,
  h1: ({ node: _n, ...p }) => (
    <h3
      id={headingId(p.children)}
      className={cn(measure, "mb-3 mt-10 font-display text-doc-heading font-bold text-foreground")}
      {...p}
    />
  ),
  h2: ({ node: _n, ...p }) => (
    <h4
      id={headingId(p.children)}
      className={cn(measure, "mb-2 mt-9 border-b border-border pb-2 font-display text-subheading font-bold text-foreground")}
      {...p}
    />
  ),
  h3: ({ node: _n, ...p }) => (
    <h5
      id={headingId(p.children)}
      className={cn(measure, "mb-1.5 mt-6 text-body font-semibold text-foreground")}
      {...p}
    />
  ),
  h4: ({ node: _n, ...p }) => <h6 className={cn(measure, "eyebrow mb-1 mt-5")} {...p} />,
  a: ({ node: _n, href, ...p }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={external ? href : "#arquivos"}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        title={external ? undefined : `Arquivo da skill: ${href ?? ""}`}
        className="link"
        {...p}
      />
    );
  },
};

export function SkillDoc({ source }: { source: string }) {
  return (
    <div className={docText}>
      <Markdown remarkPlugins={[remarkGfm]} components={skillComponents}>
        {source}
      </Markdown>
    </div>
  );
}
