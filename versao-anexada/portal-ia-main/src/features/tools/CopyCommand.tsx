import { Check, Copy } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { iconHidden, iconShown, iconSwap, press } from "@/lib/motion";
import { cn } from "@/lib/utils";

// The button that copies a command, with its name in words on a wide box and only the icon on a narrow one.
export function CopyCommand({ command }: { command: string }) {
  const { copied, copy } = useCopy("Comando copiado");
  return (
    <button
      type="button"
      onClick={() => void copy(command)}
      aria-label={copied ? "Copiado" : `Copiar: ${command}`}
      className={cn("relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-caption font-medium text-muted-foreground hover:bg-accent hover:text-foreground", press)}
    >
      <span className="relative size-4">
        <Copy aria-hidden className={cn("absolute size-4", iconSwap, copied ? iconHidden : iconShown)} />
        <Check aria-hidden className={cn("absolute size-4 text-success", iconSwap, copied ? iconShown : iconHidden)} />
      </span>
      <span className="@max-lg:sr-only">{copied ? "Copiado" : "Copiar"}</span>
    </button>
  );
}
