import { CopyButton } from "@/components/CopyButton";
import { ScrollablePre } from "@/components/ScrollablePre";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language,
  className,
  message = "Trecho copiado",
  wrap = false,
  name,
}: {
  code: string;
  language?: string;
  className?: string;
  message?: string;
  wrap?: boolean;
  name?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-terminal-border bg-terminal shadow-sm", className)}>
      <div className="flex items-center justify-between border-b border-terminal-border px-4 py-1.5">
        <span className="font-mono text-label uppercase text-terminal-muted">{language ?? "texto"}</span>
        <CopyButton
          text={code}
          tone="terminal"
          message={message}
          label="Copiar trecho"
          name={name ?? (language ? `Copiar o trecho em ${language}` : "Copiar o trecho")}
        />
      </div>
      <ScrollablePre
        label={language ? `Trecho em ${language}` : "Trecho de código"}
        className={cn(
          "overflow-x-auto px-4 py-3.5 font-mono text-caption leading-relaxed text-terminal-foreground",
          wrap && "whitespace-pre-wrap [overflow-wrap:anywhere]",
        )}
      >
        <code>{code}</code>
      </ScrollablePre>
    </div>
  );
}
