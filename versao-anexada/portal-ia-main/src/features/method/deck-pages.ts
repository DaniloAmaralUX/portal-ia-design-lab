import type { BlockRange, Columns } from "./remark-guides";

// The slides as the screen shows them: the deck measures each slide laid out, and a slide that does not fit shrinks a little, or
// goes on in more pages, cut between blocks, or inside a list, a table, a code block or a quote that does not fit a page by
// itself. Nothing is cut out, and the text stays big enough to read.

// A box the deck measured, from the top of the body of the slide: a block, or a row inside one. Before and after are its
// margins, which go with it to another page. A box that keeps with the next one (a heading, a short line that introduces a code
// block or a list) never ends a page. The rows of a box are items of one kind (the items of a list, the rows of a table under
// its head, the lines of a code block), or the blocks of a quote, which can hold rows of their own.
export type RowBox = { top: number; bottom: number; before?: number; after?: number; keep?: boolean; items?: boolean; rows?: RowBox[] };

// A block of the body, with the size of its smallest text (code and tables are smaller than the prose), and the widths of the
// columns of a table.
export type BlockBox = RowBox & { index: number; keep: boolean; text: number; columns?: number[] };

// A slide laid out: the height of its head (kicker, title and the gap to the body), the head of the pages that go on (the kicker
// with the part), and the blocks of its body.
export type SlideBox = { head: number; cont: number; blocks: BlockBox[] };

// The part of a slide that one screen shows. From and to count the units of the slide (the boxes with no rows to cut), which do
// not change with the screen, so the deck keeps its place on a new layout. The range is what the page draws, and the floor is
// the smallest zoom its text allows.
export type SlidePart = { from: number; to: number; range: BlockRange; zoom: number; floor: number };

// A slide that fits at this share of its type shrinks to fit, rather than break in two; a box of rows too.
const SHRINK = 0.7;
// No text of a slide renders smaller than this, the smallest size the type scales of iOS and Material give to text. At 12px, the
// 16 lines of code of a slide would scroll on a screen of 1280 by 720, where they fit at 11.9px.
const MIN_TEXT_PX = 11;
// And no slide shrinks past this share, whatever the size of its text.
const LEAST_ZOOM = 0.4;
// A page that turns inside a box of four items or more leaves at least this many of them on each side, unless the smallest
// page does not fit even so; then it may also end on a label.
const MIN_ROWS = 2;

// The smallest zoom for text of this size.
export function floorOf(textPx: number): number {
  return Math.min(1, Math.max(LEAST_ZOOM, MIN_TEXT_PX / Math.max(textPx, 1)));
}

// A unit of a page: a box with no rows, and where it sits: the boxes that hold it, from its block down, and its row in each.
type Unit = { block: BlockBox; chain: RowBox[]; path: number[]; leaf: RowBox };

function unitsOf(blocks: BlockBox[]): Unit[] {
  const units: Unit[] = [];
  const visit = (block: BlockBox, box: RowBox, chain: RowBox[], path: number[]) => {
    if (box.rows && box.rows.length > 1) box.rows.forEach((row, i) => visit(block, row, [...chain, box], [...path, i]));
    else units.push({ block, chain, path, leaf: box });
  };
  for (const block of blocks) visit(block, block, [], []);
  return units;
}

// The frame of a box above its first row and below its last one (the border and the padding, the head of a table, the bar of a
// code block), which every part of the box on a page draws again.
function frameTop({ top, rows }: RowBox): number {
  const first = rows?.[0];
  return first ? first.top - (first.before ?? 0) - top : 0;
}

function frameBottom({ bottom, rows }: RowBox): number {
  const last = rows?.at(-1);
  return last ? bottom - last.bottom - (last.after ?? 0) : 0;
}

// Where a page that starts at a unit begins, and where a page that ends at it ends: the frames of the boxes around the unit, and
// the margins of the rows that hold it.
function topOf({ chain, path, leaf }: Unit): number {
  return chain.reduce((top, box, j) => top - frameTop(box) - (box.rows?.[path[j] ?? 0]?.before ?? 0), leaf.top);
}

function bottomOf({ chain, path, leaf }: Unit): number {
  return chain.reduce((bottom, box, j) => bottom + frameBottom(box) + (box.rows?.[path[j] ?? 0]?.after ?? 0), leaf.bottom);
}

// A page shrinks only as far as its smallest text allows.
function floorFor(units: Unit[]): number {
  return floorOf(Math.min(...units.map((unit) => unit.block.text)));
}

function fitted(height: number, room: number, floor: number): number {
  return Math.min(1, Math.max(floor, room / Math.max(height, 1)));
}

