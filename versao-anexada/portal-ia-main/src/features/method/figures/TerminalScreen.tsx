import { Fragment } from "react";
import { ScrollablePre } from "@/components/ScrollablePre";
import { WindowDots } from "@/components/WindowDots";
import { cn } from "@/lib/utils";
import type { Part, Screen, Tone } from "./terminal-screen";

const TONE: Record<Tone, string> = {
  dim: "text-terminal-muted",
  strong: "font-bold text-terminal-foreground",
  prompt: "font-bold text-terminal-red",
  ok: "text-terminal-green",
};

function PartOf({ part }: { part: Part }) {
  if (typeof part === "string") return part;
  return <span className={TONE[part.tone]}>{part.text}</span>;
}

// A screen of the terminal of a guide: dark in both themes, like a real terminal. The text reads as text, and a line too long
// for the phone scrolls inside the window.
export function TerminalScreen({ screen, label, className }: { screen: Screen; label: string; className?: string }) {
  return (
    <figure aria-label={label} className={cn("overflow-hidden rounded-2xl border border-terminal-border bg-terminal text-terminal-foreground/90 shadow-lg", className)}>
      <div className="flex items-center gap-2 border-b border-terminal-border px-4 py-2.5">
        <WindowDots />
        <span className="ml-2 truncate font-mono text-micro text-terminal-muted">{screen.title}</span>
      </div>
      <ScrollablePre label={`Tela: ${screen.title}`} className="overflow-x-auto px-5 py-4 font-mono text-caption leading-[1.7]">
        <code>
          {screen.lines.map((line, i) => (
            <Fragment key={i}>
              {line.map((part, j) => (
                <PartOf key={j} part={part} />
              ))}
              {i < screen.lines.length - 1 && "\n"}
            </Fragment>
          ))}
        </code>
      </ScrollablePre>
    </figure>
  );
}
