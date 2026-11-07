// The mark of the catalyst in the ANSI Shadow font, 64 columns by 6 rows, as its full screen draws it (crates/catalyst-cli/src/
// screen/lines.rs, in pitang-dev-cli), with "toolkit" spaced in the row under its right end.

// The letters of the font the mark uses, 6 rows each: the ones of the mark, and the ones of the words the page of the product writes
// in it.
const GLYPHS: Record<string, string[]> = {
  C: [" ██████╗", "██╔════╝", "██║     ", "██║     ", "╚██████╗", " ╚═════╝"],
  A: [" █████╗ ", "██╔══██╗", "███████║", "██╔══██║", "██║  ██║", "╚═╝  ╚═╝"],
  T: ["████████╗", "╚══██╔══╝", "   ██║   ", "   ██║   ", "   ██║   ", "   ╚═╝   "],
  L: ["██╗     ", "██║     ", "██║     ", "██║     ", "███████╗", "╚══════╝"],
  Y: ["██╗   ██╗", "╚██╗ ██╔╝", " ╚████╔╝ ", "  ╚██╔╝  ", "   ██║   ", "   ╚═╝   "],
  S: ["███████╗", "██╔════╝", "███████╗", "╚════██║", "███████║", "╚══════╝"],
  D: ["██████╗ ", "██╔══██╗", "██║  ██║", "██║  ██║", "██████╔╝", "╚═════╝ "],
  E: ["███████╗", "██╔════╝", "█████╗  ", "██╔══╝  ", "███████╗", "╚══════╝"],
  U: ["██╗   ██╗", "██║   ██║", "██║   ██║", "██║   ██║", "╚██████╔╝", " ╚═════╝ "],
  O: [" ██████╗ ", "██╔═══██╗", "██║   ██║", "██║   ██║", "╚██████╔╝", " ╚═════╝ "],
  X: ["██╗  ██╗", "╚██╗██╔╝", " ╚███╔╝ ", " ██╔██╗ ", "██╔╝ ██╗", "╚═╝  ╚═╝"],
  G: [" ██████╗ ", "██╔════╝ ", "██║  ███╗", "██║   ██║", "╚██████╔╝", " ╚═════╝ "],
  N: ["███╗   ██╗", "████╗  ██║", "██╔██╗ ██║", "██║╚██╗██║", "██║ ╚████║", "╚═╝  ╚═══╝"],
  I: ["██╗", "██║", "██║", "██║", "██║", "╚═╝"],
};

// The columns a space takes between two words.
const SPACE = 3;

const ROWS = 6;
const widthOf = (rows: string[]) => Math.max(...rows.map((row) => [...row].length));
const edge = (row: string, from: "start" | "end") => {
  const chars = [...row];
  const at = from === "start" ? chars.findIndex((c) => c !== " ") : chars.findLastIndex((c) => c !== " ");
  return at < 0 ? null : at;
};

// Each letter of the word at its column, set as the font sets it: the next letter moves left until, in some row, it touches the
// letter before, so the foot of the L runs under the arm of the Y. A space is a letter with nothing in it, three columns wide.
export function lettersOf(word: string): { column: number; rows: string[] }[] {
  const placed: { column: number; rows: string[] }[] = [];
  let floor = 0;
  for (const letter of word) {
    const end = Math.max(0, ...placed.map((p) => p.column + widthOf(p.rows)));
    if (letter === " ") {
      placed.push({ column: end, rows: Array.from({ length: ROWS }, () => " ".repeat(SPACE)) });
      floor = end + SPACE;
      continue;
    }
    const rows = GLYPHS[letter];
    if (!rows) throw new Error(`The mark has no letter ${letter}.`);
    let column = floor;
    for (const before of placed) {
      for (let r = 0; r < ROWS; r++) {
        const right = edge(before.rows[r] ?? "", "end");
        const left = edge(rows[r] ?? "", "start");
        if (right !== null && left !== null) column = Math.max(column, before.column + right + 1 - left);
      }
    }
    placed.push({ column, rows });
  }
  return placed;
}

