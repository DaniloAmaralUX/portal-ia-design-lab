import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUp, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Magnetic, MagneticField } from "@/components/ui/magnetic";
import { ToolChips } from "./ToolChips";
import { useCraft } from "@/components/craft/craft-context";

// Beautiful UI Prompt Bar: input, context chips and submit rail. Search remains a real form.
export function PromptSearch({ value, onChange, onSubmit, accessory }: { value: string; onChange: (value: string) => void; onSubmit: (event: FormEvent) => void; accessory?: ReactNode }) {
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const { magnetic } = useCraft();
  return (
    <MagneticField>
      <motion.form
        onSubmit={onSubmit}
        role="search"
        initial={false}
        animate={{ boxShadow: focused ? "0 0 0 3px color-mix(in oklch, var(--ring) 15%, transparent), var(--shadow-sm)" : "0 0 0 0px transparent, var(--shadow-xs)" }}
        transition={{ duration: 0.18 }}
        className="overflow-hidden rounded-2xl border border-border/50 bg-card focus-within:border-ring"
      >
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <Search aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          <label htmlFor="hero-search" className="sr-only">O que você precisa fazer?</label>
          <input ref={input} id="hero-search" data-page-search value={value} onChange={(event) => onChange(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} autoComplete="off" autoCapitalize="none" enterKeyHint="search" placeholder="O que você precisa fazer?" className="h-10 min-w-0 flex-1 bg-transparent text-field caret-brand-red outline-none placeholder:text-muted-foreground focus-visible:outline-none" />
          <AnimatePresence initial={false}>
            {value && <motion.button type="button" aria-label="Limpar a busca" onClick={() => { onChange(""); input.current?.focus(); }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><X aria-hidden className="size-4" /></motion.button>}
          </AnimatePresence>
          {accessory}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 bg-muted/15 px-3 py-2.5">
          <ToolChips />
          <div className="ml-auto flex items-center gap-2">
            <Kbd className="max-sm:hidden">/</Kbd>
            <Magnetic max={magnetic} strength={0.16} radius={45}>
              <Button type="submit" size="icon-sm" aria-label="Buscar" className="size-9 rounded-full"><ArrowUp aria-hidden /></Button>
            </Magnetic>
          </div>
        </div>
      </motion.form>
    </MagneticField>
  );
}
