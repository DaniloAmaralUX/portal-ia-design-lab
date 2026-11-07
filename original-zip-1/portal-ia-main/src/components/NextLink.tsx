import type { ComponentProps } from "react";
import { createLink } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function NextAnchor({ kicker, label, className, ...props }: ComponentProps<"a"> & { kicker: string; label: string }) {
  return (
    <a
      {...props}
      className={cn(
        "group mt-4 flex items-center justify-between gap-4 rounded-xl bg-muted/60 px-4 py-3 transition-colors duration-(--duration-fast) hover:bg-accent",
        className,
      )}
    >
      <span className="min-w-0">
        <span className="block text-caption text-muted-foreground">{kicker}</span>
        <span className="mt-0.5 block text-small font-semibold text-pretty">{label}</span>
      </span>
      <ArrowRight aria-hidden className="size-4 shrink-0 transition-transform duration-(--duration-base) group-hover:translate-x-0.5" />
    </a>
  );
}

export const NextLink = createLink(NextAnchor);
