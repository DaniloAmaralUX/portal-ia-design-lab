import type { ReactNode } from "react";
import { AreaDot } from "@/components/AreaDot";
import type { AreaId } from "@/data/types";

export function AreaTitle({ area, children }: { area: AreaId; children: ReactNode }) {
  return (
    <h1 className="mt-6 flex items-center gap-3 font-display text-headline font-bold text-balance">
      <AreaDot area={area} className="size-3" />
      <span data-vt-target="title">{children}</span>
    </h1>
  );
}
