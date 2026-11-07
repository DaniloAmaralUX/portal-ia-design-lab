import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AreaDot } from "@/components/AreaDot";
import { DrawerAccount } from "@/components/layout/DrawerAccount";
import { isCurrent, NAV } from "@/components/layout/nav";
import { Sheet } from "@/components/ui/sheet";
import { areas } from "@/data/areas";
import { cn } from "@/lib/utils";

const item = "relative py-3 font-display text-heading font-semibold";
const current =
  "text-link before:absolute before:inset-y-3 before:-left-3 before:w-0 before:rounded-full before:border-l-4 before:border-link";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sheet open={open} onClose={onClose} title="Menu">
      <nav aria-label="Menu" className="flex flex-col">
        <Link to="/" onClick={onClose} aria-current={pathname === "/" ? "page" : undefined} className={cn(item, pathname === "/" && current)}>
          Início
        </Link>
        {NAV.map((entry) => {
          const isActive = isCurrent(pathname, entry.match);
          return (
            <Link key={entry.to} to={entry.to} onClick={onClose} aria-current={isActive ? "page" : undefined} className={cn(item, isActive && current)}>
              {entry.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-12">
        <p className="mb-3 text-small font-semibold text-foreground">Skills por área</p>
        <div className="-mx-3 flex flex-col gap-1">
          {areas.map((area) => (
            <Link
              key={area.id}
              to="/explorar"
              search={{ area: area.id }}
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-body transition-colors hover:bg-accent"
            >
              <span className="flex items-center gap-2.5">
                <AreaDot area={area.id} />
                {area.name}
              </span>
              <ArrowRight strokeWidth={1.5} className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
      <DrawerAccount />
    </Sheet>
  );
}
