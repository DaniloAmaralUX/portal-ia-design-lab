import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/utils";

export function ExamplePrompt({ text, className }: { text: string; className?: string }) {
  const slash = text.startsWith("/");
  return (
    <div
      className={cn(
        "group flex items-start gap-2 rounded-2xl rounded-br-md border border-border bg-card py-2.5 pl-4 pr-2 shadow-xs",
        className,
      )}
    >
      <p className={cn("min-w-0 flex-1 py-1 text-body leading-snug", slash && "font-mono text-caption text-foreground")}>
        {slash ? text : `"${text}"`}
      </p>
      <CopyButton text={text} message="Pedido copiado. Cole no Claude Code." label="Copiar pedido" name={`Copiar o pedido ${slash ? text : `"${text}"`}`} />
    </div>
  );
}
