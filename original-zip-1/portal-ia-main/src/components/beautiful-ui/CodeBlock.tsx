import type { ReactNode } from "react";
import { Terminal } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

// Beautiful UI Code Block surface; copy uses the portal's existing permission fallback.
export function CodeBlock({ code, children, message }: { code: string; children: ReactNode; message: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-xs">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-1.5 text-caption text-muted-foreground"><Terminal aria-hidden className="size-3.5" /><span>Claude Code</span><CopyButton text={code} message={message} label="Copiar comando" name={`Copiar o comando ${code}`} className="ml-auto rounded-md" /></div>
      <div className="flex items-start gap-3 px-4 py-3 font-mono text-caption leading-relaxed"><span aria-hidden className="select-none text-muted-foreground/60">1</span><code className="min-w-0 flex-1 break-words">{children}</code></div>
    </div>
  );
}
