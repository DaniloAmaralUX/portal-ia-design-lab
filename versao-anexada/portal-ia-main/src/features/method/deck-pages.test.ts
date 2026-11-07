import { describe, expect, it } from "vitest";
import { floorOf, partsOf, type BlockBox, type RowBox } from "./deck-pages";

// Blocks of the given heights, one after the other with a gap of 10. Text of 30px lets a page shrink to the least zoom, 0.4.
function stack(heights: number[], keep: number[] = [], text = 30): BlockBox[] {
  let top = 0;
  return heights.map((height, index) => {
    const block = { index, top, bottom: top + height, keep: keep.includes(index), text };
    top += height + 10;
    return block;
  });
}

// A box of rows of the given height, like the lines of a code block: 40 of frame above the rows (the bar and the padding) and
// 30 below.
function rowsBox(top: number, count: number, height = 20): RowBox {
  const rows = Array.from({ length: count }, (_, i) => ({ top: top + 40 + i * height, bottom: top + 40 + (i + 1) * height }));
  return { top, bottom: top + 40 + count * height + 30, items: true, rows };
}

function rowsBlock(index: number, top: number, count: number, text = 30, height = 20): BlockBox {
  return { ...rowsBox(top, count, height), index, keep: false, text };
}

const ranges = (parts: ReturnType<typeof partsOf>) => parts.map((part) => part.range);

describe("the parts of a slide on the screen", () => {
  it("shows a slide that fits whole, at its size", () => {
    expect(partsOf({ head: 100, cont: 40, blocks: stack([100, 100]) }, 400)).toEqual([{ from: 0, to: 2, range: { from: 0, to: 2 }, zoom: 1, floor: 0.4 }]);
  });

  it("shrinks a slide a little too tall, instead of breaking it", () => {
    const [part] = partsOf({ head: 100, cont: 40, blocks: stack([200, 190]) }, 450);
    expect(part?.range).toEqual({ from: 0, to: 2 });
    expect(part?.zoom).toBeCloseTo(450 / 500);
  });

  it("breaks a slide much too tall between blocks, and keeps a heading with the block after it", () => {
    const parts = partsOf({ head: 100, cont: 40, blocks: stack([100, 100, 30, 150, 100], [2]) }, 400);
    expect(ranges(parts)).toEqual([
      { from: 0, to: 2 },
      { from: 2, to: 5 },
    ]);
    expect(parts.map((part) => part.zoom)).toEqual([1, 1]);
  });

  it("keeps a heading and the line under it together with the block they open", () => {
    const parts = partsOf({ head: 100, cont: 40, blocks: stack([100, 30, 30, 300], [1, 2]) }, 400);
    expect(ranges(parts)).toEqual([
      { from: 0, to: 1 },
      { from: 1, to: 4 },
    ]);
    expect(parts[1]?.zoom).toBeCloseTo(360 / 380);
  });

  it("gives a block taller than the screen a page of its own, shrunk to fit", () => {
    const parts = partsOf({ head: 100, cont: 40, blocks: stack([100, 900, 100]) }, 400);
    expect(ranges(parts).map(({ from, to }) => [from, to])).toEqual([
      [0, 1],
      [1, 2],
      [2, 3],
    ]);
    expect(parts[1]?.zoom).toBeCloseTo(360 / 900);
  });

  it("never shrinks the text below 11px, even for a block that still does not fit", () => {
    const parts = partsOf({ head: 100, cont: 40, blocks: stack([100, 900, 100], [], 17) }, 400);
    expect(parts[1]?.zoom).toBeCloseTo(11 / 17);
    expect(parts[0]?.zoom).toBe(1);
  });

  it("lets each page shrink only as far as its smallest text allows, so code stops before the prose", () => {
    const prose = stack([100, 480, 100], [], 17);
    expect(partsOf({ head: 100, cont: 40, blocks: prose }, 400)[1]).toMatchObject({ from: 1, to: 2, range: { from: 1, to: 2 }, zoom: 0.75 });
    const code = prose.map((block) => (block.index === 1 ? { ...block, text: 14 } : block));
    expect(partsOf({ head: 100, cont: 40, blocks: code }, 400)[1]?.zoom).toBeCloseTo(11 / 14);
  });

  it("does not shrink a slide whole below what its smallest text allows", () => {
    expect(partsOf({ head: 100, cont: 40, blocks: stack([200, 190], [], 17) }, 380)).toHaveLength(1);
    expect(partsOf({ head: 100, cont: 40, blocks: stack([200, 190], [], 14) }, 380)).toHaveLength(2);
  });

  it("ends a page on a label only when the smallest page with the block it opens does not fit even shrunk", () => {
    const parts = partsOf({ head: 0, cont: 0, blocks: stack([30, 30, 300], [0, 1], 17) }, 220);
    expect(ranges(parts)).toEqual([
      { from: 0, to: 2 },
      { from: 2, to: 3 },
    ]);
    expect(parts[1]?.zoom).toBeCloseTo(220 / 300);
    expect(parts[1]?.floor).toBeCloseTo(11 / 17);
  });

  it("sets the smallest zoom from the size of the text", () => {
    expect(floorOf(22)).toBeCloseTo(0.5);
    expect(floorOf(40)).toBe(0.4);
    expect(floorOf(10)).toBe(1);
  });

  it("shows a slide with no body at its size, or shrunk when the title alone is too tall", () => {
    expect(partsOf({ head: 200, cont: 40, blocks: [] }, 400)).toMatchObject([{ from: 0, to: 0, range: { from: 0, to: 0 }, zoom: 1 }]);
    expect(partsOf({ head: 800, cont: 40, blocks: [] }, 400)[0]?.zoom).toBeCloseTo(0.5);
  });
});

