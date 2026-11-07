const TRAVELLING_TITLE = "travelling-title";
const ITEM = '[data-vt="title"]';
// A row whose title sits outside its link: its first link opens the page, and stretches over the row, title included.
const ROW = "[data-vt-row]";
const DESTINATION_SELECTOR = '[data-vt-target="title"]';

// A title is text, or a picture of the name, like the mark of the catalyst.
type Title = HTMLElement | SVGElement;
const isTitle = (el: Element | null): el is Title => el instanceof HTMLElement || el instanceof SVGElement;
type Travel = { direction: "forward" | "back"; from: string };

export const withoutTrailingSlash = (path: string) => path.replace(/(.)\/+$/, "$1");

let named: Title[] = [];
let pending: { origin: string; forward: boolean } | null = null;
let generation = 0;
let clicked: Element | null = null;
let travel: Travel | null = null;

// The way the title travels in the transition under way, and the page it leaves, while the transition lasts: forward, from the
// item that was clicked into the title of the page; back, from the title into the item. A page reads it as it draws, to stand
// whole under the title that comes in: a mark that types itself, or a page that comes in part by part, would play over it.
export const travelling = () => travel;

export function listenForClicks() {
  document.addEventListener(
    "click",
    (e) => {
      clicked = e.target instanceof Element ? e.target.closest("a[href]") : null;
    },
    { capture: true },
  );
}

function pathOf(el: Element): string | null {
  const link = el.closest("a[href]") ?? el.querySelector("a[href]") ?? el.closest(ROW)?.querySelector("a[href]");
  return link instanceof HTMLAnchorElement ? withoutTrailingSlash(link.pathname) : null;
}

function isInView(el: Element): boolean {
  const r = el.getBoundingClientRect();
  const x = r.left + Math.min(r.width / 2, 24);
  const y = r.top + r.height / 2;
  if (r.width === 0 || y < 0 || y > window.innerHeight) return false;
  const topmost = document.elementFromPoint(x, y);
  const area = el.closest(ROW) ?? el;
  return Boolean(topmost && (area.contains(topmost) || topmost.contains(el)));
}

function itemOf(link: Element): Element | null {
  if (link.matches(ITEM)) return link;
  const row = link.closest(ROW);
  // Only the first link of a row carries the title: the others open the same page in another way, like the presentation.
  return link.querySelector(ITEM) ?? link.closest(ITEM) ?? (row?.querySelector("a[href]") === link ? row.querySelector(ITEM) : null);
}

function assignTransitionName(el: Title | null | undefined): boolean {
  if (!el) return false;
  el.style.setProperty("view-transition-name", TRAVELLING_TITLE);
  named.push(el);
  return true;
}

function clear() {
  for (const el of named) el.style.removeProperty("view-transition-name");
  named = [];
}

export function prepareTransition(from: string, to: string): "forward" | "back" | null {
  clear();
  const link = clicked;
  clicked = null;
  const item = link?.isConnected && pathOf(link) === withoutTrailingSlash(to) ? itemOf(link) : null;
  const forward = isTitle(item) && isInView(item) && assignTransitionName(item);
  const back = !forward && assignTransitionName(document.querySelector<Title>(DESTINATION_SELECTOR));
  pending = { origin: withoutTrailingSlash(from), forward };
  const direction = forward ? "forward" : back ? "back" : null;
  travel = direction && { direction, from: pending.origin };
  return direction;
}

export function trackTransition(viewTransition: ViewTransition) {
  const current = pending;
  pending = null;
  if (!current) return;
  const mine = ++generation;
  viewTransition.updateCallbackDone.then(
    () => {
      if (mine !== generation || !named.length) return;
      clear();
      if (current.forward) assignTransitionName(document.querySelector<Title>(DESTINATION_SELECTOR));
      else assignTransitionName([...document.querySelectorAll<Title>(ITEM)].find((el) => pathOf(el) === current.origin && isInView(el)));
    },
    () => undefined,
  );
  void viewTransition.finished
    .catch(() => undefined)
    .finally(() => {
      if (mine !== generation) return;
      clear();
      travel = null;
    });
}
