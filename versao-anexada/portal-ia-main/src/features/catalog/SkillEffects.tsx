import type { EffectKind } from "@/data/types";
import { kindsOf } from "./effect-icons";

export function SkillEffects({ kinds }: { kinds: EffectKind[] }) {
  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
      {kindsOf(kinds).map(({ kind, label, means, icon: Icon }) => (
        <li key={kind} className="grid gap-x-6 gap-y-1 p-4 sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:p-5">
          <p className="flex items-center gap-2 self-start text-small font-semibold">
            <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            {label}
          </p>
          <p className="text-small leading-relaxed text-foreground/85">{means}</p>
        </li>
      ))}
    </ul>
  );
}
