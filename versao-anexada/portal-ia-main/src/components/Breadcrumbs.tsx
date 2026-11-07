import { Fragment, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: ReactNode[] }) {
  return (
    <nav aria-label="Você está em">
      <ol className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <li aria-hidden>
                <ChevronRight strokeWidth={1.5} className="size-3.5 opacity-60" />
              </li>
            )}
            <li className="min-w-0 [overflow-wrap:anywhere] [&_a]:transition-colors [&_a:hover]:text-foreground">{item}</li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
