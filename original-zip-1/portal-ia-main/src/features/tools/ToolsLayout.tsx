import { Outlet, useMatch } from "@tanstack/react-router";
import { DocsLayout } from "@/components/DocsLayout";
import { Container } from "@/components/ui/container";
import { ToolsNav } from "./ToolsNav";

// The section Ferramentas: its page and the page of each tool are pages of their own, as wide as the site; the chapters of the guide
// of a tool have the layout of documentation, with the menu of the section.
export function ToolsLayout() {
  const chapter = useMatch({ from: "/ferramentas/$guide/$chapter", shouldThrow: false });
  if (!chapter) {
    return (
      <Container className="pb-20 pt-6 sm:pt-8">
        <Outlet />
      </Container>
    );
  }
  return <DocsLayout title="Ferramentas" label="Menu das Ferramentas" Menu={ToolsNav} />;
}
