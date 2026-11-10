import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Blocks, House, Layers, Lightbulb, ListChecks, Newspaper, Route, Terminal } from "lucide-react";
import { FluidGroup } from "@/components/fluid/FluidGroup";
import { cn } from "@/lib/utils";

const groups = [
  { label: "Comece aqui", items: [
    { to: "/", label: "Visão geral", icon: House },
    { to: "/primeiros-passos", label: "Primeiros passos", icon: Terminal },
  ] },
  { label: "Explore o portal", items: [
    { to: "/academy", label: "Academy", icon: BookOpen },
    { to: "/metodo", label: "Método", icon: Route },
    { to: "/explorar", label: "Skills", icon: Blocks },
    { to: "/plugins", label: "Plugins", icon: Layers },
    { to: "/ferramentas", label: "Ferramentas", icon: ListChecks },
  ] },
  { label: "Participe", items: [
    { to: "/contribuir", label: "Contribuir", icon: Lightbulb },
    { to: "/novidades", label: "Novidades", icon: Newspaper },
  ] },
] as const;

export function PortalNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="Navegação do portal" className="flex flex-col gap-7">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-2 text-label font-medium text-muted-foreground">{group.label}</p>
          <FluidGroup className="flex flex-col gap-1 rounded-xl">
            {group.items.map(({ to, label, icon: Icon }) => {
              const current = to === "/" ? path === "/" : path === to || path.startsWith(`${to}/`);
              return (
                <Link key={to} to={to} data-fluid-item aria-current={current ? "page" : undefined} className={cn("flex min-h-10 items-center gap-2 rounded-xl px-2 text-caption font-medium transition-colors hover:text-foreground", current ? "bg-accent text-foreground" : "text-muted-foreground")}>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-foreground/7"><Icon aria-hidden className="size-3.5" strokeWidth={1.75} /></span>
                  {label}
                </Link>
              );
            })}
          </FluidGroup>
        </div>
      ))}
    </nav>
  );
}
