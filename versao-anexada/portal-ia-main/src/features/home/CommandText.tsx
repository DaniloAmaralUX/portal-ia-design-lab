import { useRef } from "react";
import { useOverflow } from "@/hooks/use-overflow";
import { cn } from "@/lib/utils";

export function CommandText({ command }: { command: string }) {
  const ref = useRef<HTMLElement>(null);
  const { moreRight: hidden } = useOverflow(ref);
  return (
    <code
      ref={ref}
      tabIndex={hidden ? 0 : undefined}
      role={hidden ? "region" : undefined}
      aria-label={hidden ? `Comando ${command}` : undefined}
      className={cn(
        "min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-terminal-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        hidden && "[mask-image:linear-gradient(to_right,black_78%,transparent)] focus-visible:[mask-image:none]",
      )}
    >
      {command}
    </code>
  );
}
