import { useId, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Blocks } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CopyButton } from "@/design-system/primitives";
import { useCraft } from "@/components/craft/craft-context";
import { marketplaceAdd } from "@/lib/commands";
import { suggestions } from "@/data/areas";
import { cn } from "@/lib/utils";
import { HowItWorks } from "./HowItWorks";
import { VoiceSearch } from "./VoiceSearch";

const modes = [{ id: "preview", label: "Explorar" }, { id: "install", label: "Instalar" }] as const;
type Mode = typeof modes[number]["id"];

export function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("preview");
  const [instant, setInstant] = useState(true);
  const tabs = useRef<HTMLDivElement>(null);
  const id = useId();
  const reduce = useReducedMotion();
  const { stiffness, damping } = useCraft();

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    void navigate({ to: "/explorar", search: q ? { q } : {} });
  }

  return (
    <section aria-labelledby="portal-title">
      <header className="pb-6">
        <span aria-hidden className="mb-3 flex size-11 items-center justify-center rounded-xl bg-foreground/8 text-muted-foreground"><Blocks className="size-6" strokeWidth={1.5} /></span>
        <h1 id="portal-title" className="font-display text-title font-medium">IA no seu trabalho, com a Pitang</h1>
        <p className="mt-3 max-w-2xl text-small leading-relaxed text-muted-foreground">Encontre o que precisa para aprender IA, aplicar o Método da Pitang e usar as ferramentas da empresa.</p>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div ref={tabs} role="tablist" aria-label="Modo do portal" className="inline-flex items-center gap-1 rounded-full bg-muted/50 p-1" onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === "Home" ? "preview" : event.key === "End" ? "install" : mode === "preview" ? "install" : "preview";
          setInstant(true);
          setMode(next);
          tabs.current?.querySelector<HTMLButtonElement>(`[data-mode="${next}"]`)?.focus();
        }}>
          {modes.map((entry) => (
            <button key={entry.id} id={`${id}-${entry.id}-tab`} data-mode={entry.id} role="tab" type="button" tabIndex={mode === entry.id ? 0 : -1} aria-selected={mode === entry.id} aria-controls={`${id}-${entry.id}-panel`} onClick={(event) => { setInstant(event.detail === 0); setMode(entry.id); }} className={cn("relative isolate min-h-8 rounded-full px-3 text-caption font-medium transition-colors", mode === entry.id ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {mode === entry.id && <motion.span aria-hidden className="absolute inset-0 -z-10 rounded-full bg-accent" layoutId={`${id}-mode-pill`} transition={instant || reduce ? { duration: 0 } : { type: "spring", stiffness, damping }} />}
              {entry.label}
            </button>
          ))}
        </div>
        <CopyButton withLabel text={marketplaceAdd} label="Copiar comando" name="Copiar comando de instalação" />
      </div>

      <div id={`${id}-preview-panel`} role="tabpanel" aria-labelledby={`${id}-preview-tab`} hidden={mode !== "preview"}>
        {mode === "preview" && <div className="library-stage flex min-h-[210px] flex-col items-center justify-center gap-6 px-5 py-7 sm:px-8">
          <VoiceSearch value={query} onChange={setQuery} onSubmit={submit} />
          <div className="flex max-w-xl flex-wrap justify-center gap-x-4 gap-y-2" aria-label="Sugestões de busca">
            {suggestions.map((s) => <Link key={s.q} to="/explorar" search={{ q: s.q }} className="text-caption text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground">{s.label}</Link>)}
          </div>
        </div>}
      </div>
      <div id={`${id}-install-panel`} role="tabpanel" aria-labelledby={`${id}-install-tab`} hidden={mode !== "install"}>
        {mode === "install" && <HowItWorks compact />}
      </div>
    </section>
  );
}
