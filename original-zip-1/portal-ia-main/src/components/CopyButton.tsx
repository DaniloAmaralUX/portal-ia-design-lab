import { Check, Copy } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { iconHidden, iconShown, iconSwap } from "@/lib/motion";
import { IconButton } from "@/components/ui/icon-button";
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
    <IconButton
      onClick={() => void copy(text)}
      label={copied ? "Copiado" : (name ?? label)}
      title={copied ? "Copiado" : label}
      size="sm"
      shape="rounded"
      tone={tone === "terminal" ? "terminal" : "default"}
      className={className}
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
    </IconButton>
  );
}
