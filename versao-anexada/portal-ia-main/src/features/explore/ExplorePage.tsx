import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { areaStyle } from "@/components/area-style";
import { CatalogTabs } from "@/components/CatalogTabs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { areaById } from "@/data/areas";
import { AcademyCard } from "@/features/method";
import { terms } from "@/lib/search";
import { searchSite } from "@/lib/site-search";
import { cn, plural } from "@/lib/utils";
import { filterSkills } from "./explore-filter";
import type { ExploreSearch, Order } from "./explore-search";
import { ExploreEmpty } from "./ExploreEmpty";
import { FilterBar } from "./FilterBar";
import { SearchField } from "./SearchField";
import { SkillCard } from "./SkillCard";

const route = getRouteApi("/explorar");

export function ExplorePage() {
  const search = route.useSearch();
  const navigate = useNavigate({ from: "/explorar" });
  const [draft, setDraft] = useState(search.q ?? "");
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);

  const [previousUrl, setPreviousUrl] = useState(search.q);
  if (search.q !== previousUrl) {
    setPreviousUrl(search.q);
    if ((search.q ?? "") !== draft.trim()) setDraft(search.q ?? "");
  }

  useEffect(() => {
    const q = draft.trim() || undefined;
    if (q === search.q) return;
    const t = window.setTimeout(() => void navigate({ search: (prev) => ({ ...prev, q }), replace: true }), 250);
    return () => window.clearTimeout(t);
  }, [draft, search.q, navigate]);

  function update(patch: Partial<ExploreSearch>) {
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  }

  function applyQuery(q: string) {
    setDraft(q);
    update({ q: q || undefined });
  }

  function clearAll() {
    setDraft("");
    void navigate({ search: {}, replace: true });
  }

  const hasQuery = terms(draft).length > 0;
  const order: Order = search.ordem ?? (hasQuery ? "relevancia" : "plugin");

  const { area: areaFilter, plugin: pluginFilter, modo: modeFilter } = search;
  const list = useMemo(
    () => filterSkills({ area: areaFilter, plugin: pluginFilter, modo: modeFilter }, draft, hasQuery, order),
    [areaFilter, pluginFilter, modeFilter, hasQuery, draft, order],
  );

  const academy = useMemo(
    () =>
      hasQuery
        ? searchSite(draft, (a) => a.kind === "academy")
            .slice(0, 3)
            .flatMap((r) => (r.item.kind === "academy" ? [r.item.doc] : []))
        : [],
    [draft, hasQuery],
  );

  const filtersOn = Boolean(search.area || search.plugin || search.modo || hasQuery);
  const filters = Boolean(search.area || search.plugin || search.modo);
  const clear = hasQuery && filters ? "Limpar a busca e os filtros" : hasQuery ? "Limpar a busca" : "Limpar filtros";

  const version = [search.area, search.plugin, search.modo, search.ordem].join("|");
  const [previousVersion, setPreviousVersion] = useState(version);
  const [changed, setChanged] = useState(false);
  if (version !== previousVersion) {
    setPreviousVersion(version);
    setChanged(true);
  }

  function onInputKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      results.current?.querySelector<HTMLElement>("[data-result]")?.focus();
    }
    if (e.key === "Escape" && draft) {
      e.preventDefault();
      applyQuery("");
    }
  }

  function onResultsKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = [...(results.current?.querySelectorAll<HTMLElement>("[data-result]") ?? [])];
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    e.preventDefault();
    if (e.key === "ArrowUp" && at === 0) {
      input.current?.focus();
      return;
    }
    items[Math.min(items.length - 1, Math.max(0, at + (e.key === "ArrowDown" ? 1 : -1)))]?.focus();
  }

  const area = search.area ? areaById[search.area] : null;

  return (
    <>
      <Container className="pb-8 pt-10 sm:pt-14">
        <CatalogTabs current="skills" />
        <h1 className="mt-8 font-display text-title font-extrabold text-balance">
          {area ? (
            <>
              Skills para <span className={areaStyle[area.id].text}>{area.name}</span>
            </>
          ) : (
            "Catálogo de skills"
          )}
        </h1>
        <p className="mt-4 max-w-xl text-lead text-muted-foreground text-pretty">
          {area
            ? `${area.audience}. ${area.pitch}`
            : "Busque pelo que você quer fazer, em português, do jeito que você pediria a um colega."}
        </p>
        <SearchField value={draft} onChange={setDraft} onClear={() => applyQuery("")} onKeyDown={onInputKey} inputRef={input} />
      </Container>

      <FilterBar search={search} order={order} onChange={update} />

      <Container className="pt-6">
        <h2 className="sr-only">Resultados</h2>
        <div className="mb-5 flex min-h-8 flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-small text-muted-foreground" aria-live="polite">
              <strong className="font-semibold tabular-nums text-foreground">{plural(list.length, "skill", "skills")}</strong>
              {hasQuery ? ` para "${draft.trim()}"` : ""}
            </p>
          </div>
          {filtersOn && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <X data-icon="inline-start" />
              {clear}
            </Button>
          )}
        </div>

        {list.length > 0 ? (
          <div
            key={version}
            ref={results}
            onKeyDown={onResultsKey}
            className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", changed && "animate-results")}
          >
            {list.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} />
            ))}
          </div>
        ) : (
          <ExploreEmpty
            query={draft.trim()}
            hasQuery={hasQuery}
            filters={filters}
            filtersOn={filtersOn}
            clearLabel={clear}
            onQuery={applyQuery}
            onClear={clearAll}
          />
        )}

        <AcademyCard id="no-metodo" title="No Método" excerpts={academy} className="mt-10 max-w-3xl" />
      </Container>
    </>
  );
}
