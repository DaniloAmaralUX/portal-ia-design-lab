import { Check, Copy } from "lucide";
import { FeedbackText } from "@/components/craft/FeedbackText";
import { StateIcon, usePointerFeedback } from "@/components/craft/StateIcon";
import { useCopy } from "@/hooks/use-copy";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  label = "Copiar",
  name,
  message,
  className,
  tone = "card",
  withLabel = false,
}: {
  text: string;
  label?: string;
  name?: string;
  message?: string;
  className?: string;
  tone?: "card" | "terminal";
  withLabel?: boolean;
}) {
  const { copied, copy } = useCopy(message);
  const { instant, record } = usePointerFeedback();
  return (
    <button
      type="button"
      onClick={(event) => { record(event); void copy(text); }}
      aria-label={copied ? "Copiado" : (name ?? label)}
      title={copied ? "Copiado" : label}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-lg",
        withLabel ? "h-8 min-w-22 px-2.5 text-caption font-medium" : "size-8",
        tone === "terminal"
          ? "text-terminal-muted hover:bg-white/10 hover:text-terminal-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        press,
        className,
      )}
    >
      <StateIcon icon={copied ? Check : Copy} instant={instant} className={cn("size-4", copied && (tone === "terminal" ? "text-terminal-green" : "text-success"))} />
      {withLabel && <span aria-hidden className="inline-block min-w-12 text-left"><FeedbackText instant={instant}>{copied ? "Copiado" : "Copiar"}</FeedbackText></span>}
    </button>
  );
}
