import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { iconHidden, iconShown, iconSwap } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function CopyCommandButton({
  command,
  children,
  message = "Comando copiado. Cole no Claude Code.",
  ...props
}: Omit<ButtonProps, "onClick"> & { command: string; message?: string }) {
  const { copied, copy } = useCopy(message);
  return (
    <Button onClick={() => void copy(command)} {...props}>
      <span aria-hidden data-icon="inline-start" className="relative inline-flex size-4 shrink-0">
        <Copy className={cn(iconSwap, copied ? iconHidden : iconShown)} />
        <Check className={cn("absolute inset-0", iconSwap, copied ? iconShown : iconHidden)} />
      </span>
      {children}
    </Button>
  );
}
