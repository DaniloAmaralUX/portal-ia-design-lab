import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";

export function PageFrame({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: state => state.location.pathname });
  const section = path.startsWith("/academy") || path.startsWith("/metodo") || /^\/ferramentas\/[^/]+\/[^/]+/.test(path);
  return section ? children : <Container className="cd-page-frame library-content min-w-0 pb-16 pt-8">{children}</Container>;
}
