import { ArticleCards } from "@/design-system/devl/ArticleCards";
import { guides, guidePath } from "@/data/guides";

export function GuideResources() {
  const selected = ["sdd", "artefatos-de-entrada", "historias-de-usuario"];
  const articles = selected.flatMap(slug => {
    const guide = guides.find(item => item.slug === slug);
    return guide ? [{ title: guide.title, excerpt: guide.summary, href: guidePath(guide), tags: [guide.eyebrow], minutes: guide.minutes, date: "", author: { name: "Pitang" } }] : [];
  });
  return <ArticleCards className="mt-14 sm:mt-16" eyebrow="Método da Pitang" title="Guias para aplicar no seu projeto" allHref="/metodo" articles={articles} />;
}
