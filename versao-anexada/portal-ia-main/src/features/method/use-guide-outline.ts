import { useMemo } from "react";
import { chapterBody, sectionsOf, tableOfContents } from "@/lib/guide-text";
import { useGuideMatch } from "./use-guide-match";

// What the outline of a guide lists: the chapters, with the sections of the open one, or the sections of a guide read whole. The
// menu shows it too, from outside the route of the guide, and there the data of the guide is missing while the guide loads: the
// outline lists nothing until it comes.
export function useGuideOutline() {
  const { guide: data, chapter: open } = useGuideMatch();
  const source = open?.loaderData?.source;
  const sections = useMemo(() => (source ? sectionsOf(chapterBody(source)) : []), [source]);
  const items = useMemo(() => (!data || data.index ? [] : tableOfContents(data.guide, data.doc ?? "")), [data]);
  return {
    guide: data?.guide ?? null,
    chapters: data?.index?.chapters ?? null,
    current: open?.params.chapter,
    sections,
    items,
    ids: (data?.index ? sections : items).map((s) => s.id),
  };
}
