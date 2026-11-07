import type { Guide, GuideGroupId } from "@/data/guides";

export const STAGE: Partial<Record<GuideGroupId, string>> = {
  intro: "Por que adotar o desenvolvimento guiado por especificação, e o mapa da esteira agêntica, das atas ao pacote pronto para o deploy.",
  requirements: "O que o ciclo consome, na ordem do trabalho: os insumos de cada demanda, as histórias e a especificação.",
  method: "O resumo do ciclo, do PBI ao código revisado, e um passo a passo por ferramenta. Leia o resumo e o passo a passo da ferramenta do seu projeto.",
  "case-study": "Uma feature que passou pelo método de ponta a ponta.",
};

export function guideFooter(guide: Guide, readChapters: number, isRead: boolean): string {
  return [
    guide.minutes ? `~${guide.minutes} min` : null,
    guide.chapters ? "em capítulos" : null,
    readChapters
      ? `${readChapters} ${readChapters === 1 ? "capítulo lido" : "capítulos lidos"}`
      : !guide.chapters && isRead
        ? "lido"
        : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
