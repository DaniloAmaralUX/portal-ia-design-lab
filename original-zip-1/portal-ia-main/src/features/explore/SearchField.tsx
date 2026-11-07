import type { KeyboardEvent, Ref } from "react";
import { Search, X } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function SearchField({
  value,
  onChange,
  onClear,
  onKeyDown,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: Ref<HTMLInputElement>;
}) {
  return (
    <div className="mt-8 flex items-center gap-2 rounded-2xl border border-border bg-card p-2 pl-5 shadow-xs transition-[border-color,box-shadow] focus-within:border-foreground/60 focus-within:shadow-md contrast-more:focus-within:border-foreground has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring">
      <Search strokeWidth={1.5} className="size-5 shrink-0 text-muted-foreground" />
      <label htmlFor="explore-search" className="sr-only">
        Buscar skills
      </label>
      <input
        id="explore-search"
        ref={inputRef}
        data-page-search
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        // One example, which fits the field of a 320px phone; three were cut mid-word there ("massa de test").
        placeholder="Ex.: revisar performance"
        autoComplete="off"
        className="h-11 min-w-0 flex-1 bg-transparent text-field outline-none placeholder:text-muted-foreground focus-visible:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpar a busca"
          className={cn("inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground", press)}
        >
          <X className="size-4" />
        </button>
      ) : (
        <Kbd className="mr-2.5 hidden sm:inline-flex">/</Kbd>
      )}
    </div>
  );
}
