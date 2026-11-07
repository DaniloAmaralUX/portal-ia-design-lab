// The first line of manifesto.md is a row of links to two of its sections. The page has the "Nesta página" index for that, so the
// page leaves the row out. The Markdown of the page keeps it, as the file has it.
const LEAD_LINKS = /^\[Por onde começar\]\(#comecar\)[^\n]*\n+/;

export function withoutLeadLinks(source: string): string {
  return source.replace(LEAD_LINKS, "");
}
