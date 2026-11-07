import { useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AreaDot } from "@/components/AreaDot";
import { Container } from "@/components/ui/container";
import { plugins } from "@/data/catalog";
import { areas } from "@/data/areas";
import { MODES } from "@/data/modes";
import { iconHidden, iconShown, iconSwap } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { chip, chipActive, chipIdle } from "./chip-class";
import type { ExploreSearch, Order } from "./explore-search";

function Select<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <label className="relative inline-flex shrink-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 appearance-none rounded-full border border-input bg-card pl-3 pr-8 text-field font-medium sm:text-small text-foreground/85 transition-colors hover:border-foreground/60 contrast-more:hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </label>
  );
}

// The bar under the search field: the area chips and the three selects. It keeps the height of the sticky bar in a variable, for the sticky things under it.
export function FilterBar({ search, order, onChange }: { search: ExploreSearch; order: Order; onChange: (patch: Partial<ExploreSearch>) => void }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const html = document.documentElement;
    const measure = () => html.style.setProperty("--filters-height", `${el.offsetHeight}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      observer.disconnect();
      html.style.removeProperty("--filters-height");
    };
  }, []);
  return (
    <div
      ref={bar}
      data-filters
      className="top-16 z-30 border-y border-border/70 bg-background/95 backdrop-blur-xl [@media(height>=40rem)]:sticky"
    >
      <Container
        onFocus={(e) => e.target.scrollIntoView({ block: "nearest", inline: "nearest" })}
        className="flex items-center gap-2 overflow-x-auto py-2.5 [scrollbar-width:none] max-md:scroll-pr-11 [@media(pointer:fine)]:[scrollbar-width:thin] max-md:!pr-11 max-md:[mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)] md:flex-wrap md:overflow-visible"
      >
        <button
          type="button"
          aria-pressed={!search.area}
          onClick={() => onChange({ area: undefined })}
          className={cn(chip, !search.area ? chipActive : chipIdle)}
        >
          <span aria-hidden className="inline-grid size-3.5 shrink-0 place-items-center">
            <span className={cn("col-start-1 row-start-1 size-2 rounded-full bg-foreground/40", iconSwap, search.area ? iconShown : iconHidden)} />
            <Check className={cn("col-start-1 row-start-1 size-3.5", iconSwap, search.area ? iconHidden : iconShown)} />
          </span>
          Todas as áreas
        </button>
        {areas.map((a) => (
          <button
            key={a.id}
            type="button"
            aria-pressed={search.area === a.id}
            onClick={() => onChange({ area: search.area === a.id ? undefined : a.id })}
            className={cn(chip, search.area === a.id ? chipActive : chipIdle)}
          >
            <span aria-hidden className="inline-grid size-3.5 shrink-0 place-items-center">
              <AreaDot area={a.id} className={cn("col-start-1 row-start-1", iconSwap, search.area === a.id ? iconHidden : iconShown)} />
              <Check className={cn("col-start-1 row-start-1 size-3.5", iconSwap, search.area === a.id ? iconShown : iconHidden)} />
            </span>
            {a.name}
          </button>
        ))}
        <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-border md:hidden" />
        <div className="contents md:flex md:flex-wrap md:gap-2">
          <Select
            label="Plugin"
            value={search.plugin ?? ""}
            onChange={(v) => onChange({ plugin: v || undefined })}
            options={[{ value: "", label: "Todos os plugins" }, ...plugins.map((p) => ({ value: p.name, label: p.displayName }))]}
          />
          <Select
            label="Como a skill dispara"
            value={search.modo ?? ""}
            onChange={(v) => onChange({ modo: v || undefined })}
            options={[
              { value: "", label: "Qualquer disparo" },
              { value: "auto", label: MODES.auto.label },
              { value: "manual", label: MODES.manual.label },
            ]}
          />
          <Select
            label="Ordenar"
            value={order}
            onChange={(v) => onChange({ ordem: v })}
            options={[
              { value: "relevancia", label: "Ordenar por relevância" },
              { value: "plugin", label: "Ordenar por plugin" },
              { value: "az", label: "Ordenar de A a Z" },
            ]}
          />
        </div>
      </Container>
    </div>
  );
}
