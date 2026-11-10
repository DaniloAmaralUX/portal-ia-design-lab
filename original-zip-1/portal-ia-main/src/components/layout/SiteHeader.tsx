import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { PitangLogo } from "@/components/layout/PitangLogo";
import { HeaderAccount } from "@/components/layout/HeaderAccount";
import { GithubHandoff } from "@/components/layout/GithubHandoff";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { isCurrent, NAV } from "@/components/layout/nav";
import { Container } from "@/components/ui/container";
import { Kbd } from "@/components/ui/kbd";
import { useScrolled } from "@/hooks/use-scrolled";
import { useUi } from "@/store/ui";
import { BRAND_NAME, SITE_NAME } from "@/shared/brand";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const scrolled = useScrolled();
  const setPaletteOpen = useUi((s) => s.setPaletteOpen);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 [view-transition-name:site-header]",
        scrolled
          ? "border-border/70 bg-background/95 shadow-[0_1px_0_rgb(var(--shadow-color)/0.02)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-background/0",
      )}
    >
      <Container className="flex h-16 items-center gap-3 sm:gap-5">
        <Link to="/" className="group flex shrink-0 items-center gap-2 sm:gap-2.5" aria-label={`${SITE_NAME}, página inicial`}>
          <PitangLogo className="h-[21px] w-auto" />
          <span aria-hidden className="h-5 w-px bg-border max-[23rem]:hidden" />
          <span className="whitespace-nowrap font-display text-body font-semibold tracking-[-0.01em] max-[23rem]:hidden">{BRAND_NAME}</span>
        </Link>

        {/* The menu shows from 896px, as before the sixth section. To fit beside a classic scrollbar (15px), up to 1024px the items
            and the gaps are a step tighter, and up to 1152px the search is only its icon; below 896px, the button opens the menu. */}
        <nav aria-label="Principal" className="hidden items-center gap-0.5 min-[56rem]:flex min-[64rem]:ml-2">
          {NAV.map((item) => {
            const current = isCurrent(pathname, item.match);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-2 py-1.5 text-small font-medium transition-colors hover:bg-accent hover:text-foreground min-[64rem]:px-3 min-[72rem]:px-3.5",
                  current ? "bg-accent text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
                {current && (
                  <span
                    aria-hidden
                    className="absolute bottom-1 left-1/2 h-0 w-4 -translate-x-1/2 rounded-full border-b-2 border-link [view-transition-name:menu-marker]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 min-[56rem]:gap-1 min-[64rem]:gap-1.5">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Buscar no site"
            aria-keyshortcuts="Meta+K Control+K"
            className={cn(
              "hidden h-9 w-44 items-center gap-2.5 rounded-full border border-border bg-card px-3.5 text-caption text-muted-foreground shadow-xs hover:border-foreground/20 hover:text-foreground sm:flex min-[56rem]:hidden min-[72rem]:flex min-[76rem]:w-60",
              press,
            )}
          >
            <Search strokeWidth={1.5} className="size-4 shrink-0" />
            <span className="truncate">Buscar…</span>
            <span className="ml-auto flex items-center gap-1">
              <Kbd>
                <span className="mac:hidden">Ctrl</span>
                <span className="hidden mac:inline">⌘</span>
              </Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Buscar no site"
            aria-keyshortcuts="Meta+K Control+K"
            title="Buscar no site (⌘K)"
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground sm:hidden min-[56rem]:inline-flex min-[72rem]:hidden",
              press,
            )}
          >
            <Search className="size-[18px]" />
          </button>
          <ThemeToggle />
          <GithubHandoff />
          <HeaderAccount />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir o menu"
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground min-[56rem]:hidden",
              press,
            )}
          >
            <Menu className="size-[18px]" />
          </button>
        </div>
      </Container>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
