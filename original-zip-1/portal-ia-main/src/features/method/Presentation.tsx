import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useElementSize } from "@/hooks/use-element-size";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { focusRegion } from "@/hooks/use-route-focus";
import { DeckControls } from "./DeckControls";
import { DeckMeasure, type DeckLayout } from "./DeckMeasure";
import { columnsOf, partsOf } from "./deck-pages";
import { DeckSlide } from "./DeckSlide";
import type { AnchorResolver } from "./GuideDoc";
import { LAST_SLIDE } from "./reading-search";
import type { Slide } from "./slides";

// Where the presentation goes past its first or its last slide: the previous or the next chapter of the guide.
export type DeckStep = { label: string; go: () => void };

export type PresentationProps = {
  title: string;
  slides: Slide[];
  before?: DeckStep;
  after?: DeckStep;
  resolve?: AnchorResolver;
};

type Action = "next" | "prev" | "first" | "last" | "fullscreen";

// The keys of a slide clicker (PageUp and PageDown) and of the presentation programs.
const KEYS: Record<string, Action> = {
  ArrowRight: "next",
  PageDown: "next",
  " ": "next",
  ArrowLeft: "prev",
  PageUp: "prev",
  Home: "first",
  End: "last",
  f: "fullscreen",
  F: "fullscreen",
};

const SWIPE_PX = 56;

function isControl(target: EventTarget): boolean {
  return target instanceof Element && target.closest("a, button, input, textarea, select, summary, [contenteditable]") !== null;
}

// A code block or a table wider than the slide takes the keyboard (ScrollablePre, ScrollableTable): there, the arrows, Home and
// End scroll it sideways, and the keys of the clicker still turn the slides.
const SIDEWAYS = new Set(["ArrowLeft", "ArrowRight", "Home", "End"]);

function scrollsSideways(target: EventTarget, key: string): boolean {
  return SIDEWAYS.has(key) && target instanceof Element && target.closest('[role="region"]') !== null;
}

// Where the deck is: the slide of the text, which the address keeps, and the first unit of the page on the screen (a block, or
// a row of a list, a table or a code block), which survives a new layout (the full screen, a resize) and keeps the same text in sight.
type Cursor = { slide: number; unit: number | "last" };

