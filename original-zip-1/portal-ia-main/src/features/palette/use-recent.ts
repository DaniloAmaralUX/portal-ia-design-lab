import { useCallback, useRef, useSyncExternalStore } from "react";
import { useRouter } from "@tanstack/react-router";
import { createStoredSet } from "@/lib/storage";
import { siteHits, type SearchHit } from "@/lib/site-search";
import { hitTarget } from "./palette-hits";

const MAX = 5;
const pages = createStoredSet("palette:recent-pages:v1");
const queries = createStoredSet("palette:recent-queries:v1");

function push(store: typeof pages, value: string) {
  store.write(new Set([value, ...[...store.read()].filter((v) => v !== value)].slice(0, MAX)));
}

// The pages the person opened last, from anywhere in the site, and the searches that led somewhere in the palette. The map from
// address to hit is built on first use, after the page painted, because every page mounts the palette.
export function useRecent(): {
  recentPages: () => { path: string; hit: SearchHit }[];
  queries: string[];
  visit: (path: string) => void;
  searched: (query: string) => void;
} {
  const router = useRouter();
  const byPath = useRef<Map<string, SearchHit> | null>(null);
  const pagePaths = useSyncExternalStore(pages.subscribe, pages.read, pages.empty);
  const recentQueries = useSyncExternalStore(queries.subscribe, queries.read, queries.empty);

  // A section of a guide shares the address of its guide, so only the hits with no anchor stand for a page.
  const lookup = useCallback(() => {
    if (!byPath.current) {
      const map = new Map<string, SearchHit>();
      for (const hit of siteHits()) {
        if (hit.kind === "academy" && hit.doc.anchor) continue;
        const path = router.buildLocation(hitTarget(hit)).pathname;
        if (!map.has(path)) map.set(path, hit);
      }
      byPath.current = map;
    }
    return byPath.current;
  }, [router]);

  const visit = useCallback(
    (path: string) => {
      if (path !== "/" && lookup().has(path)) push(pages, path);
    },
    [lookup],
  );
  const searched = useCallback((query: string) => {
    if (query) push(queries, query);
  }, []);
  const recentPages = () =>
    [...pagePaths].flatMap((path) => {
      const hit = lookup().get(path);
      return hit ? [{ path, hit }] : [];
    });

  return { recentPages, queries: [...recentQueries], visit, searched };
}
