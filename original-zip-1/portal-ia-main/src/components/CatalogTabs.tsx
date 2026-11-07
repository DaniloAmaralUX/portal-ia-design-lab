import { Link } from "@tanstack/react-router";
import { catalogPlugins, catalogSkills } from "@/data/catalog-index";
import { cn } from "@/lib/utils";

const tab =
  "relative -mb-px inline-flex items-center gap-2 rounded-none border-b-2 px-1 pb-2.5 text-small font-medium transition-colors duration-(--duration-fast)";
const inactive = "border-transparent text-muted-foreground hover:border-foreground/25 hover:text-foreground";

function Indicator() {
  return (
    <span
      aria-hidden
      className="absolute inset-x-0 -bottom-0.5 h-0 border-b-2 border-foreground [view-transition-class:fixed_marker] [view-transition-name:tabs-marker]"
    />
  );
}

export function CatalogTabs({ current }: { current: "skills" | "plugins" }) {
  return (
    <nav aria-label="Vistas do catálogo" className="flex gap-6 border-b border-border [view-transition-class:fixed] [view-transition-name:catalog-tabs]">
      <Link
        to="/explorar"
        aria-current={current === "skills" ? "page" : undefined}
        className={cn(tab, current === "skills" ? "border-transparent text-foreground" : inactive)}
      >
        Skills
        <span className="tabular rounded-full bg-muted px-1.5 text-micro text-muted-foreground">{catalogSkills.length}</span>
        {current === "skills" && <Indicator />}
      </Link>
      <Link
        to="/plugins"
        aria-current={current === "plugins" ? "page" : undefined}
        className={cn(tab, current === "plugins" ? "border-transparent text-foreground" : inactive)}
      >
        Plugins
        <span className="tabular rounded-full bg-muted px-1.5 text-micro text-muted-foreground">{catalogPlugins.length}</span>
        {current === "plugins" && <Indicator />}
      </Link>
    </nav>
  );
}
