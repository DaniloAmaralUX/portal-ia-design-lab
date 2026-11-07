import { createFileRoute } from "@tanstack/react-router";
import { getGuide } from "@/data/guides";
import { ChapterPage, loadChapter } from "@/features/method";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/ferramentas/$guide/$chapter")({
  loader: ({ params }) => loadChapter(params.guide, params.chapter),
  head: ({ loaderData, params }) => {
    const guide = getGuide(params.guide);
    return pageHead(loaderData && guide && `${loaderData.title} · ${guide.label}`, guide?.summary);
  },
  component: ChapterPage,
});
