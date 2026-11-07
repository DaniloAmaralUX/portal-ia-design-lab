import { useEffect, useState } from "react";
import { libraryItems, type LibraryItem } from "@/design-system/catalog";
import { CodeBlock } from "@/components/CodeBlock";
import { CopyButton } from "@/components/CopyButton";
import { WheelPicker, WheelPickerWrapper } from "@/components/wheel-picker";

type RegistrySource = { files: { path: string; content?: string }[]; dependencies?: string[]; registryDependencies?: string[] };
function isSource(value: unknown): value is RegistrySource {
  return typeof value === "object" && value !== null && "files" in value && Array.isArray(value.files) && value.files.every((file: unknown) => typeof file === "object" && file !== null && "path" in file && typeof file.path === "string" && (!('content' in file) || typeof file.content === "string"));
}
export function SourceCollection({ collection }: { collection: LibraryItem["collection"] }) {
  const [query, setQuery] = useState("");
  const items = libraryItems.filter(item => item.collection === collection);
  const [chosen, setChosen] = useState("");
  const selected = items.find(item => item.id === chosen) ?? items[0]!;
  const [source, setSource] = useState<RegistrySource | null>(null);
  const [error, setError] = useState("");
  const [fileIndex, setFileIndex] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void fetch(selected.asset, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("Não foi possível abrir os fontes.");
      const body: unknown = await response.json();
      if (!isSource(body)) throw new Error("Formato de fonte inválido.");
      setSource(body); setFileIndex(0); setError("");
    }).catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Erro ao abrir fonte."); });
    return () => controller.abort();
  }, [selected.asset]);
  const filtered = items.filter(item => `${item.title} ${item.family}`.toLowerCase().includes(query.toLowerCase()));
  const file = source?.files[fileIndex];
  return <div className="grid min-w-0 gap-6 xl:grid-cols-[190px_minmax(0,1fr)]">
    <nav aria-label={`Componentes ${collection}`} className="min-w-0">
      <label htmlFor="library-search" className="sr-only">Buscar componente</label>
      <input id="library-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar componente…" className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-small" />
      <div className="flex max-h-[650px] gap-1 overflow-auto pb-2 xl:flex-col">{filtered.map(item => <button key={item.id} type="button" aria-current={item.id === selected.id ? "true" : undefined} onClick={() => { setChosen(item.id); setSource(null); }} className={`shrink-0 rounded-lg px-3 py-2 text-left text-small ${item.id === selected.id ? "bg-accent font-semibold" : "text-muted-foreground hover:bg-muted"}`}>{item.title}</button>)}</div>
      {!filtered.length && <p role="status">Nenhum componente encontrado.</p>}
    </nav>
    <section className="min-w-0" aria-labelledby="library-component-title">
      <p className="text-caption text-muted-foreground">{items.length} itens · {selected.status}</p>
      <h2 id="library-component-title" className="mt-2 text-xl font-semibold">{selected.title}</h2>
      <p className="mt-2 text-small text-muted-foreground">{selected.description}</p>
      <p className="mt-3 text-small"><strong>Família / variante:</strong> {selected.family} · {collection}</p>
      <div className="mt-5 flex flex-wrap gap-4 text-small"><a href={selected.source} target="_blank" rel="noreferrer" className="underline underline-offset-4">Demonstração original ↗</a><a href={selected.asset} download={`${selected.id}.json`} className="underline underline-offset-4">Baixar componente e dependências</a></div>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted px-3 py-2"><code className="min-w-0 break-all text-caption">{selected.install}</code>{selected.status !== "Receita original" && <CopyButton text={selected.install} name="Copiar comando de instalação" />}</div>
      {selected.id === "react-wheel-picker" && <div className="my-6 flex flex-col items-center gap-3 rounded-xl border border-border p-6"><p className="text-small text-muted-foreground">Seletor oficial instalado · arraste ou use o teclado</p><WheelPickerWrapper><WheelPicker options={Array.from({ length: 24 }, (_, value) => ({ label: String(value).padStart(2, "0"), value }))} defaultValue={9} infinite /><WheelPicker options={Array.from({ length: 60 }, (_, value) => ({ label: String(value).padStart(2, "0"), value }))} defaultValue={41} infinite /></WheelPickerWrapper></div>}
      <p className="mt-5 text-small text-muted-foreground">Fontes preservados para instalação sob demanda. Dependências e requisitos de framework variam por componente; os exemplos que usam Next.js ou serviços externos precisam ser adaptados ao front de destino.</p>
      {error && <p role="alert" className="mt-4">{error}</p>}
      {source && <><label htmlFor="library-file" className="mt-5 block text-small font-medium">Arquivos ({source.files.length})</label><select id="library-file" value={fileIndex} onChange={e => setFileIndex(Number(e.target.value))} className="mt-2 w-full rounded-lg border border-border bg-background p-2 text-small">{source.files.map((item, index) => <option key={item.path} value={index}>{item.path}</option>)}</select><div className="mt-3 max-h-[640px] overflow-auto">{file?.content && <CodeBlock code={file.content} language={file.path.endsWith("css") ? "css" : "tsx"} name="Copiar fonte do componente" />}</div><p className="mt-3 text-small text-muted-foreground">Pacotes: {source.dependencies?.join(", ") || "sem dependências npm adicionais declaradas"}</p></>}
    </section>
  </div>;
}
