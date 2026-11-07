import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ContextCard } from "@/components/beautiful-ui/ContextCard";

export function EntryPoint({ icon: Icon, label, title, text, children }: { icon: LucideIcon; label: string; title: string; text: string; children: ReactNode }) {
  return (
    <li className="min-w-0">
      <ContextCard className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border bg-muted/35 px-5 py-3">
          <Icon aria-hidden className="size-4 text-muted-foreground" />
          <span className="text-caption font-medium text-muted-foreground">{label}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-heading font-semibold">{title}</h3>
          <p className="mt-2 text-small leading-relaxed text-muted-foreground text-pretty">{text}</p>
          <div className="mt-auto flex flex-col items-start gap-1 pt-5">{children}</div>
        </div>
      </ContextCard>
    </li>
  );
}
