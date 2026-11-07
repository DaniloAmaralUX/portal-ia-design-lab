import { cn } from "@/lib/utils";

// The outline of a page, as in a documentation site: groups with a label, one thin rule on the left of each list, and the item
// the reading is on marked on that rule, in the colour of the reading progress bar.
export const outlineTitle = "eyebrow mb-4";

export const outlineGroupLabel = "mb-2 block text-micro font-semibold text-foreground [overflow-wrap:anywhere]";

export const outlineList = "space-y-0.5 border-l border-border";

export function outlineLink(current: boolean, marker = current): string {
  return cn(
    "-ml-px flex items-start gap-2 border-l py-1 pl-3 text-caption leading-snug transition-colors duration-(--duration-fast) [overflow-wrap:anywhere]",
    marker ? "border-link" : "border-transparent",
    current ? "font-medium text-foreground" : "text-muted-foreground hover:border-foreground/30 hover:text-foreground",
  );
}

export function outlineSubLink(current: boolean): string {
  return cn(
    "-ml-px flex items-start gap-2 border-l py-1 pl-6 text-micro leading-snug transition-colors duration-(--duration-fast) [overflow-wrap:anywhere]",
    current ? "border-link text-foreground" : "border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground",
  );
}

// The number of a chapter or a section, as in the titles and the cross-references of the guides ("seção 2.8"), in a column as wide
// as the longest one ("11.13"), so the titles line up. Next to a title of caption size, it takes the line of the title, so the two
// share a baseline; next to a sub-item, of its own size, it needs nothing. In a list where any item has a number, an item with none
// keeps the empty column, so its title lines up with the others.
export const outlineNumber = "w-[5ch] shrink-0 font-mono text-micro tabular-nums leading-[calc(var(--text-caption)*1.375)]";
export const outlineSubNumber = "w-[5ch] shrink-0 font-mono tabular-nums";
