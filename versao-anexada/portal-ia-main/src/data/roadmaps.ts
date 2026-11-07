import type { AreaId } from "./types";

export type RoadmapStep =
  | { kind: "getting-started"; reason: string }
  | { kind: "guide"; guide: string; reason: string }
  | { kind: "chapter"; guide: string; chapter: string; reason: string }
  | { kind: "plugin"; plugin: string; reason: string }
  | { kind: "training"; course: string; reason: string };

type Roadmap = { area: AreaId; title: string; summary: string; steps: RoadmapStep[] };

const gettingStarted: RoadmapStep = { kind: "getting-started", reason: "Instale o Claude Code e o marketplace, e faça o primeiro pedido." };
const manifesto: RoadmapStep = { kind: "guide", guide: "manifesto", reason: "Por que a Pitang adota IA agora, e como pedir ajuda ao Pitang Labs." };

export const ROADMAPS: Roadmap[] = [
  {
    area: "produto",
    title: "Roteiro de Produto",
    summary: "Da demanda bruta à especificação aprovada no portão, com as histórias no caminho.",
    steps: [
      gettingStarted,
      manifesto,
      { kind: "guide", guide: "artefatos-de-entrada", reason: "O que coletar de cada demanda antes de pedir histórias ao Claude." },
      { kind: "guide", guide: "historias-de-usuario", reason: "Como escrever histórias que entram no refinamento sem ninguém precisar supor." },
      { kind: "plugin", plugin: "requirements", reason: "As skills que escrevem, refinam e especificam, da história ao feature.md." },
      { kind: "guide", guide: "especificacao", reason: "A especificação que passa pelo portão e é a entrada do SDD." },
      { kind: "plugin", plugin: "communication", reason: "Texto com menos cara de máquina e apresentações no molde da Pitang." },
    ],
  },
  {
    area: "qualidade",
    title: "Roteiro de Qualidade",
    summary: "Do portão da especificação à suíte de testes estável.",
    steps: [
      gettingStarted,
      manifesto,
      {
        kind: "chapter",
        guide: "especificacao",
        chapter: "fluxo-de-escrita-portao-e-rubrica-de-prontidao",
        reason: "O portão em que QA revisa se a especificação é testável.",
      },
      { kind: "plugin", plugin: "automation-bdd", reason: "Do Gherkin à suíte verde, uma skill por etapa." },
      { kind: "chapter", guide: "compozy", chapter: "pipeline", reason: "O pipeline do Compozy, onde a cadeia da automação roda." },
      { kind: "guide", guide: "estudo-de-caso", reason: "Uma feature que foi do PBI ao código revisado pelo SDD, em 24 horas de desenvolvimento." },
    ],
  },
  {
    area: "engenharia",
    title: "Roteiro de Engenharia",
    summary: "O ciclo do PBI ao código revisado, e as skills que revisam e documentam.",
    steps: [
      gettingStarted,
      manifesto,
      { kind: "guide", guide: "sdd", reason: "O ciclo de desenvolvimento guiado por especificação, com o Compozy, o OpenSpec ou o Spec Kit." },
      { kind: "plugin", plugin: "azure-helpers", reason: "O work item e a sprint do Azure DevOps em Markdown, prontos para o fluxo." },
      { kind: "plugin", plugin: "pr-review", reason: "Seis revisões de PR, uma por ângulo." },
      { kind: "plugin", plugin: "technical-documentation", reason: "A documentação que o código já sabe, escrita em docs/." },
      { kind: "plugin", plugin: "engineering-practices", reason: "Commits no padrão do time, e a skill que cria skills." },
      { kind: "guide", guide: "esteira", reason: "O diagrama da esteira agêntica, das atas e e-mails ao Deploy-Ready Package." },
    ],
  },
  {
    area: "meio",
    title: "Roteiro de Meio",
    summary: "O Cowork nas rotinas do Suporte, do Financeiro, do RH e do Administrativo, em três aulas, e as apresentações no molde da Pitang.",
    steps: [
      manifesto,
      { kind: "training", course: "claude-cowork", reason: "As três aulas de Claude Cowork gravadas para as áreas de meio, para assistir na ordem." },
      { kind: "getting-started", reason: "Instale o Claude Code e o marketplace, que o plugin do próximo passo pede." },
      { kind: "plugin", plugin: "communication", reason: "Apresentações .pptx no molde da Pitang e texto com menos cara de máquina." },
    ],
  },
];

export function roadmapFor(area: string): Roadmap | undefined {
  return ROADMAPS.find((t) => t.area === area);
}