// The word as the screen shows it: the letters laid over each other, each cell from the letter that has something in it.
export function rowsOf(word: string): string[] {
  const letters = lettersOf(word);
  const width = wordWidth(word);
  return Array.from({ length: ROWS }, (_row, r) =>
    Array.from({ length: width }, (_cell, c) => {
      const owner = letters.find(({ column, rows }) => (([...(rows[r] ?? "")][c - column] ?? " ") !== " "));
      return owner ? ([...(owner.rows[r] ?? "")][c - owner.column] ?? " ") : " ";
    }).join(""),
  );
}

// The columns of a word set in the font.
export const wordWidth = (word: string) => Math.max(0, ...lettersOf(word).map((l) => l.column + widthOf(l.rows)));

export const MARK = rowsOf("CATALYST");

// A cell of the terminal, in the units of the drawing: half as wide as tall, as a terminal cell is.
export const CELL = { width: 6, height: 12 };
// Half the gap between the two strokes of a double line.
const GAP = 1.2;
// The blocks of one row reach a little into the next, so the rows meet with no seam where the screen rounds a pixel.
const BLEED = 0.3;

const corner = (x: number, y: number, x2: number, y2: number, x3: number, y3: number) => `M${x} ${y}L${x2} ${y2}L${x3} ${y3}`;

// The two strokes of each line of the font, in a cell whose corner is (x, y): a terminal draws these characters edge to edge, and
// a font in the browser leaves a gap between two rows.
function strokes(char: string, x: number, y: number): string | null {
  const { width: w, height: h } = CELL;
  const [cx, cy, g] = [x + w / 2, y + h / 2, GAP];
  const paths: Record<string, string> = {
    "═": `M${x} ${cy - g}H${x + w}M${x} ${cy + g}H${x + w}`,
    "║": `M${cx - g} ${y}V${y + h}M${cx + g} ${y}V${y + h}`,
    "╗": corner(x, cy - g, cx + g, cy - g, cx + g, y + h) + corner(x, cy + g, cx - g, cy + g, cx - g, y + h),
    "╔": corner(x + w, cy - g, cx - g, cy - g, cx - g, y + h) + corner(x + w, cy + g, cx + g, cy + g, cx + g, y + h),
    "╚": corner(cx - g, y, cx - g, cy + g, x + w, cy + g) + corner(cx + g, y, cx + g, cy - g, x + w, cy - g),
    "╝": corner(cx + g, y, cx + g, cy + g, x, cy + g) + corner(cx - g, y, cx - g, cy - g, x, cy - g),
  };
  return Object.hasOwn(paths, char) ? (paths[char] ?? null) : null;
}

// Rows of the font as two paths, from the column `at`: the blocks, filled, with each run of blocks in a row as one rectangle, and
// the double lines, stroked.
export function markPaths(rows: string[], at = 0): { blocks: string; lines: string } {
  const blocks: string[] = [];
  const lines: string[] = [];
  const x = (c: number) => (at + c) * CELL.width;
  rows.forEach((row, r) => {
    const y = r * CELL.height;
    const chars = [...row];
    let run = -1;
    const close = (c: number) => blocks.push(`M${x(run)} ${y}H${x(c)}V${y + CELL.height + BLEED}H${x(run)}Z`);
    chars.forEach((char, c) => {
      if (char === "█" && run < 0) run = c;
      if (char !== "█" && run >= 0) {
        close(c);
        run = -1;
      }
      const line = strokes(char, x(c), y);
      if (line) lines.push(line);
    });
    if (run >= 0) close(chars.length);
  });
  return { blocks: blocks.join(""), lines: lines.join("") };
}

const COLUMNS = [...(MARK[0] ?? "")].length;

// "toolkit" in the row under the mark, a letter every two cells, ending a column before the end of the mark, as the casa of the
// catalyst writes it.
export const TOOLKIT = [..."toolkit"].map((letter, i, all) => ({ letter, column: COLUMNS - 2 - (all.length - 1 - i) * 2 }));

export const MARK_BOX = { width: COLUMNS * CELL.width, height: ROWS * CELL.height };
