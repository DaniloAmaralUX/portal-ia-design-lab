import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge knows only the default Tailwind sizes, so it reads text-heading as a colour and drops it next to text-foreground; the names are the theme's, in globals.css.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "display-wide",
        "title",
        "headline",
        "stat",
        "heading",
        "doc-heading",
        "subheading",
        "lead",
        "field",
        "body",
        "small",
        "caption",
        "micro",
        "label",
        "deck-cover",
        "deck-title",
      ],
      container: ["measure"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const integer = new Intl.NumberFormat("pt-BR");

export function formatInteger(n: number): string {
  return integer.format(n);
}

export function plural(n: number, one: string, many: string): string {
  return `${formatInteger(n)}\u00a0${n === 1 ? one : many}`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}\u00a0h${m ? ` ${m}\u00a0min` : ""}` : `${m}\u00a0min`;
}

export function scrollActiveIntoView(box: HTMLElement, selector = "[aria-current]", behavior: ScrollBehavior = "auto") {
  const current = box.querySelector<HTMLElement>(selector);
  if (!current) return;
  const c = box.getBoundingClientRect();
  const a = current.getBoundingClientRect();
  if (a.top < c.top || a.bottom > c.bottom) box.scrollBy({ top: a.top - c.top - box.clientHeight / 3, behavior });
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

// The value of an address parameter when it is one of the allowed ones, and undefined for any other, so a hand-edited link does not break the page.
export function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return allowed.find((item) => item === value);
}
