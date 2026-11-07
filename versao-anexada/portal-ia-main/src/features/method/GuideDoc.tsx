import { Children, memo, useMemo, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import Markdown, { type Components } from "react-markdown";
import { Acronym } from "@/components/Acronym";
import { textOf } from "@/components/markdown-text";
import { docText, markdownBase, measure, quote } from "@/components/markdown-base";
import { ACRONYMS } from "@/data/glossary";
import { cn } from "@/lib/utils";
import { figureOf, isFigure } from "./figures/guide-figures";
import { guideImage, guideImageSize } from "./guide-images";
import { GuideLink } from "./GuideLink";
import { chapterPlugins, guidePlugins, isLabel, slidePlugins, type BlockRange, type Columns } from "./remark-guides";

function numbered(children: ReactNode): ReactNode {
  const [first, ...rest] = Children.toArray(children);
  const hit = typeof first === "string" ? /^(\d+(?:\.\d+)*)\s+/.exec(first) : null;
  if (typeof first !== "string" || !hit) return children;
  return (
    <>
      <span className="mr-1.5 font-mono text-[length:max(0.78em,var(--text-micro))] font-medium tabular-nums text-muted-foreground">{hit[1]}</span>{" "}
      {first.slice(hit[0].length)}
      {rest}
    </>
  );
}

export type AnchorResolver = (id: string) => { guide: string; chapter: string; here: boolean } | null;

function guideComponentsFor(resolve?: AnchorResolver): Components {
  return {
    ...guideComponents,
    ...guideHeadings,
    h5: guideHeadings.h4 as Components["h5"],
    a: ({ node: _node, href = "", children, ...p }) => {
      const hit = resolve && href.startsWith("#") && href !== "#sigla" ? resolve(href.slice(1)) : null;
      if (hit && !hit.here) {
        const hash = hit.chapter === href.slice(1) ? undefined : href.slice(1);
        return (
          <GuideLink slug={hit.guide} chapter={hit.chapter} hash={hash} className="link">
            {children}
          </GuideLink>
        );
      }
      return (
        <GuideAnchor href={href} {...p}>
          {children}
        </GuideAnchor>
      );
    },
  };
}

const guideHeadings = {
  h2: ({ node: _n, children, ...p }: React.ComponentProps<"h2"> & { node?: unknown }) => (
    <h2 className={cn(measure, "mb-4 mt-16 border-b border-border pb-3 font-display text-heading font-bold text-foreground")} {...p}>
      {numbered(children)}
    </h2>
  ),
  h3: ({ node: _n, children, ...p }: React.ComponentProps<"h3"> & { node?: unknown }) => (
    <h3 className={cn(measure, "mb-2.5 mt-10 font-display text-subheading font-bold text-foreground")} {...p}>
      {numbered(children)}
    </h3>
  ),
  h4: ({ node: _n, children, ...p }: React.ComponentProps<"h4"> & { node?: unknown }) => (
    <h4 className={cn(measure, "mb-2 mt-7 text-body font-semibold text-foreground")} {...p}>
      {numbered(children)}
    </h4>
  ),
};

const guideComponents: Components = {
  ...markdownBase,
  p: ({ node, children, ...p }) => {
    const only = node?.children.length === 1 ? node.children[0] : null;
    // A figure of the site is a block of its own: it takes the place of the paragraph that called it, with the mark of the block
    // the deck measures.
    if (only?.type === "element" && only.tagName === "img" && typeof only.properties.src === "string" && isFigure(only.properties.src)) {
      return (
        <div {...p} className="my-8">
          {children}
        </div>
      );
    }
    const text = textOf(children);
    if (only?.type === "element" && only.tagName === "strong" && isLabel(text)) {
      return (
        <p className={cn(measure, "eyebrow mb-0 mt-14 [&+*]:mt-2")} {...p}>
          {text}
        </p>
      );
    }
    return (
      <p className={cn(measure, "my-3.5 text-pretty")} {...p}>
        {children}
      </p>
    );
  },
  img: ({ node: _n, src = "", alt = "", ...p }) => {
    if (isFigure(src)) return figureOf(src, alt);
    const size = guideImageSize(src);
    return (
      <img
        src={guideImage(src)}
        alt={alt}
        {...size}
        // The proportion lets a slide size the figure before it loads (globals.css, .slide-text img).
        style={size ? ({ "--image-ratio": size.width / size.height } as CSSProperties) : undefined}
        loading="lazy"
        className="my-2 h-auto max-w-full rounded-xl outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
        {...p}
      />
    );
  },
  blockquote: ({ node: _n, ...p }) => (
    <blockquote className={cn(measure, quote, "has-[pre]:max-w-none has-[table]:max-w-none")} {...p} />
  ),
  a: ({ node: _n, ...p }) => <GuideAnchor {...p} />,
};

function GuideAnchor({ href = "", children, ...p }: ComponentProps<"a">) {
  if (href === "#sigla") {
    const tip = ACRONYMS[textOf(children)];
    return tip && !("data-repeated" in p) ? <Acronym tip={tip}>{children}</Acronym> : <>{children}</>;
  }
  const [, guideSlug, guideHash] = /^\/(?:academy|metodo)\/([\w-]+)(?:#([\w-]+))?$/.exec(href) ?? [];
  if (guideSlug) {
    return (
      <GuideLink slug={guideSlug} hash={guideHash} className="link">
        {children}
      </GuideLink>
    );
  }
  if (href === "/" || href === "/explorar") {
    return (
      <Link to={href} className="link">
        {children}
      </Link>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="link" {...p}>
      {children}
    </a>
  );
}

const PLUGINS = { guide: guidePlugins, chapter: chapterPlugins };

// The page renders again with the same text at each slide of the presentation over it (the slide is in the address): memo keeps
// the Markdown it parsed.
function GuideMarkdown({
  source,
  level = "guide",
  range,
  columns,
  resolve,
  className,
}: {
  source: string;
  level?: keyof typeof PLUGINS | "slide";
  range?: BlockRange;
  columns?: Columns;
  resolve?: AnchorResolver;
  className?: string;
}) {
  const components = useMemo(() => guideComponentsFor(resolve), [resolve]);
  const { from, to, fromRow, toRow } = range ?? {};
  const plugins = useMemo(
    () =>
      level === "slide"
        ? slidePlugins(from === undefined || to === undefined ? undefined : { from, to, fromRow, toRow }, columns)
        : PLUGINS[level],
    [level, from, to, fromRow, toRow, columns],
  );
  return (
    <div data-guide-text className={cn(docText, className)}>
      <Markdown remarkPlugins={plugins} components={components}>
        {source}
      </Markdown>
    </div>
  );
}

export const GuideDoc = memo(GuideMarkdown);
