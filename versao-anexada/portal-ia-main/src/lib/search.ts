import { fold } from "@/lib/text";

type Field = { text: string; weight: number };

export type SearchDocument<T> = { id: string; fields: Field[]; item: T };

export type SearchResult<T> = { id: string; score: number; item: T };

const STOPWORDS = new Set(
  (
    "a o as os um uma uns umas de do da dos das e em no na nos nas para pra pro por com sem que se " +
    "eu me meu minha meus minhas seu sua voce isso isto esse essa este esta aqui ai ao aos como " +
    "quero queria preciso precisa precisamos fazer faco faz tem ter ser ou mais muito partir sobre"
  ).split(" "),
);

const SUFFIXES = ["amentos", "imentos", "amento", "imento", "acoes", "acao", "ando", "endo", "indo", "ados", "adas", "idos", "idas", "ado", "ada", "ido", "ida", "ar", "er", "ir", "ao", "a", "e", "o"];

export function radical(word: string): string {
  let p = word;
  if (p.length > 4) {
    if (p.endsWith("oes") || p.endsWith("aes")) p = `${p.slice(0, -3)}ao`;
    else if (p.endsWith("ais")) p = `${p.slice(0, -3)}al`;
    else if (p.endsWith("s") && !p.endsWith("ss")) p = p.slice(0, -1);
  }
  for (const suffix of SUFFIXES) {
    if (p.endsWith(suffix) && p.length - suffix.length >= 4) return p.slice(0, -suffix.length);
  }
  return p;
}

export function terms(text: string): string[] {
  return fold(text)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(radical);
}

const SYNONYMS: Record<string, string[]> = {
  pr: ["pull", "request", "merg"],
  pull: ["pr"],
  revis: ["review", "revisor", "audit"],
  review: ["revis"],
  audit: ["revis"],
  test: ["qa", "automac", "bdd"],
  automac: ["test", "automat"],
  automat: ["automac", "test"],
  document: ["doc", "docs"],
  doc: ["document"],
  banc: ["database", "persistenc", "dad", "tabel"],
  dad: ["banc", "massa"],
  histori: ["story", "us", "backlog"],
  story: ["histori"],
  spec: ["especific", "feature"],
  especific: ["spec", "requisit"],
  requisit: ["especific", "histori", "spec"],
  massa: ["seed", "dad"],
  slid: ["apresent", "pptx"],
  apresent: ["slid", "pptx", "deck"],
  deck: ["apresent"],
  commit: ["convencional", "conventional", "git"],
  git: ["commit"],
  azur: ["devops"],
  devop: ["azur"],
  pbi: ["work", "item", "sprint"],
  sprint: ["pbi"],
  text: ["prosa", "escrit", "redac"],
  prosa: ["text"],
  seguranc: ["vulnerab", "security"],
  vulnerab: ["seguranc"],
  arquitetur: ["architectur", "c4", "camad"],
  c4: ["arquitetur", "diagram"],
  diagram: ["c4", "mapa"],
  api: ["endpoint", "rest"],
  endpoint: ["api"],
  gherkin: ["bdd", "cenari"],
  bdd: ["gherkin"],
  codig: ["code"],
  skill: ["habilidad"],
  best: ["revis", "audit", "ajust", "corrig"],
  mail: ["text", "mensag"],
};

type Token = { term: string; weight: number; field: number };

type IndexedDocument<T> = SearchDocument<T> & { tokens: Token[] };

export type SearchIndex<T> = { docs: IndexedDocument<T>[]; df: Map<string, number> };

export function buildIndex<T>(documents: SearchDocument<T>[]): SearchIndex<T> {
  const df = new Map<string, number>();
  const docs = documents.map((d) => {
    const tokens = d.fields.flatMap((c, field) => terms(c.text).map((term) => ({ term, weight: c.weight, field })));
    for (const term of new Set(tokens.map((t) => t.term))) df.set(term, (df.get(term) ?? 0) + 1);
    return { ...d, tokens };
  });
  return { docs, df };
}

function value(tokens: Token[], term: string): number {
  const variants = SYNONYMS[term] ?? [];
  const byField = new Map<number, number>();
  for (const t of tokens) {
    let v = 0;
    if (t.term === term) v = 1;
    else if (term.length >= 3 && t.term.startsWith(term)) v = 0.8;
    else if (variants.some((s) => t.term === s || (s.length >= 3 && t.term.startsWith(s)))) v = 0.7;
    if (v * t.weight > (byField.get(t.field) ?? 0)) byField.set(t.field, v * t.weight);
  }
  const [best = 0, ...others] = [...byField.values()].sort((a, b) => b - a);
  return best + 0.25 * others.reduce((total, v) => total + v, 0);
}

const RELATIVE_CUTOFF = 0.3;

export function search<T>(index: SearchIndex<T>, query: string, filter?: (item: T) => boolean): SearchResult<T>[] {
  const requested = [...new Set(terms(query))];
  if (!requested.length) return [];
  const total = index.docs.length || 1;
  const minimum = requested.length >= 3 ? Math.ceil(requested.length / 2) : 1;
  const results: SearchResult<T>[] = [];
  for (const doc of index.docs) {
    if (filter && !filter(doc.item)) continue;
    let score = 0;
    let matched = 0;
    for (const term of requested) {
      const v = value(doc.tokens, term);
      if (!v) continue;
      matched += 1;
      const idf = Math.log(1 + total / (index.df.get(term) ?? 1));
      score += v * idf;
    }
    if (matched < minimum) continue;
    results.push({ id: doc.id, score: score * (0.5 + (0.5 * matched) / requested.length), item: doc.item });
  }
  results.sort((a, b) => b.score - a.score);
  const best = results[0]?.score ?? 0;
  return results.filter((r) => r.score >= best * RELATIVE_CUTOFF);
}
