export type GuideGroupId = 'start-here' | 'intro' | 'method' | 'requirements' | 'case-study' | 'tools';

export type Section = 'manifesto' | 'method' | 'tools';

// Where the pages of each section start: the manifesto has a page of its own, the guides of the Method are under it, and the tools
// of the house have a section of their own, Ferramentas, in the menu at the top.
export const SECTION_PATH: Record<Section, string> = { manifesto: '', method: '/metodo', tools: '/ferramentas' };

export const GUIDE_GROUPS: { id: GuideGroupId; name: string; section: Section }[] = [
  { id: 'start-here', name: 'Antes de começar', section: 'manifesto' },
  { id: 'intro', name: 'Comece aqui', section: 'method' },
  { id: 'requirements', name: 'Requisitos', section: 'method' },
  { id: 'method', name: 'Ciclo SDD', section: 'method' },
  { id: 'case-study', name: 'Prova real', section: 'method' },
  { id: 'tools', name: 'Ferramentas', section: 'tools' },
];

export type Guide = {
  slug: string;
  group: GuideGroupId;
  label: string;
  title: string;
  eyebrow: string;
  summary: string;
  minutes?: number;
  facts: { label: string; value: string }[];
  // The line at the end of the guide, as when it was updated; a tool says it in its own releases, and has none.
  footer?: string;
  next?: { eyebrow: string; title: string; text: string; slug: string };
  chapters?: boolean;
  // The step by step of the SDD cycle in one tool: the person reads the one of the project, not all of them.
  tool?: true;
};

