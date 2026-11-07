import { isValidElement, type ReactNode } from "react";
import type { Components } from "react-markdown";
import { citedSkill } from "@/components/cited-skill";
import { CopyButton } from "@/components/CopyButton";
import { textOf } from "@/components/markdown-text";
import { ScrollablePre } from "@/components/ScrollablePre";
import { ScrollableTable } from "@/components/ScrollableTable";
import { SkillCodeLink } from "@/components/SkillCodeLink";
import { cn } from "@/lib/utils";

function languageOf(children: ReactNode): string | null {
  if (!isValidElement<{ className?: string }>(children)) return null;
  const match = /language-([\w+-]+)/.exec(children.props.className ?? "");
  return match?.[1] ?? null;
}

// What tells one code block from another on the page: its language and its first line with words. The button that copies it and
// the region a screen reader lists when it scrolls both take it, so two blocks of a page do not share a name.
function excerptOf(lang: string | null, text: string): string {
  const first = text
    .split("\n")
    .map((line) => line.trim())
    .find((line) => /[\p{L}\p{N}]/u.test(line) && !/^[\w-]+:$/.test(line));
  const start = first ? ` que começa com "${first.length > 40 ? `${first.slice(0, 40)}…` : first}"` : "";
  return `${lang ? ` em ${lang}` : ""}${start}`;
}

export const measure = "max-w-measure";

export const quote = "my-5 rounded-xl bg-muted/60 px-4 py-3 text-foreground/85";

export const markdownBase: Components = {
  p: ({ node: _n, ...p }) => <p className={cn(measure, "my-3.5 text-pretty")} {...p} />,
  ul: ({ node: _n, className, ...p }) => (
    <ul
      className={cn(
        measure,
        "my-3.5 list-disc space-y-1.5 pl-5",
        className?.includes("contains-task-list") &&
          "list-none pl-0 [&>li]:relative [&>li]:ps-6.5 [&>li>label>input]:absolute [&>li>label>input]:start-0 [&>li>label>input]:top-[0.45em] [&>li>label>input]:m-0",
        className,
      )}
      {...p}
    />
  ),
  ol: ({ node: _n, className, ...p }) => (
    <ol className={cn(measure, "my-3.5 list-decimal space-y-1.5 pl-5", className)} {...p} />
  ),
  li: ({ node: _n, className, children, ...p }) =>
    className?.includes("task-list-item") ? (
      <li className={cn("pl-1", className)} {...p}>
        <label>{children}</label>
      </li>
    ) : (
      <li className={cn("pl-1 marker:text-muted-foreground", className)} {...p}>
        {children}
      </li>
    ),
  strong: ({ node: _n, ...p }) => <strong className="font-semibold text-foreground" {...p} />,
  blockquote: ({ node: _n, ...p }) => <blockquote className={cn(measure, quote)} {...p} />,
  hr: ({ node: _n, ...p }) => <hr className="my-8 border-border" {...p} />,
  code: ({ node: _n, className: _c, children: kids, ...rest }) => {
    const skill = typeof kids === "string" ? citedSkill(kids) : undefined;
    if (skill) return <SkillCodeLink skill={skill}>{kids}</SkillCodeLink>;
    return (
      <code className="box-decoration-clone rounded-md border border-border/80 bg-muted px-1.5 py-px font-mono text-[length:max(0.84em,var(--text-micro))] text-foreground" {...rest}>
        {kids}
      </code>
    );
  },
  pre: ({ node: _n, children: kids, ...p }) => {
    const lang = languageOf(kids);
    const code = isValidElement<{ className?: string; children?: ReactNode; "data-block"?: number; "data-copy"?: string }>(kids) ? kids.props : null;
    // A part of a code block on a page of the deck carries the whole block in data-copy, so the button copies all of it.
    const text = code?.["data-copy"] ?? textOf(kids);
    // The Markdown puts the properties of a code block on its <code>, which is drawn again here: the mark of the block goes on the box.
    return (
      <div data-block={code?.["data-block"]} className="relative my-5 overflow-hidden rounded-xl border border-terminal-border bg-terminal">
        <div className="flex items-center justify-between border-b border-terminal-border px-4 py-1">
          <span className="font-mono text-label uppercase text-terminal-muted">{lang ?? "texto"}</span>
          <CopyButton text={text} tone="terminal" message="Trecho copiado" label="Copiar trecho" name={`Copiar o trecho${excerptOf(lang, text)}`} />
        </div>
        <ScrollablePre label={lang ? `Trecho${excerptOf(lang, text)}` : `Trecho de código${excerptOf(lang, text)}`} className="overflow-x-auto px-4 py-3.5 text-terminal-foreground" {...p}>
          <code className={cn("font-mono text-caption leading-[1.7]", code?.className)}>{code ? code.children : kids}</code>
        </ScrollablePre>
      </div>
    );
  },
  table: ({ node: _n, children, ...p }) => {
    // A table the deck cuts between pages carries the widths of the columns it measured on the whole table: each part keeps
    // them, and the width of the whole, so its rows wrap as they did when measured.
    const columns = (p as { "data-columns"?: string })["data-columns"]?.split(" ").map(Number);
    const width = columns?.reduce((sum, column) => sum + column, 0);
    return (
      <div className="my-5 overflow-hidden rounded-xl border border-border">
        <ScrollableTable label="Tabela">
          <table
            className={cn("w-full min-w-[520px] border-collapse text-caption [overflow-wrap:normal]", columns && "table-fixed")}
            style={width ? { width } : undefined}
            {...p}
          >
            {columns && (
              <colgroup>
                {columns.map((column, i) => (
                  <col key={i} style={{ width: column }} />
                ))}
              </colgroup>
            )}
            {children}
          </table>
        </ScrollableTable>
      </div>
    );
  },
  thead: ({ node: _n, ...p }) => <thead className="bg-muted/70" {...p} />,
  tr: ({ node: _n, ...p }) => <tr className="border-b border-border last:border-0" {...p} />,
  // The corner of a table whose first column names its rows says nothing: it is a cell, and not a header with no name.
  th: ({ node, ...p }) =>
    !node || node.children.some((child) => child.type !== "text" || child.value.trim()) ? (
      <th className="px-3.5 py-2.5 text-left font-semibold text-foreground" {...p} />
    ) : (
      <td className="px-3.5 py-2.5" {...p} />
    ),
  td: ({ node: _n, ...p }) => <td className="px-3.5 py-2.5 align-top" {...p} />,
};

export const docText = "text-body leading-[1.75] text-foreground/88 [overflow-wrap:anywhere] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0";
