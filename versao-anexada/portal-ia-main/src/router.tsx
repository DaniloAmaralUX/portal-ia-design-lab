import { createRouter } from "@tanstack/react-router";
import { RouteError } from "@/components/RouteError";
import { PRESENTING } from "@/features/method";
import { routeTree } from "@/routeTree.gen";
import { readStorage, writeStorage } from "@/lib/storage";
import { showWhatIsOnScreen } from "@/lib/reveal";
import { listenForClicks, prepareTransition, trackTransition, withoutTrailingSlash } from "@/lib/view-transition";

const RELOADED_AT_KEY = "chunk-reload:at";
const RELOAD_COOLDOWN_MS = 10_000;

const isPresenting = (location: { search: unknown }) => (location.search as { modo?: string }).modo === PRESENTING;

// A missing chunk (a deploy, or the session ended) reloads once, and only if sessionStorage can hold the mark that says it did, or a blocked storage would loop.
window.addEventListener("vite:preloadError", (event) => {
  const reloadedAt = Number(readStorage("sessionStorage", RELOADED_AT_KEY));
  if (Date.now() - reloadedAt < RELOAD_COOLDOWN_MS) return;
  if (!writeStorage("sessionStorage", RELOADED_AT_KEY, String(Date.now()))) return;
  event.preventDefault();
  window.location.reload();
});

if ("startViewTransition" in document) {
  const original = document.startViewTransition.bind(document);
  document.startViewTransition = ((arg?: Parameters<typeof original>[0]) => {
    const transition = original(arg);
    // A skipped transition (another navigation began, or the tab is in the background) rejects ready and finished, and nobody awaits them: without this the browser reports an unhandled rejection.
    transition.ready.catch(() => undefined);
    transition.finished.catch(() => undefined);
    trackTransition(transition);
    return transition;
  }) as typeof document.startViewTransition;
  listenForClicks();
}

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultErrorComponent: RouteError,
  scrollRestoration: true,
  // Only the heavy pages (the guide and the skill) have a skeleton, shown once the wait passes this; the others keep the current page on screen.
  defaultPendingMs: 400,
  defaultViewTransition: {
    // The transition runs only when the page changes: on an anchor or a filter change the content stays, and a fade would look like a reload.
    types: ({ fromLocation, toLocation, pathChanged }) => {
      if (!fromLocation || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      // The presentation opens over the page and closes back onto it with a motion of its own (globals.css); from one chapter to the
      // next it stays on screen, and a page transition would draw the header and the titles of the page under it over the slides.
      const [wasPresenting, presenting] = [fromLocation, toLocation].map(isPresenting);
      if (wasPresenting || presenting) return wasPresenting === presenting ? false : ["deck", presenting ? "open" : "close"];
      const changed = pathChanged && withoutTrailingSlash(fromLocation.pathname) !== withoutTrailingSlash(toLocation.pathname);
      if (!changed) return false;
      const direction = prepareTransition(fromLocation.pathname, toLocation.pathname);
      return direction ? ["page", direction] : ["page"];
    },
  },
});

// After the scroll of the page is set back, which the router subscribes before this.
router.subscribe("onRendered", showWhatIsOnScreen);

// The presentation leaves the full screen it turned on also when it closes another way than by its own controls: the back button,
// a result of the palette, a link inside a slide. From one chapter to the next it goes on, and so does the full screen.
router.subscribe("onResolved", ({ fromLocation, toLocation }) => {
  if (fromLocation && isPresenting(fromLocation) && !isPresenting(toLocation) && document.fullscreenElement) {
    document.exitFullscreen().catch(() => undefined);
  }
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