export const guides: Guide[] = [
  {
    slug: 'manifesto',
    group: 'start-here',
    label: 'Manifesto',
    title: 'O Pé de IA é uma Pitangueira',
    eyebrow: 'Manifesto · O Pé de IA',
    summary: 'Aqui a IA não domina gente. Aqui a gente doma a IA.',
    facts: [],
    footer: 'Atualizado em setembro de 2026',
  },
  {
    slug: 'por-que-utilizar-o-sdd',
    chapters: true,
    group: 'intro',
    label: 'Por que utilizar o SDD?',
    title: 'Por que utilizar o SDD?',
    eyebrow: 'Spec-Driven Development',
    summary:
      'O SDD (Spec-Driven Development) é uma abordagem que ajuda a garantir que o código desenvolvido atenda às especificações e requisitos definidos, reduzindo erros e aumentando a qualidade do software.',
    minutes: 7,
    facts: [{ label: 'Público', value: 'gestão e quem decide adotar o SDD' }],
    footer: 'Atualizado em outubro de 2026',
  },
  {
    slug: 'esteira',
    group: 'intro',
    label: 'Esteira agêntica',
    title: 'Esteira agêntica: fluxo geral simplificado',
    eyebrow: 'Inteligência agêntica aplicada ao desenvolvimento',
    summary:
      'O diagrama da esteira agêntica, das atas de reunião, e-mails e conversas até o Deploy-Ready Package, com a aprovação humana em cada etapa.',
    minutes: 3,
    facts: [{ label: 'Gerado em', value: '24/07/2026' }],
    footer: 'Atualizado em setembro de 2026',
  },
  {
    slug: 'artefatos-de-entrada',
    group: 'requirements',
    label: 'Artefatos de entrada',
    title: 'Artefatos de entrada para gerar histórias de usuário',
    eyebrow: 'Guia de artefatos de entrada',
    summary:
      'O que entregar a um assistente de IA configurado como Product Owner especialista quando você pede histórias de usuário.',
    minutes: 8,
    facts: [
      { label: 'Público', value: 'PO/PM e quem coleta a demanda (autores da entrada), analistas de negócio, UX' },
      { label: 'Leitura', value: '~8 min' },
      {
        label: 'Foco',
        value: 'a matéria-prima de cada demanda: o que coletar, como preparar e em que formato entregar',
      },
    ],
    footer: 'Atualizado em setembro de 2026',
    next: {
      eyebrow: 'Depois da coleta',
      title: 'Histórias de usuário para backlog',
      text: 'Este guia trata do que entra. O guia ao lado trata do que sai: a história em si, com "EU QUERO", regras de negócio, mensagens e critérios em Dado/Quando/Então.',
      slug: 'historias-de-usuario',
    },
  },
  {
    slug: 'historias-de-usuario',
    chapters: true,
    group: 'requirements',
    label: 'Histórias de usuário',
    title: 'Histórias de usuário para backlog',
    eyebrow: 'Guia de histórias de usuário',
    summary:
      'Como escrever, com as skills pg-us-create e pg-us-review, histórias de usuário completas o bastante para entrar no refinamento e alimentar o fluxo SDD sem que ninguém precise supor.',
    minutes: 33,
    facts: [
      { label: 'Versão', value: '1.2, de setembro de 2026' },
      { label: 'Público', value: 'PO/PM (autor e revisor), QA, UX/UI, desenvolvimento e o fluxo SDD (consumidores)' },
    ],
    footer: 'Atualizado em setembro de 2026',
    next: {
      eyebrow: 'Antes de escrever',
      title: 'Artefatos de entrada para gerar histórias',
      text: 'O que coletar de cada demanda e em que formato entregar ao agente: recorte, não resumo. As histórias deste guia saem dessa entrada.',
      slug: 'artefatos-de-entrada',
    },
  },
  {
    slug: 'especificacao',
    chapters: true,
    group: 'requirements',
    label: 'Especificação de requisitos',
    title: 'Especificação de requisitos para SDD',
    eyebrow: 'Guia de especificação de requisitos',
    summary:
      'Como escrever a especificação de negócio de uma feature com detalhe suficiente para o desenvolvimento guiado por especificação partir dela sem adivinhar.',
    minutes: 58,
    facts: [
      { label: 'Versão', value: '3.1, de setembro de 2026' },
      { label: 'Público', value: 'PO/PM (autor), QA (revisor de testabilidade), líder técnico/arquiteto (revisor)' },
    ],
    footer: 'Atualizado em setembro de 2026',
    next: {
      eyebrow: 'Processo vizinho',
      title: 'Histórias de usuário para backlog',
      text: 'Pediram história de usuário, "EU QUERO" e critérios em Dado/Quando/Então? Isso é um user_story.md, que passa pela revisão do próprio PO, sem a rubrica de QA e líder técnico. As regras estão no guia ao lado.',
      slug: 'historias-de-usuario',
    },
  },
  {
    slug: 'sdd',
    group: 'method',
    label: 'Guia SDD',
    title: 'SDD na prática: do PBI ao código revisado',
    eyebrow: 'Spec-Driven Development',
    summary:
      'O ciclo de desenvolvimento com Spec-Driven Development, do primeiro PBI ao código revisado, em diferentes ferramentas. Esta página resume o ciclo, e cada ferramenta tem o seu passo a passo.',
    minutes: 2,
    facts: [],
    footer: 'Atualizado em outubro de 2026',
  },
  {
    slug: 'compozy',
    tool: true,
    chapters: true,
    group: 'method',
    label: 'SDD com Compozy',
    title: 'SDD na prática: do PBI ao código com Compozy',
    eyebrow: 'Spec-Driven Development com Compozy',
    summary:
      'O ciclo de desenvolvimento com Spec-Driven Development, do primeiro PBI ao código revisado: a especificação como fonte da verdade, o pipeline de artefatos do Compozy fase a fase e o que o workspace precisa ter configurado para rodar o processo.',
    minutes: 60,
    facts: [],
    footer:
      'Material de referência · exemplos anonimizados (Empresa Pitang) · Versão original de 14/07/2026, por Danilo Queiroga · Atualizado em setembro de 2026',
  },
  {
    slug: 'open-spec',
    tool: true,
    chapters: true,
    group: 'method',
    label: 'SDD com OpenSpec',
    title: 'Spec-Driven Development com OpenSpec',
    eyebrow: 'Spec-Driven Development com OpenSpec',
    summary:
      'A especificação passa a ser o artefato principal do projeto: o agente de IA lê, planeja e implementa a partir dela, e você revisa em pontos definidos. Do zero ao primeiro ciclo completo, com os comandos reais e exemplos de um projeto em andamento.',
    minutes: 30,
    facts: [
      { label: 'Ferramenta', value: 'openspec 1.14.1' },
      { label: 'Assistente de IA', value: 'Claude Code' },
      { label: 'Pré-requisito', value: 'Node.js 20.19 ou mais novo' },
      { label: 'Exemplo', value: 'Grupo.NomeProjeto, um projeto fictício' },
    ],
    footer:
      'Os exemplos de proposal, spec, design e tasks usam uma change fictícia, sem dados de cliente · Atualizado em outubro de 2026',
  },
  {
    slug: 'spec-kit',
    tool: true,
    chapters: true,
    group: 'method',
    label: 'SDD com Spec Kit',
    title: 'Spec-Driven Development com Spec Kit',
    eyebrow: 'Spec-Driven Development com Spec Kit',
    summary:
      'A especificação passa a ser o artefato principal da feature: o agente de IA lê, planeja e implementa a partir dela, e você revisa entre um passo e outro. Do zero ao primeiro ciclo completo com o toolkit de SDD do GitHub.',
    minutes: 40,
    facts: [
      { label: 'Ferramenta', value: 'specify-cli 1.2.1' },
      { label: 'Assistente de IA', value: 'Claude Code' },
      { label: 'Pré-requisito', value: 'Python 3.11 ou mais novo e uv' },
      { label: 'Exemplo', value: 'exportar-relatorio-csv, uma feature fictícia' },
    ],
    footer:
      'Passo a passo validado num MVP real, a partir da documentação oficial e do material de estudo do Pitang Labs · Atualizado em outubro de 2026',
  },
  {
    slug: 'estudo-de-caso',
    group: 'case-study',
    label: 'Estudo de caso SAAT/PEAT',
    title: 'Estudo de caso SAAT/PEAT',
    eyebrow: 'Estudo de caso · SAAT/PEAT',
    summary:
      'Como o chat de mensagens de Termos Aditivos, uma feature de três histórias encadeadas, foi do PBI ao código revisado com Spec-Driven Development e Compozy, em 24 horas de desenvolvimento contra as 80 que o dev estimou para fazer à mão. Traz os desafios que viraram rule e o veredito de quem usou.',
    minutes: 8,
    facts: [],
    footer: 'Atualizado em setembro de 2026',
  },
  {
    slug: 'catalyst-toolkit',
    chapters: true,
    group: 'tools',
    label: 'Catalyst Toolkit',
    title: 'Catalyst Toolkit',
    eyebrow: 'Catalyst Toolkit',
    summary:
      'O catalyst lê o seu projeto, diz o que falta escrito para um agente de IA, como o Claude Code, trabalhar nele sem perguntar a ninguém, e escreve com você o que falta.',
    minutes: 18,
    facts: [],
  },
];

