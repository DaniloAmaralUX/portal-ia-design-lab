import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { DisclosureSummary } from "@/components/ui/disclosure";
import { SETUP, SYSTEMS, systemOf, TOOLKIT, type System } from "@/data/catalyst-toolkit";
import { cn } from "@/lib/utils";
import { CopyCommand } from "./CopyCommand";
import { SystemIcon } from "./SystemIcon";

const STEP: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

// What a computer needs before the first install, closed under the bar: a tab for each system, open on the one of the browser, and
// its steps, numbered and short, each command with the button that copies it. The chapter Instalar has the step by step whole.
export function ToolSetup({ className }: { className?: string }) {
  const [system, setSystem] = useState<System>(() => systemOf(navigator.platform, navigator.userAgent));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const chosen = SETUP[system];

  function move(e: KeyboardEvent, at: number) {
    const step = STEP[e.key];
    if (!step) return;
    e.preventDefault();
    const next = SYSTEMS[(at + step + SYSTEMS.length) % SYSTEMS.length] ?? system;
    setSystem(next);
    tabs.current[SYSTEMS.indexOf(next)]?.focus();
  }

  return (
    <details className={cn("group", className)}>
      <DisclosureSummary className="mx-auto w-fit gap-1.5 rounded-lg px-2 py-1 text-small font-medium text-muted-foreground hover:text-foreground">
        Primeira vez neste computador?
      </DisclosureSummary>
      <div className="@container mt-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm sm:p-5">
        <div role="tablist" aria-label="Seu sistema" className="flex w-fit gap-0.5 rounded-xl bg-muted p-0.5">
          {SYSTEMS.map((id, i) => (
            <button
              key={id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`primeira-vez-${id}`}
              aria-selected={system === id}
              aria-controls="primeira-vez-passos"
              tabIndex={system === id ? 0 : -1}
              onClick={() => setSystem(id)}
              onKeyDown={(e) => move(e, i)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-caption font-medium transition-colors duration-(--duration-fast)",
                system === id ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <SystemIcon system={id} className="mr-1.5" />
              {SETUP[id].label}
            </button>
          ))}
        </div>
        <div role="tabpanel" id="primeira-vez-passos" aria-labelledby={`primeira-vez-${system}`} className="mt-4">
          {chosen.intro && <p className="mb-4 text-small text-muted-foreground text-pretty">{chosen.intro}</p>}
          <ol className="grid gap-4">
            {chosen.steps.map(({ text, commands, link }, i) => (
              <li key={`${system}-${i}`} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3">
                <span aria-hidden className="grid size-6 place-items-center rounded-full bg-muted font-mono text-micro font-semibold text-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-small text-foreground text-pretty">
                    {text}
                    {link && (
                      <>
                        {" "}
                        <a href={link.href} target="_blank" rel="noreferrer" className="link">
                          {link.text}
                        </a>
                      </>
                    )}
                  </p>
                  {commands?.map((command) => (
                    <div key={command} className="mt-2 flex min-w-0 items-center gap-2 rounded-xl bg-muted py-1 pl-3 pr-1">
                      <code className="min-w-0 flex-1 py-1 font-mono text-caption text-foreground [overflow-wrap:anywhere]">{command}</code>
                      <CopyCommand command={command} />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 border-t border-border pt-4 text-small text-muted-foreground">
            <Link to="/ferramentas/$guide/$chapter" params={{ guide: TOOLKIT.slug, chapter: "instalar" }} className="link">
              O passo a passo completo
            </Link>
            , com o que conferir em cada passo.
          </p>
        </div>
      </div>
    </details>
  );
}
