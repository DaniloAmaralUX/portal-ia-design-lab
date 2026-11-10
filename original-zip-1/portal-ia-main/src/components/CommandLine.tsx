import { Fragment, type ReactNode } from "react";
import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/utils";

function breakable(text: string): ReactNode[] {
  return text.split(/(?<=\/)(?=[^\s/])/).map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <wbr />}
      {part}
    </Fragment>
  ));
}

export function CommandLine({
  command,
  prompt = ">",
  className,
  message = "Comando copiado",
}: {
  command: string;
  prompt?: string;
  className?: string;
  message?: string;
}) {
  return (
    <div
      className={cn(
        "group flex items-start gap-2 rounded-xl border border-terminal-border bg-terminal py-1.5 pl-4 pr-1.5 font-mono text-caption leading-[1.6] text-terminal-foreground shadow-sm",
        className,
      )}
    >
      <span aria-hidden className="select-none py-1.5 text-terminal-red">
        {prompt}
      </span>
      <code className="min-w-0 flex-1 py-1.5 break-words">{breakable(command)}</code>
      <CopyButton text={command} tone="terminal" message={message} label="Copiar comando" name={`Copiar o comando ${command}`} className="rounded-md" />
    </div>
  );
}
