import { Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/design-system/primitives";
import { skills } from "@/data/catalog";
import { suggestions } from "@/data/areas";
import { suggestionChip } from "./chip-class";

export function ExploreEmpty({
  query,
  hasQuery,
  filters,
  filtersOn,
  clearLabel,
  onQuery,
  onClear,
}: {
  query: string;
  hasQuery: boolean;
  filters: boolean;
  filtersOn: boolean;
  clearLabel: string;
  onQuery: (q: string) => void;
  onClear: () => void;
}) {
  return (
    <EmptyState
      title={hasQuery ? `Nenhuma skill para "${query}"${filters ? " com esses filtros" : ""}` : "Nenhuma skill com esses filtros"}
      description={`${
        hasQuery && filters
          ? "Tente outras palavras ou limpe os filtros."
          : hasQuery
            ? "Tente outras palavras, como as sugestões abaixo."
            : `Limpe os filtros para ver as ${skills.length} skills.`
      } Se ainda não existe skill para isso, dá para pedir uma.`}
    >
      {!filters && (
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.slice(0, 4).map((s) => (
            <button key={s.q} type="button" onClick={() => onQuery(s.q)} className={suggestionChip}>
              {s.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {filtersOn && (
          <Button variant="ghost" size="sm" className="h-9" onClick={onClear}>
            <X data-icon="inline-start" />
            {clearLabel}
          </Button>
        )}
        <Link to="/contribuir" hash="pedir" className="inline-flex h-9 items-center gap-1 text-small link">
          Pedir uma skill
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </div>
    </EmptyState>
  );
}
