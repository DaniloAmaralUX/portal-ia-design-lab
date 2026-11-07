import { Fragment, type ReactNode } from "react";
import { CodeBlock } from "@/components/beautiful-ui/CodeBlock";


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
    <div className={className}>
      <CodeBlock code={command} message={message}><span aria-hidden className="mr-2 select-none text-muted-foreground">{prompt}</span>{breakable(command)}</CodeBlock>
    </div>
  );
}