export function Presentation({
  title,
  slides,
  before,
  after,
  resolve,
  slide,
  onGo,
  onExit,
}: PresentationProps & { slide: number | typeof LAST_SLIDE; onGo: (n: number) => void; onExit: (id: string | null) => void }) {
  const stage = useRef<HTMLDivElement | null>(null);
  const [measureStage, size] = useElementSize<HTMLDivElement>();
  const stageRef = useCallback(
    (el: HTMLDivElement | null) => {
      stage.current = el;
      return measureStage(el);
    },
    [measureStage],
  );
  const [layout, setLayout] = useState<DeckLayout | null>(null);
  const [cursor, setCursor] = useState<Cursor>(() =>
    slide === LAST_SLIDE ? { slide: slides.length, unit: "last" } : { slide, unit: 0 },
  );
  const opener = useRef<HTMLElement | null>(null);
  const landing = useRef<string | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const fullscreen = useFullscreen();

  const parts = useMemo(() => layout?.boxes.map((box) => partsOf(box, layout.room)) ?? null, [layout]);
  const at = Math.min(Math.max(cursor.slide, 1), slides.length);
  const columns = useMemo(() => columnsOf(layout?.boxes[at - 1]), [layout, at]);
  const shown = slides[at - 1];
  const here = parts?.[at - 1] ?? [];
  const { unit } = cursor;
  const found = unit === "last" ? here.length - 1 : here.findIndex((p) => p.from <= unit && unit < Math.max(p.to, p.from + 1));
  const index = Math.max(found, 0);
  const page = here[index];
  const total = parts?.reduce((n, list) => n + list.length, 0) ?? 0;
  const position = (parts?.slice(0, at - 1).reduce((n, list) => n + list.length, 0) ?? 0) + index + 1;

  // The page under the presentation leaves the reach of the keyboard and of the screen readers: the dialog does not hide it,
  // because the page holds the live region of the toasts, which stays out of the inert part.
  useEffect(() => {
    const outside = [...(document.getElementById("root")?.children ?? [])].filter((el) => !el.matches("[aria-live]") && !el.querySelector("[aria-live]"));
    for (const el of outside) el.setAttribute("inert", "");
    return () => {
      for (const el of outside) el.removeAttribute("inert");
    };
  }, []);
  useEffect(() => {
    if (slide !== at) onGo(at);
  }, [slide, at, onGo]);

  const next =
    index < here.length - 1
      ? () => setCursor({ slide: at, unit: here[index + 1]?.from ?? 0 })
      : at < slides.length
        ? () => setCursor({ slide: at + 1, unit: 0 })
        : after?.go;
  const prev =
    index > 0
      ? () => setCursor({ slide: at, unit: here[index - 1]?.from ?? 0 })
      : at > 1
        ? () => setCursor({ slide: at - 1, unit: "last" })
        : before?.go;
  const actions: Record<Action, (() => void) | undefined> = {
    next,
    prev,
    first: () => setCursor({ slide: 1, unit: 0 }),
    last: () => setCursor({ slide: slides.length, unit: "last" }),
    fullscreen: fullscreen.toggle,
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const action = event.key === " " && event.shiftKey ? "prev" : KEYS[event.key];
    if (!action || event.metaKey || event.ctrlKey || event.altKey) return;
    if ((event.key === " " && isControl(event.target)) || scrollsSideways(event.target, event.key)) return;
    event.preventDefault();
    actions[action]?.();
  };

  const onPointerUp = (event: PointerEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > 1.5 * Math.abs(event.clientY - start.y)) (dx < 0 ? next : prev)?.();
  };

  const exit = () => {
    landing.current = shown?.cover ? null : (shown?.id ?? null);
    fullscreen.exit();
    onExit(landing.current);
  };

  if (!shown) return null;
  return (
    <Dialog.Root open onOpenChange={(open) => !open && exit()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-background" />
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={onKeyDown}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            stage.current?.focus();
          }}
          // The focus goes back to the section the reading lands on, or to the switch that opened the presentation, without moving the page.
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (landing.current) focusRegion(landing.current, { preventScroll: true });
            else opener.current?.focus({ preventScroll: true });
          }}
          className="fixed inset-0 z-[60] flex flex-col bg-background text-foreground outline-none"
        >
          <Dialog.Title className="sr-only">Apresentação: {title}</Dialog.Title>
          <div aria-hidden className="h-[3px] shrink-0 bg-border">
            <div
              className="h-full origin-left bg-link transition-[scale] duration-(--duration-slow) ease-(--ease-out-soft)"
              style={{ scale: `${total ? position / total : 0} 1` }}
            />
          </div>
          <div
            ref={stageRef}
            data-deck-stage
            tabIndex={-1}
            onPointerDown={(event) => {
              touch.current = event.pointerType === "touch" ? { x: event.clientX, y: event.clientY } : null;
            }}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              touch.current = null;
            }}
            // A page fits the stage by its measure; if a page ever comes out taller, the stage scrolls rather than cut it.
            className="relative min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain outline-none"
          >
            {size && <DeckMeasure slides={slides} size={size} resolve={resolve} onLayout={setLayout} />}
            {page && (
              <DeckSlide
                // A new size of the screen (the full screen, a resize) lays the slides out again: the page comes in as a new one.
                key={`${at}-${unit}-${size?.width}x${size?.height}`}
                slide={shown}
                page={{ ...page, part: index + 1, parts: here.length }}
                position={position}
                count={total}
                columns={columns}
                resolve={resolve}
              />
            )}
          </div>
          <DeckControls
            position={page ? position : 0}
            count={total}
            title={title}
            prev={{ label: index > 0 || at > 1 ? "Slide anterior" : (before?.label ?? "Slide anterior"), onClick: prev }}
            next={{ label: index < here.length - 1 || at < slides.length ? "Próximo slide" : (after?.label ?? "Próximo slide"), onClick: next }}
            fullscreen={fullscreen}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
