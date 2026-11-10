import type { ReactNode } from "react";
import { BrandPlus } from "@/components/BrandPlus";

export function EmptyState({ title, description, children }: { title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
      <div aria-hidden className="relative mb-5 flex h-12 w-16 items-center justify-center">
        <BrandPlus className="absolute left-0 top-0 size-7 text-brand-red/70" />
        <BrandPlus className="absolute bottom-0 right-0 size-7 text-brand-orange/70" />
      </div>
      <p className="font-display text-heading font-semibold [overflow-wrap:anywhere]">{title}</p>
      {description && <p className="mt-2 max-w-md text-small leading-relaxed text-muted-foreground">{description}</p>}
      {children && <div className="mt-5 flex flex-col items-center gap-6">{children}</div>}
    </div>
  );
}
