import { Link, type LinkProps } from "@tanstack/react-router";
import { BookOpen, Blocks, Route } from "lucide-react";
import { FluidGroup } from "@/components/fluid/FluidGroup";

// Beautiful UI Tool Chips composition, connected to the portal sections.
const tools: { to: NonNullable<LinkProps["to"]>; label: string; icon: typeof BookOpen }[] = [
  { to: "/explorar", label: "Skills", icon: Blocks },
  { to: "/academy", label: "Academy", icon: BookOpen },
  { to: "/metodo", label: "Método", icon: Route },
];

export function ToolChips() {
  return (
    <FluidGroup className="flex flex-wrap items-center gap-1 rounded-lg" label="Seções do portal">
      {tools.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} data-fluid-item className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 text-caption text-muted-foreground transition-colors hover:text-foreground">
            <Icon aria-hidden className="size-3.5" />{label}
          </Link>
      ))}
    </FluidGroup>
  );
}
