import { describe, expect, it } from "vitest";
import { CELL, lettersOf, MARK, MARK_BOX, markPaths, rowsOf, TOOLKIT, wordWidth } from "./catalyst-mark";

// The mark as the full screen of the catalyst draws it, in crates/catalyst-cli/src/screen/lines.rs.
const BINARY = [
  " ██████╗ █████╗ ████████╗ █████╗ ██╗  ██╗   ██╗███████╗████████╗",
  "██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██║  ╚██╗ ██╔╝██╔════╝╚══██╔══╝",
  "██║     ███████║   ██║   ███████║██║   ╚████╔╝ ███████╗   ██║   ",
  "██║     ██╔══██║   ██║   ██╔══██║██║    ╚██╔╝  ╚════██║   ██║   ",
  "╚██████╗██║  ██║   ██║   ██║  ██║███████╗██║   ███████║   ██║   ",
  " ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝   ╚═╝   ",
];

describe("the mark of the catalyst", () => {
  it("sets the letters of the font as the binary does, cell for cell, in 64 columns by 6 rows", () => {
    expect(MARK).toEqual(BINARY);
    expect(lettersOf("CATALYST").map((l) => l.column)).toEqual([0, 8, 16, 25, 33, 38, 47, 55]);
    expect(MARK_BOX).toEqual({ width: 64 * CELL.width, height: 6 * CELL.height });
  });

  it("sets the other words of the page in the same font, as figlet does, with a space between two words", () => {
    expect(rowsOf("CLAUDE")[0]).toBe(" ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗");
    expect(rowsOf("CLAUDE")[5]).toBe(" ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝");
    expect(wordWidth("DE IA")).toBe(wordWidth("DE") + 3 + wordWidth("IA"));
    for (const word of ["CLAUDE CODE", "CODEX", "AGENTES DE IA"]) expect(rowsOf(word)).toHaveLength(6);
  });

  it("writes toolkit a letter every two cells, under the right end of the mark, as the casa does", () => {
    expect(TOOLKIT.map((t) => t.letter).join("")).toBe("toolkit");
    expect(TOOLKIT.map((t) => t.column)).toEqual([50, 52, 54, 56, 58, 60, 62]);
  });

  it("draws every character of the font: the blocks and each of the double lines", () => {
    const known = new Set([" ", "█", "═", "║", "╗", "╔", "╚", "╝"]);
    expect(MARK.flatMap((row) => [...row]).filter((char) => !known.has(char))).toEqual([]);
    const lines = (char: string) => markPaths([char]).lines;
    for (const char of ["═", "║", "╗", "╔", "╚", "╝"]) expect(lines(char).match(/M/g), char).toHaveLength(2);
  });

  it("fills each run of blocks of a row as one rectangle, from the column of its letter", () => {
    expect(markPaths(["██ ███"]).blocks.match(/Z/g)).toHaveLength(2);
    expect(markPaths(["██ ███"]).lines).toBe("");
    expect(markPaths(["█"], 2).blocks).toMatch(/^M12 0H18/);
  });
});
