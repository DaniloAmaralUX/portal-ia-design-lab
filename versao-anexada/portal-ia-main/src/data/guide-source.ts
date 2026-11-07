// The text of every guide, the ones with chapters included. Only the build uses it, to write the Markdown of the pages; the site's own pages never import it.
const docs = import.meta.glob<string>("../content/guides/*.md", { query: "?raw", import: "default" });

export async function loadGuideSource(slug: string): Promise<string> {
  const load = docs[`../content/guides/${slug}.md`];
  return load ? load() : "";
}

export function hasGuideSource(slug: string): boolean {
  return `../content/guides/${slug}.md` in docs;
}
