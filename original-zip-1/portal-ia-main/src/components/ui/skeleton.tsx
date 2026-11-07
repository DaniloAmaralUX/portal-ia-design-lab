import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div aria-hidden style={style} className={cn("animate-shimmer rounded-md bg-muted", className)} />;
}

const WIDTHS = ["100%", "94%", "98%", "88%", "96%"];

export function SkeletonText({ lines = 4, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className="h-3.5" style={{ width: i === lines - 1 ? "58%" : WIDTHS[i % WIDTHS.length] }} />
      ))}
    </div>
  );
}
