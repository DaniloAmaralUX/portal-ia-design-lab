import { Link } from "@tanstack/react-router";
import { BookOpen, Presentation } from "lucide-react";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PRESENTING } from "./reading-search";

// The two ways to go through the same text. The reading is the page itself; the presentation is an address of it, so the back
// button closes it.
export function ModeSwitch({ className }: { className?: string }) {
  return (
    <div
      role="group"
      aria-label="Modo"
      // The corner of the box is the corner of the segments plus the padding between them (10 + 2px), so the two curves run parallel.
      className={cn("inline-flex shrink-0 items-center gap-0.5 rounded-[calc(var(--radius-md)+0.125rem)] border border-border bg-card p-0.5 text-caption font-medium shadow-xs", className)}
    >
      {/* The current mode in the colours of a selected chip (chipActive), which tell it from the other mode in both themes. */}
      <span aria-current="true" className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1 text-background">
        <BookOpen aria-hidden className="size-3.5" />
        Leitura
      </span>
      <Link
        to="."
        search={(prev) => ({ ...prev, modo: PRESENTING, slide: undefined })}
        resetScroll={false}
        className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-muted-foreground hover:bg-accent/60 hover:text-foreground", press)}
      >
        <Presentation aria-hidden className="size-3.5" />
        Apresentação
      </Link>
    </div>
  );
}
