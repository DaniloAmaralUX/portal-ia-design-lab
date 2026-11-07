import { CopyButton } from "@/components/CopyButton";
import { CommandText } from "./CommandText";
import { WindowBar } from "./WindowBar";

export function TerminalPreview({ command, result }: { command: string; result: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-terminal-border bg-terminal shadow-lg">
      <WindowBar>
        <CopyButton text={command} tone="terminal" message="Comando copiado" label="Copiar comando" name={`Copiar o comando ${command}`} className="-my-1.5 ml-auto focus-visible:-outline-offset-2" />
      </WindowBar>
      <div className="space-y-2 px-3.5 py-3 font-mono text-micro leading-relaxed">
        <div className="flex gap-2">
          <span aria-hidden className="select-none text-terminal-red">
            &gt;
          </span>
          <CommandText command={command} />
        </div>
        <div className="flex gap-2">
          <span aria-hidden className="select-none text-terminal-green">
            ✓
          </span>
          <span className="text-terminal-muted">{result}</span>
        </div>
      </div>
    </div>
  );
}
