import { cn } from "@/lib/utils";
import type { TreeLine } from "./openspec-flow";

const INDENT_REM = 0.9;

// The folders of the example project, with the files the step writes marked, as the editor shows what changed.
export function FileTree({ lines, label }: { lines: TreeLine[]; label: string }) {
  return (
    <ul aria-label={label} className="rounded-xl border border-border bg-background p-3 font-mono text-caption leading-relaxed">
      {lines.map((line) => (
        <li key={`${line.depth}-${line.name}`} style={{ paddingLeft: `${line.depth * INDENT_REM}rem` }}>
          <span className={cn("inline-block max-w-full break-words rounded px-1.5", line.hot ? "bg-brand-gold/25 text-foreground" : "text-muted-foreground")}>
            {line.name}
            {line.hot && <span className="sr-only"> (novo ou alterado)</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
