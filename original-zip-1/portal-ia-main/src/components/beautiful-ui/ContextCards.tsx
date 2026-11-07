// Adapted from Beautiful UI Copy code: https://www.beautifului.dev/#context-cards
import { Link, type LinkProps } from "@tanstack/react-router";
import { ContextCard } from "./ContextCard";



/* ─────────────────────────────────────────────────────────
 * CONTEXT CARDS
 * Retrieved chunks enter once, then remain available.
 * ───────────────────────────────────────────────────────── */

export type ContextChunk = {
  title: string;
  chars: string;
  body: string;
  source: string;
  badge: string;
  tone: string;
  href: NonNullable<LinkProps["to"]>;
};

export type ContextCardsLabels = {
  header: string;
  count: string;
};

export function ContextCards({
  chunks,
  labels,
  className,
}: {
  /** Accepted for gallery/registry parity; ContextCards has no visual variants. */
  variant?: string;
  chunks: ContextChunk[];
  labels?: Partial<ContextCardsLabels>;
  className?: string;
}) {
  const copy = { header: "Guias", count: String(chunks.length), ...labels };

  return (
    <div className={`flex w-full max-w-none flex-col gap-2${className ? ` ${className}` : ""}`}>
      <div
        className="flex items-center gap-2 px-0.5"
        
      >
        <span className="text-[13px] font-semibold text-foreground">{copy.header}</span>
        <span className="inline-flex h-5 items-center rounded-md bg-muted px-1.5 text-[11.5px] font-medium text-muted-foreground  tabular-nums">
          {copy.count}
        </span>
      </div>

      {chunks.map((chunk) => (
        <ContextCard key={chunk.title}>
          <div className="px-4 py-3 flex items-center gap-2.5 border-b border-border">
            <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-foreground">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
              <span className="truncate">{chunk.title}</span>
            </span>
            <span className="ml-auto shrink-0 text-[12px] text-muted-foreground tabular-nums">{chunk.chars}</span>
          </div>
          <p className="px-3 pt-2 pb-1 text-[12.5px] leading-relaxed text-muted-foreground">
            {chunk.body}
          </p>
          <div className="px-3 pb-3">
            <Link to={chunk.href}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-muted px-2
                text-[12px] font-medium text-muted-foreground 
                transition-[opacity,transform,background-color] duration-300 hover:bg-accent"
            >
              <span className={`flex size-5 items-center justify-center rounded-[4px] ${chunk.tone} text-[10px] font-semibold`}>
                {chunk.badge}
              </span>
              {chunk.source}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
            </Link>
          </div>
        </ContextCard>
      ))}
    </div>
  );
}
