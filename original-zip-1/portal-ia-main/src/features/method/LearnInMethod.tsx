import { AcademyCard } from "./AcademyCard";
import { excerptsCiting } from "./excerpts-citing";

export function LearnInMethod({ slugs, className }: { slugs: string[]; className?: string }) {
  return <AcademyCard id="aprenda-no-metodo" title="Aprenda no Método" excerpts={excerptsCiting(slugs)} className={className} />;
}
