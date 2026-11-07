import { createFileRoute } from "@tanstack/react-router";
import { IntervalPage, loadInterval } from "@/features/academy";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/academy/intervalos/$intervalo")({
  loader: ({ params }) => loadInterval(params.intervalo),
  head: ({ loaderData }) => pageHead(loaderData && `Intervalo técnico: ${loaderData.interval.title}`, loaderData?.interval.summary),
  component: IntervalPage,
});
