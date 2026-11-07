import { Check, Copy } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { iconHidden, iconShown, iconSwap, press } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  label = "Copiar",
  name,
  message,
  className,
  tone = "card",
}: {
  text: string;
  label?: string;
  name?: string;
  message?: string;
  className?: string;
  tone?: "card" | "terminal";
}) {
  const { copied, copy } = useCopy(message);
  return (
    <button
      type="button"
      onClick={() => void copy(text)}
      aria-label={copied ? "Copiado" : (name ?? label)}
      title={copied ? "Copiado" : label}
      className={cn(
        "relative inline-flex size-8 shrink-0 items-center justify-center rounded-lg",
        tone === "terminal"
          ? "text-terminal-muted hover:bg-white/10 hover:text-terminal-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        press,
        className,
      )}
    >
      <Copy className={cn("size-4", iconSwap, copied ? iconHidden : iconShown)} />
      <Check
        className={cn(
          "absolute size-4",
          iconSwap,
          tone === "terminal" ? "text-terminal-green" : "text-success",
          copied ? iconShown : iconHidden,
        )}
      />
    </button>
  );
}
