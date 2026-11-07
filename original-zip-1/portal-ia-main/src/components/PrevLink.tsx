import type { ComponentProps } from "react";
import { createLink } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

function PrevAnchor({ kicker, label, className, ...props }: ComponentProps<"a"> & { kicker: string; label: string }) {
  return (
    <a
      {...props}
      className={cn("group mt-4 inline-flex items-center gap-1.5 text-caption text-muted-foreground transition-colors hover:text-foreground", className)}
    >
      <ArrowLeft aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-(--duration-base) group-hover:-translate-x-0.5" />
      {kicker}: <span className="font-medium">{label}</span>
    </a>
  );
}

export const PrevLink = createLink(PrevAnchor);
