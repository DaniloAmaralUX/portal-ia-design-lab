import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/design-system/primitives";
import { COMMAND, TOOLKIT } from "@/data/catalyst-toolkit";
import { cn } from "@/lib/utils";
import { CopyCommand } from "./CopyCommand";
import { ToolSetup } from "./ToolSetup";

// The bar of the install, at the top of the page of the Catalyst Toolkit, as the top of a product: the one command, the button that
// copies it, and beside the bar the way to the first use. Under it, what a computer needs the first time. On a narrow screen, the
// bar wraps instead of scrolling. The command keeps to one line, as it never breaks inside the name of the package: a step smaller
// on a phone, and on the narrowest it scrolls in its own box, faded on the side with more of it.
export function ToolInstallBar({ className }: { className?: string }) {
  return (
    <div id="instale" className={cn("scroll-mt-24", className)}>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="@container flex min-w-0 flex-1 basis-[min(100%,30rem)] items-center gap-2 rounded-2xl border border-border bg-card py-1.5 pl-4 pr-1.5 text-left shadow-sm">
          <span aria-hidden className="select-none font-mono text-small text-muted-foreground">
            $
          </span>
          <code className="scroll-fade min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-1 font-mono text-caption text-foreground [scrollbar-width:none] @max-[20rem]:text-micro @md:text-small">
            {COMMAND}
          </code>
          <CopyCommand command={COMMAND} />
        </div>
        <Button asChild size="lg" variant="inverse" className="h-12 shrink-0">
          <Link to="/ferramentas/$guide/$chapter" params={{ guide: TOOLKIT.slug, chapter: "primeiro-uso" }}>
            Primeiro uso
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
      <ToolSetup className="mx-auto mt-3 max-w-2xl" />
    </div>
  );
}