function partOf(units: Unit[], from: number, to: number, zoom: number): SlidePart {
  const first = units[from];
  const last = units[to - 1];
  const range: BlockRange = { from: first?.block.index ?? 0, to: (last?.block.index ?? -1) + 1 };
  if (first?.path.some((row) => row > 0)) range.fromRow = first.path;
  const ends = last?.chain.every((box, j) => last.path[j] === (box.rows?.length ?? 0) - 1) ?? true;
  if (last && !ends) range.toRow = [...last.path.slice(0, -1), (last.path.at(-1) ?? 0) + 1];
  return { from, to, range, zoom, floor: floorFor(units.slice(from, to)) };
}

export function partsOf({ head, cont, blocks }: SlideBox, room: number): SlidePart[] {
  const units = unitsOf(blocks);
  const first = blocks[0];
  const last = blocks.at(-1);
  if (!first || !last) return [{ from: 0, to: 0, range: { from: 0, to: 0 }, zoom: fitted(head, room, LEAST_ZOOM), floor: LEAST_ZOOM }];
  const whole = head + last.bottom - first.top;
  if (whole <= room) return [partOf(units, 0, units.length, 1)];
  if (whole * Math.max(SHRINK, floorFor(units)) <= room) return [partOf(units, 0, units.length, room / whole)];
  // The boxes the pages turn inside: only the ones that do not fit, even shrunk, where they start.
  const cut = new Set<RowBox>();
  const shrunk = (height: number, list: Unit[]) => height * Math.max(SHRINK, floorFor(list));
  // Loose 1 lets a page take a single row of a box; loose 2 lets it end on a label too.
  const breaks = (i: number, loose = 0) => {
    const [a, b] = [units[i], units[i + 1]];
    if (!a || !b) return true;
    if (a.block !== b.block) return loose > 1 || !a.block.keep;
    // Two units of a block part at the first row where their places differ, inside a box that must be cut, with the ones around it.
    const level = a.path.findIndex((row, j) => row !== b.path[j]);
    const box = a.chain[level];
    const row = b.path[level] ?? 0;
    if (!box || !a.chain.slice(0, level + 1).every((around) => cut.has(around))) return false;
    const count = box.rows?.length ?? 0;
    const least = count >= 2 * MIN_ROWS && !loose ? MIN_ROWS : 1;
    return box.items ? row >= least && count - row >= least : loose > 1 || !box.rows?.[row - 1]?.keep;
  };
  const leastEnd = (start: number, loose = 0) => {
    let end = start + 1;
    while (end < units.length && !breaks(end - 1, loose)) end++;
    return end;
  };
  // The outermost box not cut yet among some units, the one that holds them in one piece.
  const uncut = (list: Unit[]) => {
    let found: { box: RowBox; depth: number } | undefined;
    for (const { chain } of list) {
      const depth = chain.findIndex((box) => !cut.has(box));
      const box = chain[depth];
      if (box && (!found || depth < found.depth)) found = { box, depth };
    }
    return found?.box;
  };
  const parts: SlidePart[] = [];
  let start = 0;
  let budget = room - head;
  for (let unit = units[start]; unit; unit = units[start]) {
    const top = topOf(unit);
    let end = leastEnd(start);
    // The smallest page does not fit even shrunk: the box that holds it whole is cut, and the page takes its first rows; with
    // nothing left to cut, the page turns where it can (after a single row, or after a label).
    let loose = 0;
    while (shrunk(bottomOf(units[end - 1] ?? unit) - top, units.slice(start, end)) > budget) {
      const box = uncut(units.slice(start, end));
      if (box) cut.add(box);
      else if (loose < 2) loose++;
      else break;
      end = leastEnd(start, loose);
    }
    for (let next = end + 1; next <= units.length; next++) {
      const entering = units[next - 1];
      if (!entering) break;
      // A box too tall for what is left of the page starts here: it is cut if it would not fit a page by itself either.
      for (const [j, box] of entering.chain.entries()) {
        if (cut.has(box)) continue;
        const starts = entering.path.slice(j).every((row) => row === 0);
        if (!starts || box.bottom - top <= budget || shrunk(box.bottom - box.top, [entering]) <= room - cont) break;
        cut.add(box);
      }
      if (bottomOf(entering) - top > budget) break;
      if (breaks(next - 1, loose)) end = next;
    }
    const span = bottomOf(units[end - 1] ?? unit) - top;
    parts.push(partOf(units, start, end, fitted(span, budget, floorFor(units.slice(start, end)))));
    start = end;
    budget = room - cont;
  }
  return parts;
}

// The columns of the tables of a slide, measured on the whole table, by block.
export function columnsOf(box: SlideBox | undefined): Columns | undefined {
  const entries = box?.blocks.flatMap((block) => (block.columns ? [[block.index, block.columns] as const] : [])) ?? [];
  return entries.length ? Object.fromEntries(entries) : undefined;
}

// The head of the pages that go on a slide: its title, with the part.
export function continued(title: string | null, part: number, parts: number): string {
  return `${title ?? ""} · ${part}/${parts}`;
}

// The gap between the head of a page that goes on and its body (the mt-6 of DeckSlide), which the layout of the pages counts.
export const CONT_GAP = 24;
