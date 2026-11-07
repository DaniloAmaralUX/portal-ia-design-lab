import type { Blockquote, Code, List, ListItem, Nodes, Paragraph, Root, Table, TableRow } from "mdast";
import { describe, expect, it } from "vitest";
import { keepRange } from "./remark-guides";

const paragraph = (text: string): Paragraph => ({ type: "paragraph", children: [{ type: "text", value: text }] });
const item = (text: string): ListItem => ({ type: "listItem", spread: false, children: [paragraph(text)] });
const list = (count: number, ordered: boolean, start?: number): List => ({
  type: "list",
  ordered,
  start,
  spread: false,
  children: Array.from({ length: count }, (_, i) => item(`item ${i + 1}`)),
});
const row = (text: string): TableRow => ({ type: "tableRow", children: [{ type: "tableCell", children: [{ type: "text", value: text }] }] });
const table = (count: number): Table => ({ type: "table", children: [row("head"), ...Array.from({ length: count }, (_, i) => row(`row ${i + 1}`))] });
const code = (count: number): Code => ({ type: "code", lang: "bash", value: Array.from({ length: count }, (_, i) => `line ${i + 1}`).join("\n") });

function plain(node: Nodes): string {
  if ("value" in node) return node.value;
  return "children" in node ? node.children.map(plain).join("") : "";
}

describe("a page of a slide", () => {
  it("keeps its blocks, and the items of a list it cuts, with the numbering going on", () => {
    const tree: Root = { type: "root", children: [paragraph("before"), list(13, true, 1), paragraph("after")] };
    keepRange(tree, { from: 1, to: 2, fromRow: [5], toRow: [9] });
    const [part] = tree.children;
    expect(tree.children).toHaveLength(1);
    expect(part?.type === "list" && part.children.map(plain)).toEqual(["item 6", "item 7", "item 8", "item 9"]);
    expect(part?.type === "list" && part.start).toBe(6);
  });

  it("repeats the head of a table on every part", () => {
    const tree: Root = { type: "root", children: [table(10)] };
    keepRange(tree, { from: 0, to: 1, fromRow: [7] });
    const [part] = tree.children;
    expect(part?.type === "table" && part.children.map(plain)).toEqual(["head", "row 8", "row 9", "row 10"]);
  });

  it("keeps the lines of a code block on the page, and the whole block to copy", () => {
    const tree: Root = { type: "root", children: [code(10)] };
    keepRange(tree, { from: 0, to: 1, fromRow: [3], toRow: [6] });
    const [part] = tree.children;
    expect(part?.type === "code" && part.value).toBe("line 4\nline 5\nline 6");
    expect(part?.data?.hProperties?.["data-copy"]).toBe(code(10).value);
  });

  it("does not open or close a part of a code block on a blank line where the page turned", () => {
    const block = (): Code => ({ type: "code", value: "a\nb\n\nc\nd" });
    const start: Root = { type: "root", children: [block()] };
    keepRange(start, { from: 0, to: 1, toRow: [3] });
    expect(start.children.map(plain)).toEqual(["a\nb"]);
    const rest: Root = { type: "root", children: [block()] };
    keepRange(rest, { from: 0, to: 1, fromRow: [2] });
    expect(rest.children.map(plain)).toEqual(["c\nd"]);
  });

  it("cuts the block the page starts in and the block it ends in, and a list without numbers gets no start", () => {
    const tree: Root = { type: "root", children: [list(6, false), paragraph("between"), code(8)] };
    keepRange(tree, { from: 0, to: 3, fromRow: [4], toRow: [2] });
    const [first, , last] = tree.children;
    expect(first?.type === "list" && [first.children.map(plain), first.start]).toEqual([["item 5", "item 6"], undefined]);
    expect(last?.type === "code" && last.value).toBe("line 1\nline 2");
  });

  it("goes down into a quote, to the lines of the code inside it", () => {
    const quote = (): Blockquote => ({ type: "blockquote", children: [paragraph("Gate 1"), paragraph("Trecho:"), code(10)] });
    const start: Root = { type: "root", children: [quote()] };
    keepRange(start, { from: 0, to: 1, toRow: [2, 4] });
    expect(start.children.map(plain)).toEqual(["Gate 1Trecho:line 1\nline 2\nline 3\nline 4"]);
    const rest: Root = { type: "root", children: [quote()] };
    keepRange(rest, { from: 0, to: 1, fromRow: [2, 4] });
    expect(rest.children.map(plain)).toEqual(["line 5\nline 6\nline 7\nline 8\nline 9\nline 10"]);
  });
});