const index = new Map(guides.map((g) => [g.slug, g]));

export function getGuide(slug: string): Guide | undefined {
  return index.get(slug);
}

export function guidesIn(group: GuideGroupId): Guide[] {
  return guides.filter((g) => g.group === group);
}

export function sectionOf(guide: Guide): Section {
  return GUIDE_GROUPS.find((g) => g.id === guide.group)?.section ?? 'method';
}

export const METHOD_GROUPS = GUIDE_GROUPS.filter((g) => g.section === 'method');

export const readingOrder: Guide[] = METHOD_GROUPS.flatMap((g) => guidesIn(g.id));

// The tools of the house, in the section Ferramentas. The first page of each is the page of the product, with the install and a card
// per chapter of its guide.
export const toolGuides: Guide[] = guidesIn('tools');

// The address of the first page of a guide, in its section.
export const guidePath = (guide: Guide) => `${SECTION_PATH[sectionOf(guide)]}/${guide.slug}`;

// The guides that left their address before the go-live, and where each chapter went. The old address had already gone around, so
// it lands on the new one instead of on the page that does not exist.
export const MOVED_GUIDES: Record<string, { guide: string; chapters: Record<string, string>; otherwise: string }> = {
  catalyst: { guide: 'catalyst-toolkit', chapters: { doctor: 'doctor', init: 'init', experimente: 'instalar' }, otherwise: 'o-que-faz' },
};

export const DIAGRAM_GUIDES = new Set(['esteira']);

const minutesOf = (list: Guide[]) => list.reduce((total, g) => total + (g.minutes ?? 0), 0);
const toolMinutes = readingOrder.filter((g) => g.tool).map((g) => g.minutes ?? 0);

// The reading time of the Method counts one tool only, since the person reads the step by step of the tool of the project.
export const readingTime = {
  base: minutesOf(readingOrder.filter((g) => !g.tool)),
  tool: { min: Math.min(...toolMinutes), max: Math.max(...toolMinutes) },
};
