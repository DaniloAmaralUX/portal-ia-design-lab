import { createRootRoute } from "@tanstack/react-router";
import { RouteError } from "@/components/RouteError";
import { NotFoundPage, RootLayout } from "@/features/shell";
import { SITE_TITLE } from "@/lib/page-head";
import { SITE_DESCRIPTION } from "@/shared/brand";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: RouteError,
});
