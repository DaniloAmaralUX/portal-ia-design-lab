import type { AreaId } from "./types";
import { ROLES } from "./roles";
import { ROADMAPS } from "./roadmaps";

type StaticPage = {
  to:
    | "/"
    | "/manifesto"
    | "/academy"
    | "/metodo"
    | "/ferramentas"
    | "/explorar"
    | "/plugins"
    | "/primeiros-passos"
    | "/contribuir"
    | "/novidades"
    | "/academy/glossario"
    | "/academy/em-portugues"
    | "/academy/intervalos"
    | "/academy/treinamentos";
  params?: never;
};
type AreaPage = { to: "/academy/trilhas/$area" | "/metodo/roteiros/$area"; params: { area: AreaId } };
export type Page = (StaticPage | AreaPage) & { title: string; description: string; keywords: string; searchOnly?: true };

export const PAGES: Page[] = [
  { to: "/", title: "Início", description: "A busca, as portas do site e a instalação em três passos", keywords: "inicio home portal ia" },
  {
    to: "/manifesto",
    title: "Manifesto",
    description: "Por que a Pitang adota IA agora, e como pedir ajuda ao Pitang Labs",
    keywords: "manifesto pe de ia pitangueira por que agora adocao suporte contato labs",
  },
  {
    to: "/academy",
    title: "Academy",
    description: "As trilhas de capacitação em IA, uma por papel",
    keywords:
      "academy aprender capacitacao cursos curso treinamento trilha trilhas recapacitacao iniciante novo po dev qa tech lead anthropic openai microsoft learn",
  },
  {
    to: "/metodo",
    title: "Método",
    description: "Os guias de como a Pitang trabalha com IA",
    keywords: "metodo guias sdd compozy openspec open-spec speckit spec-kit requisitos especificacao historias estudo caso esteira roteiro roteiros area portal",
  },
  {
    to: "/ferramentas",
    title: "Ferramentas Pita.IA",
    description: "As ferramentas da Pitang para o trabalho com agentes de IA, como o Catalyst Toolkit",
    keywords: "ferramentas pita.ia catalyst toolkit cli doctor init instalar instalacao npm agentes",
  },
  { to: "/explorar", title: "Catálogo de skills", description: "Todas as skills, com busca e filtros", keywords: "explorar catalogo skills buscar" },
  { to: "/plugins", title: "Plugins", description: "Os plugins e as skills de cada um", keywords: "plugins pacotes kit time" },
  {
    to: "/primeiros-passos",
    title: "Primeiros passos",
    description: "Instalar, atualizar e desinstalar os plugins",
    keywords: "comecar como instalar credencial gitlab atualizar desinstalar tutorial configurar",
  },
  { to: "/contribuir", title: "Contribuir", description: "Criar uma skill ou pedir uma nova", keywords: "contribuir criar skill pedir sugerir curadoria" },
  { to: "/novidades", title: "Novidades", description: "O que mudou em cada versão do catálogo", keywords: "novidades changelog versao mudancas" },
  { to: "/academy/glossario", title: "Glossário", description: "Os termos e as siglas do site", keywords: "glossario termos siglas significado" },
  {
    to: "/academy/intervalos",
    title: "Intervalos técnicos",
    description: "As gravações dos intervalos técnicos, com o vídeo e o texto de cada um",
    keywords: "intervalos intervalo tecnico tecnicos video videos gravacao gravacoes teams palestra apresentacao",
  },
  {
    to: "/academy/treinamentos",
    title: "Treinamentos",
    description: "As gravações dos treinamentos, com o vídeo e o texto de cada aula",
    keywords: "treinamentos treinamento curso cursos aula aulas video videos gravacao gravacoes cowork",
  },
  ...ROLES.map((p): Page => ({
    to: "/academy/trilhas/$area",
    params: { area: p.area },
    title: `Trilha de capacitação: ${p.name}`,
    description: p.description,
    keywords: `trilha capacitacao cursos papel ${p.keywords}`,
    searchOnly: true,
  })),
  ...ROADMAPS.map((t): Page => ({
    to: "/metodo/roteiros/$area",
    params: { area: t.area },
    title: t.title,
    description: t.summary,
    keywords: `roteiro area guias skills ordem ${t.area}`,
    searchOnly: true,
  })),
  {
    to: "/academy/em-portugues",
    title: "Estudar em português",
    description: "Legenda nos vídeos e tradução da página, no Chrome e no Edge",
    keywords: "portugues legenda legendas traduzir traducao idioma ingles youtube chrome edge",
    searchOnly: true,
  },
];
