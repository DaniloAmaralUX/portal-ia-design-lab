import { Fragment } from "react";
import { ArrowDown, ArrowRight, ArrowUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Medir", command: "catalyst doctor", text: "o retrato e o plano" },
  { title: "Preparar", command: "catalyst init", text: "numa entrevista com você" },
  { title: "Medir de novo", command: "catalyst doctor", text: "o que mudou de nível" },
];
const HANDS = ["plano", "mudança"];
const loop = "border-dashed border-foreground/45";

function Step({ n, title, command, text }: { n: number; title: string; command: string; text: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5 rounded-2xl border bg-card p-4 shadow-xs", n === 2 ? "border-brand-red/70" : "border-border")}>
      <div className="flex items-center gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-red-ink font-display text-caption font-extrabold text-background">{n}</span>
        <span className="text-body font-bold">{title}</span>
      </div>
      <span className="font-mono text-caption font-semibold text-brand-red-ink">{command}</span>
      <span className="text-caption text-muted-foreground">{text}</span>
    </div>
  );
}

function Hand({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-caption font-semibold text-muted-foreground @xl:flex-col @xl:gap-1">
      <ArrowDown aria-hidden className="size-4 @xl:hidden" />
      <ArrowRight aria-hidden className="hidden size-4 @xl:block" />
      {label}
    </div>
  );
}

// Measure, prepare, measure again: the doctor gives the mark at both ends, and every change in the project starts the cycle over.
export function CatalystCycle({ label }: { label: string }) {
  return (
    <figure role="img" aria-label={label} className="@container">
      <div className="grid gap-2 @xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] @xl:items-center @xl:gap-x-3 @xl:gap-y-1">
        {STEPS.map((step, i) => {
          const hand = HANDS[i];
          return (
            <Fragment key={step.title}>
              <Step n={i + 1} {...step} />
              {hand && <Hand label={hand} />}
            </Fragment>
          );
        })}
        {/* The way back, on a wide figure: a line from under the last step to under the first, on the columns of the steps. */}
        <div className="hidden h-7 @xl:col-span-5 @xl:grid @xl:grid-cols-subgrid">
          <div className={cn("relative -mr-3 ml-[50%] rounded-bl-2xl border-b-[1.5px] border-l-[1.5px]", loop)}>
            <ArrowUp aria-hidden className="absolute -left-[8.75px] -top-2 size-4 text-foreground/60" />
          </div>
          <div className={cn("col-span-3 border-b-[1.5px]", loop)} />
          <div className={cn("-ml-3 mr-[50%] rounded-br-2xl border-b-[1.5px] border-r-[1.5px]", loop)} />
        </div>
      </div>
      <p className="mt-3 flex items-center justify-center gap-2 text-caption text-muted-foreground @xl:mt-2">
        <RotateCcw aria-hidden className="size-3.5 @xl:hidden" />a cada mudança no projeto, o ciclo recomeça
      </p>
    </figure>
  );
}
