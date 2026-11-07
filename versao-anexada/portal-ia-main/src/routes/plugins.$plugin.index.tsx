import { createFileRoute } from "@tanstack/react-router";
import { loadPlugin, PluginPage } from "@/features/catalog";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/plugins/$plugin/")({
  loader: ({ params }) => loadPlugin(params.plugin),
  head: ({ loaderData }) => pageHead(loaderData?.plugin.displayName, loaderData?.plugin.intro),
  component: PluginPage,
});
