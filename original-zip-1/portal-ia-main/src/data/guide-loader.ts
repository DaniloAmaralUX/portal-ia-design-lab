// The text of the guides that are read whole. The guides with chapters are not here: their text goes to the browser one chapter at a time (scripts/guide-index.ts).
const docs = import.meta.glob<string>(["../content/guides/*.md", "!../content/guides/{compozy,open-spec,spec-kit,especificacao,historias-de-usuario,catalyst-toolkit,por-que-utilizar-o-sdd}.md"], { query: "?raw", import: "default" });

export async function loadGuide(slug: string): Promise<string> {
  const load = docs[`../content/guides/${slug}.md`];
  return load ? load() : "";
}
