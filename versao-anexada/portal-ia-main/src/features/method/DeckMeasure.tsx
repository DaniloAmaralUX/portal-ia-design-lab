import { memo, useLayoutEffect, useRef } from "react";
import type { Size } from "@/hooks/use-element-size";
import { CONT_GAP, type BlockBox, type RowBox, type SlideBox } from "./deck-pages";
import { DeckSlide } from "./DeckSlide";
import type { AnchorResolver } from "./GuideDoc";
import type { Slide } from "./slides";

// The slides measured, and the height a page has for them.
export type DeckLayout = { boxes: SlideBox[]; room: number };

// A few pixels of slack, so a rounding of the layout never pushes the last line out of the screen.
const SLACK = 4;

// A line this short is a label when it ends without a full stop, or ends in a colon, or comes right before a code block, a table,
// a quote or a list: it goes to the page that shows what it labels.
const CAPTION_CHARS = 140;

function opens(el: Element | null): boolean {
  return Boolean(el && (el.matches("blockquote, ul, ol") || el.querySelector("pre, table")));
}

function keepsWithNext(el: Element): boolean {
  if (/^H[1-6]$/.test(el.tagName) || el.classList.contains("eyebrow")) return true;
  const text = el.textContent?.trim() ?? "";
  // A figure has no text to end with a full stop, and is no label.
  if (!text && el.querySelector("img")) return false;
  return el.tagName === "P" && text.length <= CAPTION_CHARS && (text.endsWith(":") || !/[.!?…)"”]$/.test(text) || opens(el.nextElementSibling));
}

// The elements that hold the text of a block, whose smallest size sets how far its page can shrink.
const TEXT = "p, li, td, th, code, figcaption";

function textSizeOf(el: Element): number {
  let px = parseFloat(getComputedStyle(el).fontSize);
  for (const text of el.querySelectorAll(TEXT)) px = Math.min(px, parseFloat(getComputedStyle(text).fontSize));
  return px;
}

// The rows a page can turn at inside a box, from the top of the body: the items of a list, the rows of a table under its head,
// the lines of a code block, and the blocks of a quote, which can hold rows of their own. The lines of code do not wrap, so they
// share the height of the code evenly.
function rowsOf(el: Element, top: number): Pick<RowBox, "items" | "rows"> {
  const box = (row: Element, inner: Pick<RowBox, "items" | "rows"> = {}): RowBox => {
    const rect = row.getBoundingClientRect();
    const style = getComputedStyle(row);
    const margins = { before: parseFloat(style.marginTop), after: parseFloat(style.marginBottom) };
    return { top: rect.top - top, bottom: rect.bottom - top, ...margins, keep: keepsWithNext(row), ...inner };
  };
  if (el.matches("ul, ol")) return { items: true, rows: [...el.querySelectorAll(":scope > li")].map((li) => box(li)) };
  if (el.matches("blockquote")) return { rows: [...el.children].map((child) => box(child, rowsOf(child, top))) };
  const table = el.querySelector(":scope > div > table");
  if (table) return { items: true, rows: [...table.querySelectorAll(":scope > tbody > tr")].map((row) => box(row)) };
  const pre = el.querySelector(":scope > pre");
  if (!pre) return {};
  const style = getComputedStyle(pre);
  const lines = (pre.textContent ?? "").replace(/\n$/, "").split("\n").length;
  const first = pre.getBoundingClientRect().top + parseFloat(style.borderTopWidth) + parseFloat(style.paddingTop) - top;
  const line = (pre.scrollHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)) / lines;
  return { items: true, rows: Array.from({ length: lines }, (_, i) => ({ top: first + i * line, bottom: first + (i + 1) * line })) };
}

// The widths of the columns of a table, which every part of the table keeps on the pages. The whole table can be wider than its
// box, when a cell holds a long word.
function columnsOf(el: Element): number[] | undefined {
  const cells = [...el.querySelectorAll(":scope > div > table > thead > tr > th")];
  return cells.length ? cells.map((cell) => Math.round(cell.getBoundingClientRect().width * 10) / 10) : undefined;
}

function blocksOf(body: HTMLElement): BlockBox[] {
  const top = body.getBoundingClientRect().top;
  const blocks: BlockBox[] = [];
  for (const child of body.children) {
    const box = child.getBoundingClientRect();
    const mark = Number(child.getAttribute("data-block") ?? child.querySelector("[data-block]")?.getAttribute("data-block"));
    // A block drawn without its mark takes the place after the one before it, the order the text has.
    const index = Number.isInteger(mark) ? mark : (blocks.at(-1)?.index ?? -1) + 1;
    blocks.push({
      index,
      top: box.top - top,
      bottom: box.bottom - top,
      keep: keepsWithNext(child),
      text: textSizeOf(child),
      ...rowsOf(child, top),
      columns: columnsOf(child),
    });
  }
  return blocks;
}

function layoutOf(root: HTMLElement, height: number): DeckLayout {
  const slides = [...root.querySelectorAll<HTMLElement>("[data-slide-content]")];
  const section = slides[0]?.closest("section");
  const style = section ? getComputedStyle(section) : null;
  const room = height - (style ? parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) : 0) - SLACK;
  const boxes = slides.map((content): SlideBox => {
    const cont = (content.querySelector<HTMLElement>("[data-measure-cont]")?.offsetHeight ?? 0) + CONT_GAP;
    const body = content.querySelector<HTMLElement>(":scope > [data-guide-text]");
    if (!body) return { head: content.getBoundingClientRect().height, cont, blocks: [] };
    return { head: body.getBoundingClientRect().top - content.getBoundingClientRect().top, cont, blocks: blocksOf(body) };
  });
  return { boxes, room };
}

// The slides laid out out of sight, at the width of the screen, to measure. It measures again when the fonts arrive, because
// they change the height of the lines. Each key of the deck renders it again with the same slides, and it would parse the
// Markdown of every slide each time: memo keeps the layout it has.
function MeasuredDeck({
  slides,
  size,
  resolve,
  onLayout,
}: {
  slides: Slide[];
  size: Size;
  resolve?: AnchorResolver;
  onLayout: (layout: DeckLayout) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    let live = true;
    const measure = () => {
      if (live && root.current) onLayout(layoutOf(root.current, size.height));
    };
    measure();
    void document.fonts.ready.then(measure);
    return () => {
      live = false;
    };
  }, [slides, size, onLayout]);
  return (
    <div aria-hidden inert className="pointer-events-none invisible absolute left-0 top-0 h-0 overflow-hidden">
      <div ref={root} style={{ width: size.width }}>
        {slides.map((slide, i) => (
          <DeckSlide key={i} slide={slide} resolve={resolve} measure />
        ))}
      </div>
    </div>
  );
}

export const DeckMeasure = memo(MeasuredDeck);
