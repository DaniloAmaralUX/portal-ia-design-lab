import type { LucideIcon } from "lucide-react";
import { areaStyle } from "@/components/area-style";
import type { AreaId } from "@/data/types";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-8 rounded-lg [&_svg]:size-4",
  md: "size-10 rounded-xl [&_svg]:size-5",
  lg: "size-14 rounded-2xl [&_svg]:size-7",
  xl: "size-16 rounded-[1.25rem] [&_svg]:size-8",
};

export type MarkSize = keyof typeof SIZES;

// With no area, the mark is neutral: an area the catalog does not have yet.
const NEUTRAL = { tint: "bg-muted", text: "text-muted-foreground" };

export function Mark({ icon: Icon, area, size = "md", className }: { icon: LucideIcon; area?: AreaId; size?: MarkSize; className?: string }) {
  const style = area ? areaStyle[area] : NEUTRAL;
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.06]",
        style.tint,
        style.text,
        SIZES[size],
        className,
      )}
    >
      <Icon />
    </span>
  );
}
