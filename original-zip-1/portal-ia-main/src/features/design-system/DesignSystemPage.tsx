import { useState } from "react";
import { SourceCollection } from "./SourceCollection";
import { libraryItems } from "@/design-system/catalog";
import { beautifulRegistry } from "./beautiful-registry";
import "@/design-system/beautiful/reference.css";
import "./catalog.css";

export function DesignSystemPage() {
  const [collection, setCollection] = useState<"beautiful" | "chanhdai" | "wigggle" | "devl" | "motion-primitives">("beautiful");
  const [selected, setSelected] = useState(() => window.location.hash.slice(1) || "loading-state");
  const [query, setQuery] = useState("");
  const [variant, setVariant] = useState("");
  const [revision, setRevision] = useState(0);
  const [dark, setDark] = useState(false);
  const entry = beautifulRegistry.find(item => item.id === selected) ?? beautifulRegistry[0]!;
  const currentVariant = entry.variants.includes(variant) ? variant : entry.variants[0]!;
  const matches = beautifulRegistry.filter(item => `${item.title} ${item.description}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  function select(id: string) {
    setSelected(id);
    setVariant("");
    history.replaceState(history.state, "", `#${id}`);
  }
  return <div className="ds-catalog">
    <header className="mb-8 border-b border-border pb-7">
      <p className="text-small text-muted-foreground">Pitang · Biblioteca de interfaces</p>
      <h1 className="mt-3 text-title font-semibold tracking-tight">Portal UI</h1>
      <p className="mt-3 max-w-2xl text-body text-muted-foreground">Componentes executáveis, telas completas e fontes de motion. Explore as coleções; cada item informa se está integrado ou se precisa de adaptação.</p>
      <p className="mt-3 text-small text-muted-foreground">Dados demonstrativos do original. Nenhuma ação envia mensagens, executa ferramentas ou grava sua tela.</p>
    </header>
    <div role="group" aria-label="Coleções da biblioteca" className="mb-8 flex flex-wrap gap-2">
      {(["beautiful", "chanhdai", "wigggle", "devl", "motion-primitives"] as const).map(value => <button type="button" key={value} aria-pressed={collection === value} onClick={() => setCollection(value)} className={`rounded-full border border-border px-4 py-2 text-small ${collection === value ? "bg-foreground text-background" : "hover:bg-muted"}`}>{value === "beautiful" ? "Beautiful UI / 21" : value === "chanhdai" ? "Chanh Dai / 47" : `${value} / ${libraryItems.filter(item => item.collection === value).length}`}</button>)}
    </div>
    {collection === "beautiful" ? <div className="grid min-w-0 gap-8 xl:grid-cols-[190px_minmax(0,1fr)]">
      <nav aria-label="Componentes Beautiful UI" className="min-w-0">
        <label htmlFor="ds-search" className="sr-only">Buscar componente</label>
        <input id="ds-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar componente…" className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-small" />
        <div className="flex gap-1 overflow-x-auto pb-2 xl:flex-col">
          {matches.map(item => <button key={item.id} type="button" aria-current={item.id === entry.id ? "true" : undefined} onClick={() => select(item.id)} className={`shrink-0 rounded-lg px-3 py-2 text-left text-small transition-colors ${item.id === entry.id ? "bg-accent font-semibold" : "text-muted-foreground hover:bg-muted"}`}>{item.title}</button>)}
        </div>
        {!matches.length && <p role="status" className="text-small text-muted-foreground">Nenhum componente encontrado.</p>}
      </nav>
      <section aria-labelledby="ds-component-title" className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-caption text-muted-foreground">{String(beautifulRegistry.indexOf(entry) + 1).padStart(2, "0")} / 21</p><h2 id="ds-component-title" className="mt-1 text-xl font-semibold">{entry.title}</h2><p className="mt-2 text-small text-muted-foreground">{entry.description}</p></div>
          <a href={`https://www.beautifului.dev/#${entry.id}`} target="_blank" rel="noreferrer" className="text-small underline underline-offset-4">Ver original ↗</a>
        </div>
        <div className="my-5 flex flex-wrap items-center gap-2" aria-label="Controles da demonstração">
          {entry.variants.length > 1 && entry.variants.map(value => <button key={value} type="button" aria-pressed={value === currentVariant} onClick={() => setVariant(value)} className={`rounded-full border border-border px-3 py-1.5 text-small ${value === currentVariant ? "bg-foreground text-background" : "hover:bg-muted"}`}>{value}</button>)}
          <button type="button" onClick={() => setRevision(value => value + 1)} className="ml-auto rounded-lg border border-border px-3 py-1.5 text-small">Reiniciar</button>
          <button type="button" aria-pressed={dark} onClick={() => setDark(value => !value)} className="rounded-lg border border-border px-3 py-1.5 text-small">{dark ? "Tema claro" : "Tema escuro"}</button>
        </div>
        <div className={dark ? "dark" : ""}>
          <div className="beautiful-catalog ds-preview" data-demo={entry.id}>
            <div key={`${entry.id}-${currentVariant}-${revision}`} className="ds-specimen">{entry.render(currentVariant)}</div>
          </div>
        </div>
        <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <div><h3 className="text-small font-semibold">Uso no portal</h3><p className="mt-1 text-small text-muted-foreground">Referência funcional isolada. A integração com os dados e fluxos do portal será feita após a revisão visual.</p></div>
          <div><h3 className="text-small font-semibold">Procedência</h3><p className="mt-1 text-small text-muted-foreground">Beautiful UI · Shane Levine · MIT. Fontes originais com ajustes de tipos, estilos isolados e primitivas de apoio locais.</p></div>
        </div>
      </section>
    </div> : <SourceCollection key={collection} collection={collection} />}
  </div>;
}
