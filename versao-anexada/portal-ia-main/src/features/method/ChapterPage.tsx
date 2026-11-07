import { ChapterView } from "./ChapterView";
import { useGuideMatch } from "./use-guide-match";

export function ChapterPage() {
  const { guide: data, chapter: open } = useGuideMatch();
  const chapters = data?.index?.chapters ?? [];
  const i = chapters.findIndex((c) => c.id === open?.params.chapter);
  const chapter = chapters[i];
  const source = open?.loaderData?.source;
  if (!data?.index || !chapter || source === undefined) return null;
  return <ChapterView key={chapter.id} guide={data.guide} chapters={chapters} anchors={data.index.anchors} i={i} chapter={chapter} source={source} />;
}
