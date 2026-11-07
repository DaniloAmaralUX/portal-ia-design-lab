import { Fragment } from "react";
import { ArrowDown, ArrowRight, Undo2 } from "lucide-react";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FLOW_STEPS } from "./openspec-flow";

const REVIEW = FLOW_STEPS.findIndex((step) => step.gate && step.command.startsWith("/opsx:update"));
const LOOP = FLOW_STEPS[REVIEW]?.command.split(" ")[0] ?? "";

function box(active: boolean, gate: boolean | undefined): string {
  return cn(
    "w-full rounded-xl border px-3 py-2 text-center font-mono text-caption",
    gate && "border-dashed",
    active ? "border-brand-red-ink bg-card font-semibold text-foreground ring-2 ring-brand-red/25" : "border-border text-muted-foreground hover:bg-accent/60 hover:text-foreground",
    press,
  );
}

// The flow of a change, top to bottom: the box of the step on show is lit, and the others stay readable behind it. The review
// is a gate, so the way back to the update hangs under it.
export function OpenSpecDiagram({ current, onSelect }: { current: number; onSelect: (index: number) => void }) {
  return (
    <ol className="hidden flex-col items-center gap-1.5 @xl:flex">
      {FLOW_STEPS.map((step, i) => (
        <Fragment key={step.node}>
          <li className="flex w-full flex-col items-center gap-1.5">
            <button
              type="button"
              aria-label={`Passo ${i + 1} de ${FLOW_STEPS.length}: ${step.node}`}
              aria-current={i === current ? "step" : undefined}
              onClick={() => onSelect(i)}
              className={box(i === current, step.gate)}
            >
              {step.node}
            </button>
            {i === REVIEW && (
              <span className="flex items-center gap-1.5 text-caption text-muted-foreground">
                <span>não</span>
                <ArrowRight aria-hidden className="size-3.5" />
                <span className="rounded-lg border border-dashed border-border px-2 py-1 font-mono">{LOOP}</span>
                <Undo2 aria-hidden className="size-3.5" />
              </span>
            )}
          </li>
          {i < FLOW_STEPS.length - 1 && (
            <li aria-hidden className="flex items-center gap-1.5 text-muted-foreground">
              <ArrowDown className="size-4" />
              {i === REVIEW && <span className="text-caption">sim</span>}
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}
