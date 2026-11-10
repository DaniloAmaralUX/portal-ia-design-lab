import { CopyButton } from "@/components/CopyButton";
import { Pause, Play } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { WindowDots } from "@/components/WindowDots";
import { marketplaceAdd } from "@/lib/commands";
import { cn } from "@/lib/utils";
import { DEMO_SCRIPT, viewOf, type Kind, type LineView } from "./terminal-script";
import { useTerminalDemo } from "./use-terminal-demo";

const MARK: Record<Kind, { symbol: string; tone: string }> = {
  input: { symbol: ">", tone: "text-terminal-red" },
  ok: { symbol: "✓", tone: "text-terminal-green" },
  skill: { symbol: "●", tone: "text-terminal-gold" },
  note: { symbol: "└", tone: "text-terminal-muted" },
};
const BODY: Record<Exclude<Kind, "skill">, string> = {
  input: "min-w-0 [overflow-wrap:anywhere]",
  ok: "text-terminal-muted",
  note: "text-terminal-foreground/90",
};

function Caret({ pulsing, after = false }: { pulsing: boolean; after?: boolean }) {
  return (
    <span
      className={cn(
        "visible absolute top-1/2 h-[1.2em] w-[0.58em] -translate-y-1/2 rounded-[1px] bg-terminal-foreground/80",
        after ? "left-full" : "left-0",
        pulsing && "animate-caret",
      )}
    />
  );
}

// The text of a line, with the part still to come invisible, so the line wraps where the whole line will. The caret hangs on a
// character, the next one or the last typed: an element of its own between two letters would open a break there, and the line
// would wrap somewhere else as the keys came.
function Typed({ view }: { view: LineView }) {
  const { shown, rest, caret } = view;
  if (!caret) {
    return (
      <>
        {shown}
        <span className="invisible">{rest}</span>
      </>
    );
  }
  const pulsing = caret === "pulsing";
  if (shown && !rest) {
    return (
      <>
        {shown.slice(0, -1)}
        <span className="relative">
          {shown.slice(-1)}
          <Caret pulsing={pulsing} after />
        </span>
      </>
    );
  }
  return (
    <>
      {shown}
      <span className="invisible">
        <span className="relative">
          {rest.slice(0, 1) || "\u00a0"}
          <Caret pulsing={pulsing} />
        </span>
        {rest.slice(1)}
      </span>
    </>
  );
}

function TerminalLine({ kind, text, view }: { kind: Kind; text: string; view: LineView }) {
  return (
    <div className={cn("flex gap-2.5 transition-[opacity,translate] duration-300 ease-out", !view.visible && "translate-y-1 opacity-0")}>
      <span className={cn("inline-block select-none", MARK[kind].tone, view.working && "animate-terminal-pulse")}>{MARK[kind].symbol}</span>
      {kind === "skill" ? (
        <span>
          <span className="text-terminal-muted">usando a skill </span>
          <span className="text-terminal-gold">{text}</span>
        </span>
      ) : (
        <span className={BODY[kind]}>
          <Typed view={view} />
        </span>
      )}
    </div>
  );
}

export function TerminalDemo({ className }: { className?: string }) {
  const { ref, progress, held, still, paused, setPaused } = useTerminalDemo(DEMO_SCRIPT);
  // Held under the pointer or the focus, nothing moves: the caret and the dot of the skill stand still where the demo stopped.
  const view = (index: number): LineView => {
    const shown = viewOf(DEMO_SCRIPT, progress, index);
    return held ? { ...shown, caret: shown.caret && "steady", working: false } : shown;
  };
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-terminal-border bg-terminal text-terminal-foreground shadow-xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-terminal-border px-4 py-2.5">
        <WindowDots />
        <span className="ml-2 min-w-0 flex-1 font-mono text-micro text-terminal-muted">claude · ~/meu-projeto</span>
        {!still && (
          <IconButton
            label={paused ? "Retomar demonstração" : "Pausar demonstração"}
            onClick={() => setPaused(!paused)}
            size="sm"
            shape="rounded"
            tone="terminal"
          >
            {paused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
          </IconButton>
        )}
        <CopyButton text={marketplaceAdd} tone="terminal" message="Comando copiado" label="Copiar o comando do marketplace" />
      </div>
      <ol className="sr-only">
        {DEMO_SCRIPT.map((line, i) => (
          <li key={i}>{line.kind === "skill" ? `usando a skill ${line.text}` : line.text}</li>
        ))}
      </ol>
      <div
        key={progress.run}
        aria-hidden
        data-terminal-screen
        className={cn(
          "space-y-2.5 px-4 py-4 font-mono text-micro leading-relaxed transition-opacity duration-[400ms] sm:px-5 sm:text-caption",
          progress.clearing && !held && "opacity-0",
          progress.run > 0 && "animate-overlay-in",
        )}
      >
        {DEMO_SCRIPT.map((line, i) => (
          <TerminalLine key={i} kind={line.kind} text={line.text} view={view(i)} />
        ))}
        <TerminalLine kind="input" text="" view={view(DEMO_SCRIPT.length)} />
      </div>
    </div>
  );
}
