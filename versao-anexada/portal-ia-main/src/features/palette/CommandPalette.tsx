import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { Copy, History, Moon, Search, Sun } from "lucide-react";
import { AreaMark } from "@/components/AreaMark";
import { Kbd } from "@/components/ui/kbd";
import { areas } from "@/data/areas";
import { PAGES } from "@/data/pages";
import { useCopy } from "@/hooks/use-copy";
import { fadeBelow, useMoreBelow } from "@/hooks/use-more-below";
import { useReturnFocus } from "@/hooks/use-return-focus";
import { marketplaceAdd } from "@/lib/commands";
import { searchSite, type SearchHit } from "@/lib/site-search";
import { cn, plural } from "@/lib/utils";
import { useUi } from "@/store/ui";
import { iconClass, itemClass } from "./palette-classes";
import { GROUP, groupHits, matches } from "./palette-results";
import { hitKey, hitRow, hitTarget } from "./palette-hits";
import { PaletteRow } from "./PaletteRow";
import { useRecent } from "./use-recent";

export function CommandPalette() {
  const open = useUi((s) => s.paletteOpen);
  const setOpen = useUi((s) => s.setPaletteOpen);
  const theme = useUi((s) => s.theme);
  const toggleTheme = useUi((s) => s.toggleTheme);
  const navigate = useNavigate();
  const { copy } = useCopy("Comando copiado");
  const returnFocus = useReturnFocus();
  const [search, setSearch] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { recentPages, queries, visit, searched } = useRecent();

  useEffect(() => visit(pathname), [pathname, visit]);

  function close() {
    setSearch("");
    setOpen(false);
  }

  function run(action: () => void) {
    close();
    action();
  }

  function openHit(hit: SearchHit) {
    searched(search.trim());
    run(() => void navigate(hitTarget(hit)));
  }

  const query = search.trim();
  const recent = open && !query ? recentPages().filter((r) => r.path !== pathname) : [];
  const results = query ? searchSite(query) : [];
  const groups = groupHits(results.map((r) => r.item));
  const pages = query ? [] : PAGES.filter((p) => !p.searchOnly);
  const matchedAreas = areas.filter((a) => !query || matches(query, `area ${a.name} ${a.audience}`));
  const actions = [
    {
      id: "copy",
      keywords: "copiar comando marketplace instalar adicionar",
      icon: <Copy className={iconClass} />,
      title: "Copiar o comando do marketplace",
      does: () => void copy(marketplaceAdd),
    },
    {
      id: "theme",
      keywords: "alternar tema claro escuro modo",
      icon: theme === "dark" ? <Sun className={iconClass} /> : <Moon className={iconClass} />,
      title: `Usar tema ${theme === "dark" ? "claro" : "escuro"}`,
      does: toggleTheme,
    },
  ].filter((a) => !query || matches(query, a.keywords));
  const total = groups.reduce((n, g) => n + g.items.length, 0) + (query ? matchedAreas.length + actions.length : 0);
  const announcement = !query ? "" : total ? plural(total, "resultado", "resultados") : "Nada encontrado";

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <Dialog.Portal>
        <Dialog.Overlay className="animate-overlay-in fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          {...returnFocus}
          className="animate-pop-in fixed left-1/2 top-[10vh] z-[81] w-[min(94vw,640px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl outline-none"
        >
          <Dialog.Title className="sr-only">Buscar no site</Dialog.Title>
          <p role="status" className="sr-only">
            {announcement}
          </p>
          <Command shouldFilter={false} loop label="Buscar no site">
            <div className="flex items-center gap-3 border-b border-border px-4 has-[input:focus-visible]:shadow-[inset_0_-2px_0_var(--ring)]">
              <Search strokeWidth={1.5} className="size-[18px] shrink-0 text-muted-foreground" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Busque uma skill, um plugin, um guia ou uma página…"
                className="h-14 min-w-0 flex-1 bg-transparent text-field outline-none sm:text-body placeholder:text-muted-foreground"
              />
              <Kbd className="hidden sm:inline-flex">Esc</Kbd>
            </div>
            <ResultList>
              <Command.Empty className="px-6 py-12 text-center text-small text-muted-foreground">
                <p className="font-medium text-foreground [overflow-wrap:anywhere]">Nada encontrado para "{query}"</p>
                <p className="mt-1 text-pretty">
                  Busque pela tarefa, como "revisar" ou "documentar", ou pelo nome de uma seção, como "Academy" ou "Método".
                </p>
              </Command.Empty>

              {groups.map(({ kind, items }) => (
                <Command.Group key={kind} heading={GROUP[kind]}>
                  {items.map((hit) => (
                    <Command.Item key={hitKey(hit)} value={hitKey(hit)} onSelect={() => openHit(hit)} className={itemClass}>
                      {hitRow(hit)}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}

              {recent.length > 0 && (
                <Command.Group heading="Abertas recentemente">
                  {recent.map(({ path, hit }) => (
                    <Command.Item key={path} value={`recent:${path}`} onSelect={() => openHit(hit)} className={itemClass}>
                      {hitRow(hit)}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {!query && queries.length > 0 && (
                <Command.Group heading="Buscas recentes">
                  {queries.map((q) => (
                    <Command.Item key={q} value={`query:${q}`} onSelect={() => setSearch(q)} className={itemClass}>
                      <PaletteRow icon={<History className={iconClass} />} title={q} />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {pages.length > 0 && (
                <Command.Group heading="Páginas">
                  {pages.map((page) => (
                    <Command.Item
                      key={hitKey({ kind: "page", page })}
                      value={hitKey({ kind: "page", page })}
                      onSelect={() => openHit({ kind: "page", page })}
                      className={itemClass}
                    >
                      {hitRow({ kind: "page", page })}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {matchedAreas.length > 0 && (
                <Command.Group heading="Skills por área">
                  {matchedAreas.map((area) => (
                    <Command.Item
                      key={area.id}
                      value={`area:${area.id}`}
                      onSelect={() => run(() => void navigate({ to: "/explorar", search: { area: area.id } }))}
                      className={itemClass}
                    >
                      <PaletteRow icon={<AreaMark area={area.id} size="sm" />} title={area.name} detail={area.audience} />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {actions.length > 0 && (
                <Command.Group heading="Ações">
                  {actions.map((action) => (
                    <Command.Item key={action.id} value={`action:${action.id}`} onSelect={() => run(action.does)} className={itemClass}>
                      <PaletteRow icon={action.icon} title={action.title} />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </ResultList>
            <div className="hidden items-center gap-4 border-t border-border px-4 py-2.5 text-micro text-muted-foreground sm:flex">
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> navegar
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>↵</Kbd> abrir
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>Esc</Kbd> fechar
              </span>
              {/* The screen reader hears the count in the status of the dialog; here it is for the eye. */}
              {query && total > 0 && (
                <span aria-hidden className="ml-auto tabular-nums">
                  {plural(total, "resultado", "resultados")}
                </span>
              )}
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// The list of results fades at the bottom while it hides more below: at 460px it ends on the seventh row, and the rest looked like
// it was not there. It mounts with the dialog, so it measures when the palette opens.
function ResultList({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const more = useMoreBelow(ref);
  return (
    <Command.List
      ref={ref}
      label="Resultados da busca"
      data-more={more}
      className={cn("max-h-[min(62vh,460px)] overflow-y-auto overscroll-contain p-2", more && fadeBelow)}
    >
      {children}
    </Command.List>
  );
}
