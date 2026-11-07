import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { BrandArcs } from "@/components/BrandArcs";
import { cn } from "@/lib/utils";
import { continued, type SlidePart } from "./deck-pages";
import { GuideDoc, type AnchorResolver } from "./GuideDoc";
import type { Columns } from "./remark-guides";
import type { Slide } from "./slides";

type Page = SlidePart & { part: number; parts: number };

// One page of a slide on the screen. With measure, the slide whole, laid out out of sight, for the deck to measure: the same
// markup, so the measure and the page match.
export function DeckSlide({
  slide,
  page,
  position,
  count,
  columns,
  resolve,
  measure = false,
}: {
  slide: Slide;
  page?: Page;
  position?: number;
  count?: number;
  columns?: Columns;
  resolve?: AnchorResolver;
  measure?: boolean;
}) {
  const goesOn = page !== undefined && page.part > 1;
  const title = slide.title ?? slide.kicker;
  const content = useRef<HTMLDivElement>(null);
  // The deck lays a page out by the measure of its text at full size, and a page drawn smaller can still break a line more where
  // the letters do not shrink evenly. Drawn, the page checks its height before the screen shows it, and takes the zoom it needs,
  // down to the floor of its text.
  useLayoutEffect(() => {
    const el = content.current;
    const section = el?.parentElement;
    const stage = section?.parentElement;
    if (measure || !page || !el || !section || !stage) return;
    const style = getComputedStyle(section);
    const room = stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    let zoom = Number(el.style.zoom || 1);
    for (let tries = 0; tries < 3; tries++) {
      const height = el.getBoundingClientRect().height;
      const next = Math.max(page.floor, (zoom * room) / height);
      if (height <= room + 0.5 || next >= zoom) break;
      zoom = next;
      el.style.setProperty("zoom", String(zoom));
      el.style.setProperty("--page-zoom", String(zoom));
      el.dataset.zoomed = "";
    }
  }, [measure, page]);
  return (
    <section
      aria-roledescription={measure ? undefined : "slide"}
      aria-label={measure ? undefined : `${position ?? 1} de ${count ?? 1}`}
      className={cn("relative mx-auto flex w-full max-w-6xl flex-col px-[clamp(1.25rem,6vw,6rem)] py-[clamp(2rem,7vh,5rem)]", !measure && "min-h-full")}
    >
      <div
        ref={content}
        data-slide-content
        data-zoomed={page && page.zoom < 1 ? "" : undefined}
        className={cn("relative z-10 my-auto", !measure && "deck-slide")}
        style={page && page.zoom < 1 ? ({ zoom: page.zoom, "--page-zoom": page.zoom } as CSSProperties) : undefined}
      >
        {goesOn ? (
          <p className="eyebrow">{continued(title, page.part, page.parts)}</p>
        ) : (
          <>
            {slide.kicker && <p className="eyebrow">{slide.kicker}</p>}
            {slide.title && (
              <h2
                className={cn(
                  "mt-4 font-display text-balance",
                  slide.cover ? "max-w-[16ch] text-deck-cover font-extrabold" : "max-w-[26ch] text-deck-title font-bold",
                )}
              >
                {slide.number && (
                  <>
                    <span className="mr-[0.4em] align-[0.12em] font-mono text-[0.48em] font-medium tabular-nums text-muted-foreground">{slide.number}</span>{" "}
                  </>
                )}
                {slide.title}
              </h2>
            )}
          </>
        )}
        {slide.body && (!page || page.to > page.from) && (
          <GuideDoc
            source={slide.body}
            level="slide"
            range={page?.range}
            columns={columns}
            resolve={resolve}
            className={cn("slide-text", goesOn ? "mt-6" : slide.title && "mt-8", slide.cover && "max-w-[38em] text-muted-foreground")}
          />
        )}
        {measure && (
          <p data-measure-cont className="eyebrow invisible absolute inset-x-0 top-0">
            {continued(title, 9, 9)}
          </p>
        )}
      </div>
      {slide.cover && !measure && !goesOn && (
        <BrandArcs className="deck-slide pointer-events-none absolute bottom-[5vh] right-[4vw] hidden w-[min(20vw,15rem)] opacity-90 md:block" />
      )}
    </section>
  );
}
