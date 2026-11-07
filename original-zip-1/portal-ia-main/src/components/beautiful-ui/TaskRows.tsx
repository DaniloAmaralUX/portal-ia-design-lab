import { useId, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide";
import { StateIcon, usePointerFeedback } from "@/components/craft/StateIcon";
import { useCraft } from "@/components/craft/craft-context";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Beautiful UI Task Rows: expandable detail rows, driven by real installation steps.
export function TaskRows({ items }: { items: { title: string; content: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const reduce = useReducedMotion();
  const { instant, record } = usePointerFeedback();
  const { duration } = useCraft();
  return (
    <ol className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
      {items.map((item, index) => (
        <li key={item.title} className="border-b border-border last:border-0">
          <button type="button" aria-expanded={open === index} aria-controls={`${id}-${index}`} onClick={(event) => { record(event); setOpen(open === index ? null : index); }} className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/60">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-caption tabular-nums">0{index + 1}</span>
            <span className="flex-1 text-body font-semibold">{item.title}</span>
            <StateIcon icon={open === index ? ChevronUp : ChevronDown} instant={instant} className="size-4 text-muted-foreground" />
          </button>
          <div id={`${id}-${index}`} inert={open !== index}>
            <AnimatePresence initial={false}>
              {open === index && <motion.div key={index} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce || instant ? 0 : duration / 1000, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden"><div className="px-5 pb-6 sm:pl-17">{item.content}</div></motion.div>}
            </AnimatePresence>
          </div>
        </li>
      ))}
    </ol>
  );
}
