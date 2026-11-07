import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { PortalNav } from "@/components/layout/PortalNav";
import { Container } from "@/components/ui/container";

export function PageFrame({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hasSectionMenu = path.startsWith("/academy") || path.startsWith("/metodo") || /^\/ferramentas\/[^/]+\/[^/]+/.test(path);
  if (hasSectionMenu) return children;
  return (
    <Container className="library-frame grid min-w-0 grid-cols-1 gap-8 pb-16 pt-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
      <aside className="hidden lg:block"><div className="sticky top-25"><PortalNav /></div></aside>
      <div className="library-content min-w-0">{children}</div>
    </Container>
  );
}
