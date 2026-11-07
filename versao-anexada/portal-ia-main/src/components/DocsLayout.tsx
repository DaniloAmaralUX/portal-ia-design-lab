import { useEffect, useRef, useState, type ComponentType } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Menu } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Sheet } from "@/components/ui/sheet";
import { focusRegion } from "@/hooks/use-route-focus";
import { press } from "@/lib/motion";
import { cn, scrollActiveIntoView } from "@/lib/utils";

export function DocsLayout({ title, label, Menu: SectionNav }: { title: string; label: string; Menu: ComponentType<{ onNavigate?: () => void }> }) {
  const [open, setOpen] = useState(false);
  const sidebar = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (sidebar.current) scrollActiveIntoView(sidebar.current);
  }, [pathname]);
  return (
    <Container className="grid grid-cols-1 gap-10 pb-20 pt-6 sm:pt-8 lg:grid-cols-[208px_minmax(0,1fr)] lg:gap-12">
      <div className="hidden lg:block">
        {/* No overscroll-contain: with it, the wheel over a menu with nothing left to scroll did not move the page under the cursor. */}
        <div
          ref={sidebar}
          className="sticky top-24 -m-1 max-h-[calc(100dvh-7rem)] scroll-py-1 overflow-y-auto p-1 pb-6 [view-transition-class:fixed] [view-transition-name:section-menu]"
        >
          <a
            href="#texto"
            onClick={(e) => {
              e.preventDefault();
              focusRegion("texto");
            }}
            className="sr-only rounded-full bg-foreground px-4 py-2 text-small font-medium text-background focus:not-sr-only focus:mb-3 focus:inline-flex"
          >
            Pular o menu da seção
          </a>
          <SectionNav />
        </div>
      </div>
      <div id="texto" className="@container min-w-0 outline-none">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className={cn(
            "mb-8 flex w-full items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-small font-medium shadow-xs hover:border-foreground/20 lg:hidden",
            press,
          )}
        >
          <Menu aria-hidden className="size-4 text-muted-foreground" />
          {label}
          <ChevronRight aria-hidden className="ml-auto size-4 text-muted-foreground" />
        </button>
        <Outlet />
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title={title}>
        <SectionNav onNavigate={() => setOpen(false)} />
      </Sheet>
    </Container>
  );
}
