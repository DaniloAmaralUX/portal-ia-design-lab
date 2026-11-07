import { useState } from "react";
import { ChevronLeft, ChevronRight, Hand } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FileTree } from "./FileTree";
import { OpenSpecDiagram } from "./OpenSpecDiagram";
import { ACTORS, FLOW_STEPS } from "./openspec-flow";
import { TerminalScreen } from "./TerminalScreen";

const LAST = FLOW_STEPS.length - 1;

const ACTOR_CLASS = {
  strong: "border-transparent bg-brand-red-ink text-background",
  fast: "border-transparent bg-brand-gold/30 text-foreground",
  you: "",
} as const;

function Stepper({ index, onSelect }: { index: number; onSelect: (index: number) => void }) {
  const button = cn("inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-caption font-medium hover:bg-accent/60 disabled:opacity-50", press);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <ol className="flex items-center">
        {FLOW_STEPS.map((step, i) => (
          <li key={step.node}>
            <button
              type="button"
              aria-label={`Passo ${i + 1}: ${step.node}`}
              aria-current={i === index ? "step" : undefined}
              onClick={() => onSelect(i)}
              className="group grid h-6 w-7 place-items-center rounded-md"
            >
              <span className={cn("h-1.5 w-5 rounded-full transition-colors motion-reduce:transition-none", i === index ? "bg-brand-red-ink" : i < index ? "bg-foreground/45" : "bg-border group-hover:bg-foreground/30")} />
            </button>
          </li>
        ))}
      </ol>
      <div className="flex gap-2">
        <button type="button" disabled={index === 0} onClick={() => onSelect(index - 1)} className={button}>
          <ChevronLeft aria-hidden className="size-4" />
          Anterior
        </button>
        <button type="button" disabled={index === LAST} onClick={() => onSelect(index + 1)} className={button}>
          Próximo
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}

// The flow of a change in OpenSpec, one step at a time: the diagram lights the step, the card says who does it and what comes
// out, the terminal shows the command, and the tree marks the files it writes. Below the width of the diagram, the dots and the
// buttons walk the same steps.
export function OpenSpecFlow({ label }: { label: string }) {
  const [index, setIndex] = useState(0);
  const step = FLOW_STEPS[index];
  if (!step) return null;
  return (
    <figure aria-label={label} className="@container rounded-2xl border border-border bg-card p-4 shadow-xs @lg:p-5">
      <div className="grid gap-5 @xl:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] @xl:gap-6">
        <OpenSpecDiagram current={index} onSelect={setIndex} />
        <div className="flex min-w-0 flex-col gap-4">
          <div className="rounded-xl border border-brand-gold/40 bg-brand-gold/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="outline" className={cn(ACTOR_CLASS[step.actor])}>
                {step.actor === "you" && <Hand aria-hidden />}
                {ACTORS[step.actor]}
              </Badge>
              <span className="text-caption text-muted-foreground">
                passo {index + 1} de {FLOW_STEPS.length}
              </span>
            </div>
            <p className="mt-2 font-display text-body font-bold">{step.title}</p>
            <p className="mt-1 text-small text-muted-foreground">{step.text}</p>
          </div>
          <TerminalScreen screen={step.screen} label={`Terminal do passo ${index + 1}: ${step.command}`} />
          <FileTree lines={step.tree} label={`Arquivos do passo ${index + 1}`} />
          {step.note && <p className="text-caption text-muted-foreground">{step.note}</p>}
        </div>
      </div>
      <div className="mt-5 border-t border-border pt-4">
        <Stepper index={index} onSelect={setIndex} />
      </div>
      <p aria-live="polite" className="sr-only">
        Passo {index + 1} de {FLOW_STEPS.length}: {step.title}
      </p>
    </figure>
  );
}
