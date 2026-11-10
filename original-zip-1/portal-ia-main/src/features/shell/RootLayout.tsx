import { useEffect } from "react";
import { HeadContent, Outlet } from "@tanstack/react-router";
import * as Tooltip from "@radix-ui/react-tooltip";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CommandPalette } from "@/features/palette";
import { focusRegion, useRouteFocus } from "@/hooks/use-route-focus";
import { useGlobalShortcuts } from "./use-shortcuts";
import { useUi } from "@/store/ui";
import { AppToaster } from "./AppToaster";

export function RootLayout() {
  useGlobalShortcuts();
  useRouteFocus("conteudo");
  useEffect(() => useUi.getState().syncTheme(), []);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => (document.documentElement.dataset.ready = "")));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Tooltip.Provider delayDuration={150}>
      {/* The router writes the title and the description of each route here; index.html has no <title>. */}
      <HeadContent />
      <a
        href="#conteudo"
        onClick={() => focusRegion("conteudo")}
        className="sr-only z-[90] rounded-full bg-foreground px-4 py-2 text-small font-medium text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
      >
        Pular para o conteúdo
      </a>
      <NavigationProgress />
      <SiteHeader />
      <main id="conteudo" className="min-h-[60vh] outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      <CommandPalette />
      <AppToaster />
    </Tooltip.Provider>
  );
}
