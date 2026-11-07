import type { Nodes, Root, RootContent } from "mdast";
import type { Options } from "react-markdown";
import remarkGfm from "remark-gfm";

// The {#id} at the end of a heading becomes its id. A slide drops it, because the text it came from stays on the page under the presentation, and an id must not repeat.
function remarkHeadingIds({ ids = true }: { ids?: boolean } = {}) {
  const visit = (node: Nodes) => {
    if (node.type === "heading") {
      const last = node.children.at(-1);
      const hit = last?.type === "text" ? /\s*\{#([\w-]+)\}\s*$/.exec(last.value) : null;
      if (last?.type === "text" && hit) {
        last.value = last.value.slice(0, hit.index);
        if (ids) node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: hit[1] } };
      }
    }
    if ("children" in node) node.children.forEach(visit);
  };
  return (tree: Root) => visit(tree);
}

function plainText(node: Nodes): string {
  if ("value" in node) return node.value;
  return "children" in node ? node.children.map(plainText).join("") : "";
}

export function isLabel(text: string): boolean {
  return text === text.toUpperCase() && /\p{Lu}/u.test(text);
}

function remarkAcronyms() {
  return (tree: Root) => {
    let seen = new Set<string>();
    const visit = (node: Nodes) => {
      if (node.type === "paragraph" && node.children.length === 1 && node.children[0]?.type === "strong" && isLabel(plainText(node))) return;
      if (node.type === "heading" && node.depth === 2) seen = new Set();
      if (node.type === "link" && node.url === "#sigla") {
        const text = plainText(node);
        if (seen.has(text)) node.data = { ...node.data, hProperties: { ...node.data?.hProperties, "data-repeated": "" } };
        seen.add(text);
      }
      if ("children" in node) node.children.forEach(visit);
    };
    visit(tree);
  };
}

export const guidePlugins = [remarkGfm, remarkHeadingIds, remarkAcronyms];

function remarkHeadingLevels({ start = 2 }: { start?: 2 | 3 } = {}) {
  return (tree: Root) => {
    const levels = new Set<number>();
    const collect = (node: Nodes) => {
      if (node.type === "heading") levels.add(node.depth);
      if ("children" in node) node.children.forEach(collect);
    };
    collect(tree);
    const levelMap = new Map([...levels].sort((a, b) => a - b).map((d, i) => [d, Math.min(6, start + i) as 2 | 3 | 4 | 5 | 6]));
    const apply = (node: Nodes) => {
      if (node.type === "heading") node.depth = levelMap.get(node.depth) ?? node.depth;
      if ("children" in node) node.children.forEach(apply);
    };
    apply(tree);
  };
}

export const chapterPlugins = [...guidePlugins, remarkHeadingLevels];

// Each block of a slide carries its place in the text, so the deck can measure it and turn the page between two blocks.
function remarkBlockIndex() {
  return (tree: Root) => {
    for (const [i, node] of tree.children.entries()) node.data = { ...node.data, hProperties: { ...node.data?.hProperties, "data-block": i } };
  };
}

// The widths of the columns of the tables of a slide, as the deck measured them on the whole table, by block. A part of a table
// on a page keeps them, so its rows wrap, and take the height, they took in the whole table.
export type Columns = Record<number, number[]>;

function remarkColumns(columns: Columns) {
  return (tree: Root) => {
    for (const [i, node] of tree.children.entries()) {
      const shares = columns[i];
      if (node.type === "table" && shares) node.data = { ...node.data, hProperties: { ...node.data?.hProperties, "data-columns": shares.join(" ") } };
    }
  };
}

// The blocks of one page of a slide, from and to. A page that starts or ends inside a block carries where, as a path of rows
// from the block down: [2, 7] is the line 7 of the third block of a quote. To counts the last row of the path out.
export type BlockRange = { from: number; to: number; fromRow?: number[]; toRow?: number[] };

// The rows of a node: the items of a list, whose numbering goes on; the rows of a table, under its head; the lines of a code
// block, whose copy button still copies the whole block; the blocks of a quote, which can hold rows of their own.
function keepRows(node: RootContent, from: number, to?: number): RootContent[] {
  if (node.type === "list") {
    node.children = node.children.slice(from, to);
    if (node.ordered) node.start = (node.start ?? 1) + from;
  } else if (node.type === "table") {
    const [head, ...rows] = node.children;
    node.children = head ? [head, ...rows.slice(from, to)] : [];
  } else if (node.type === "code") {
    const copy = node.data?.hProperties?.["data-copy"] ?? node.value;
    node.data = { ...node.data, hProperties: { ...node.data?.hProperties, "data-copy": copy } };
    const lines = node.value.split("\n");
    const kept = lines.slice(from, to);
    // A part does not open or close on a blank line where the page turned; the edge it keeps whole stays as it is, so a second
    // cut of the same block still counts the lines from the top.
    while (from > 0 && kept.length > 1 && !kept[0]?.trim()) kept.shift();
    while (to !== undefined && to < lines.length && kept.length > 1 && !kept.at(-1)?.trim()) kept.pop();
    node.value = kept.join("\n");
  } else if (node.type === "blockquote") {
    node.children = node.children.slice(from, to);
    return node.children;
  }
  return [];
}

function keepFrom(node: RootContent, [row = 0, ...rest]: number[]): void {
  const [first] = keepRows(node, row);
  if (first && rest.length) keepFrom(first, rest);
}

function keepTo(node: RootContent, [row = 0, ...rest]: number[]): void {
  const kept = keepRows(node, 0, rest.length ? row + 1 : row);
  const last = kept[row];
  if (last && rest.length) keepTo(last, rest);
}

export function keepRange(tree: Root, { from, to, fromRow, toRow }: BlockRange): void {
  tree.children = tree.children.slice(from, to);
  const last = tree.children.at(-1);
  if (last && toRow) keepTo(last, toRow);
  const first = tree.children[0];
  if (first && fromRow) keepFrom(first, fromRow);
}

// Keeps one page of the slide. It runs last, so the levels of the headings are the ones of the whole slide.
function remarkRange(range: BlockRange) {
  return (tree: Root) => keepRange(tree, range);
}

// The slide shows its own title, so the headings inside it start one level below, and none carries an id.
export function slidePlugins(range?: BlockRange, columns?: Columns): NonNullable<Options["remarkPlugins"]> {
  const plugins: NonNullable<Options["remarkPlugins"]> = [
    remarkGfm,
    [remarkHeadingIds, { ids: false }],
    remarkAcronyms,
    remarkBlockIndex,
    [remarkHeadingLevels, { start: 3 }],
  ];
  if (columns) plugins.push([remarkColumns, columns]);
  if (range) plugins.push([remarkRange, range]);
  return plugins;
}
