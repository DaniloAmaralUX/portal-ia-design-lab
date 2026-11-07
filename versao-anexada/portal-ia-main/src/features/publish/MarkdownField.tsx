import { useState, type KeyboardEvent, type ReactNode } from "react";
import { RecordingText } from "@/features/academy";
import { cn } from "@/lib/utils";
import { Field } from "./Field";
import { areaControl } from "./field-class";

type Mode = "write" | "preview";

const TABS: { mode: Mode; label: string }[] = [
  { mode: "write", label: "Escrever" },
  { mode: "preview", label: "Visualizar" },
];

const tab = "h-8 rounded-lg px-3 text-caption font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// A field with a problem goes back to Escrever, so the focus of the submit finds the textarea.
export function MarkdownField({
  id,
  label,
  hint,
  value,
  problem,
  onChange,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  value: string;
  problem?: string;
  onChange: (value: string) => void;
}) {
  const [chosen, setChosen] = useState<Mode>("write");
  const mode = problem ? "write" : chosen;

  const arrows = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const next = mode === "write" ? "preview" : "write";
    setChosen(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <Field id={id} label={label} hint={hint} problem={problem}>
      {(c) => (
        <div className="rounded-[calc(var(--radius-xl)+0.375rem)] border border-border bg-muted/40 p-1.5">
          <div role="tablist" aria-label="Modo do texto" onKeyDown={arrows} className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.mode}
                id={`${id}-tab-${t.mode}`}
                type="button"
                role="tab"
                aria-selected={mode === t.mode}
                aria-controls={`${id}-panel-${t.mode}`}
                tabIndex={mode === t.mode ? 0 : -1}
                onClick={() => setChosen(t.mode)}
                className={cn(tab, mode === t.mode ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div id={`${id}-panel-write`} role="tabpanel" aria-labelledby={`${id}-tab-write`} hidden={mode !== "write"} className="mt-1.5">
            <textarea {...c} rows={12} value={value} onChange={(e) => onChange(e.target.value)} className={cn(areaControl, "max-h-128 min-h-64 font-mono")} />
          </div>
          <div
            id={`${id}-panel-preview`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-preview`}
            tabIndex={0}
            hidden={mode !== "preview"}
            className="mt-1.5 max-h-128 min-h-64 overflow-y-auto overscroll-contain rounded-xl border border-border bg-card px-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-5"
          >
            {value.trim() ? <RecordingText text={value} /> : <p className="text-small text-muted-foreground">Nada para visualizar ainda. Escreva o texto na aba Escrever.</p>}
          </div>
        </div>
      )}
    </Field>
  );
}
