import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { HeadContent, Outlet, useRouterState } from "@tanstack/react-router";
import * as Tooltip from "@radix-ui/react-tooltip";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CommandPalette } from "@/features/palette";
import { focusRegion, useRouteFocus } from "@/hooks/use-route-focus";
import { useGlobalShortcuts } from "./use-shortcuts";
import { useUi } from "@/store/ui";
import { AppToaster } from "./AppToaster";
import { PageFrame } from "./PageFrame";

export function RootLayout() {
  const prototype = useRouterState({ select: state => state.location.pathname.startsWith("/prototipos/") });
  useGlobalShortcuts();
  useRouteFocus("conteudo");
  useEffect(() => useUi.getState().syncTheme(), []);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => (document.documentElement.dataset.ready = "")));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 320, damping: 30 }}>
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
      {!prototype && <SiteHeader />}
      <main id="conteudo" className={prototype ? "min-h-[60vh] outline-none" : "employee-portal min-h-[60vh] outline-none"}>
        {prototype ? <Outlet /> : <PageFrame><Outlet /></PageFrame>}
      </main>
      {!prototype && <SiteFooter />}
      <CommandPalette />
      <AppToaster />
    </Tooltip.Provider>
    </MotionConfig>
  );
}