describe("a block of rows across pages", () => {
  it("is cut between two rows when it does not fit a page even shrunk, and each part draws the frame again", () => {
    const parts = partsOf({ head: 50, cont: 40, blocks: [rowsBlock(0, 0, 20)] }, 300);
    expect(ranges(parts)).toEqual([
      { from: 0, to: 1, toRow: [9] },
      { from: 0, to: 1, fromRow: [9], toRow: [18] },
      { from: 0, to: 1, fromRow: [18] },
    ]);
    expect(parts.map(({ from, to, zoom }) => [from, to, zoom])).toEqual([
      [0, 9, 1],
      [9, 18, 1],
      [18, 20, 1],
    ]);
  });

  it("goes whole to the next page when it fits a page of its own, shrunk if it must", () => {
    const parts = partsOf({ head: 50, cont: 40, blocks: [...stack([100]), rowsBlock(1, 110, 8)] }, 250);
    expect(ranges(parts)).toEqual([
      { from: 0, to: 1 },
      { from: 1, to: 2 },
    ]);
    expect(parts[1]?.zoom).toBeCloseTo(210 / 230);
  });

  it("leaves at least two of its rows on each side of a cut", () => {
    const parts = partsOf({ head: 0, cont: 0, blocks: [rowsBlock(0, 0, 10, 11)] }, 260);
    expect(ranges(parts)).toEqual([
      { from: 0, to: 1, toRow: [8] },
      { from: 0, to: 1, fromRow: [8] },
    ]);
  });

  it("takes the short line that opens it along with its first rows", () => {
    const caption: BlockBox = { index: 0, top: 0, bottom: 30, keep: true, text: 30 };
    const [first] = partsOf({ head: 0, cont: 0, blocks: [caption, rowsBlock(1, 40, 20)] }, 200);
    expect(first?.range).toEqual({ from: 0, to: 2, toRow: [4] });
  });

  it("leaves a single row on a page only when the smallest page with two does not fit even shrunk", () => {
    const caption: BlockBox = { index: 0, top: 0, bottom: 30, keep: true, text: 30 };
    expect(ranges(partsOf({ head: 0, cont: 0, blocks: [caption, rowsBlock(1, 40, 4, 30, 100)] }, 200))).toEqual([
      { from: 0, to: 2, toRow: [1] },
      { from: 1, to: 2, fromRow: [1], toRow: [2] },
      { from: 1, to: 2, fromRow: [2] },
    ]);
  });

  it("is cut even between two rows only, when they are tall and do not fit a page together", () => {
    expect(ranges(partsOf({ head: 0, cont: 0, blocks: [rowsBlock(0, 0, 2, 30, 200)] }, 300))).toEqual([
      { from: 0, to: 1, toRow: [1] },
      { from: 0, to: 1, fromRow: [1] },
    ]);
  });

  it("goes down into a quote: the quote is cut between its blocks, and the code inside it between two lines", () => {
    const label = { top: 12, bottom: 40, before: 0, after: 14, keep: true };
    const intro = { top: 54, bottom: 82, before: 14, after: 14, keep: true };
    const code = { ...rowsBox(102, 20), before: 20, after: 20 };
    const quote: BlockBox = { index: 0, top: 0, bottom: 604, keep: false, text: 30, rows: [label, intro, code] };
    expect(ranges(partsOf({ head: 0, cont: 0, blocks: [quote] }, 300))).toEqual([
      { from: 0, to: 1, toRow: [2, 4] },
      { from: 0, to: 1, fromRow: [2, 4], toRow: [2, 12] },
      { from: 0, to: 1, fromRow: [2, 12] },
    ]);
  });
});
