import type { EffectKind } from "@/data/types";
import { cn } from "@/lib/utils";
import { kindsOf } from "./effect-icons";

export function EffectsSummary({ kinds, className }: { kinds: EffectKind[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1", className)}>
      {kindsOf(kinds).map(({ kind, label, icon: Icon }) => (
        <li
          key={kind}
          className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-micro font-medium text-foreground/80"
        >
          <Icon aria-hidden className="size-3" />
          {label}
        </li>
      ))}
    </ul>
  );
}
