import { mentions, type Mention } from "./mentions";

export function excerptsCiting(slugs: string[], limit = 3): Mention[] {
  const seen = new Set<string>();
  const dedicated = (m: Mention) => (slugs.some((slug) => m.title.includes(slug)) ? 1 : 0);
  return slugs
    .flatMap((slug) => mentions[slug] ?? [])
    .sort((a, b) => dedicated(b) - dedicated(a) || b.count - a.count)
    .filter((m) => {
      const key = `${m.guide}/${m.chapter ?? ""}#${m.anchor ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}
