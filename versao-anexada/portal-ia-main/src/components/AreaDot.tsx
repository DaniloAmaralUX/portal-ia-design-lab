import { areaStyle } from "@/components/area-style";
import type { AreaId } from "@/data/types";
import { cn } from "@/lib/utils";

export function AreaDot({ area, className }: { area: AreaId; className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2 shrink-0 rounded-full", areaStyle[area].dot, className)} />;
}
