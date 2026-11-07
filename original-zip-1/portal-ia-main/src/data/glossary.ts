import { slugify } from "@/lib/text";
import { MODES } from "./modes";

export const TERMS = {
  skill: {
    name: "Skill",
    explanation:
      "Instrução que ensina o Claude a fazer uma tarefa do jeito do time. Ele usa sozinho quando o pedido combina, ou você chama pela barra.",
  },
  plugin: {
    name: "Plugin",
    explanation:
      "Pacote de skills do mesmo tema. Instalar o plugin traz todas as skills dele de uma vez, e elas se atualizam juntas.",
  },
  marketplace: {
    name: "Marketplace",
    explanation: "Catálogo de onde o Claude Code instala plugins. O da Pitang fica no GitLab, e você adiciona uma vez só.",
  },
  "skill-md": {
    name: "SKILL.md",
    explanation:
      "O arquivo que define a skill. No topo, o nome e a descrição dizem ao Claude quando usá-la; embaixo vem o passo a passo.",
  },
  "dispara-sozinha": {
    name: MODES.auto.label,
    explanation:
      "O Claude usa esta skill por conta própria quando o seu pedido combina com a descrição dela. Pela barra, você chama direto.",
  },
  "so-manual": {
    name: MODES.manual.label,
    explanation:
      "Esta skill só roda quando alguém chama pela barra. Fica manual o que configura o projeto, importa itens em lote ou é difícil de desfazer.",
  },
  "custo-de-contexto": {
    name: "Custo de contexto",
    explanation:
      "Quanto a skill ocupa da lista de skills que o Claude Code carrega em toda sessão, contado em caracteres do nome mais a description. A skill manual não ocupa a lista. O SKILL.md inteiro só entra quando a skill dispara.",
  },
} as const;

export type TermId = keyof typeof TERMS;

export const ACRONYMS: Record<string, string> = {
  ACP: "Agent Client Protocol. Protocolo com que um programa conversa com um agente de código, como o Claude Code ou o Codex.",
  ADR: "Architecture Decision Record. Registro de uma decisão técnica ou de produto importante, com as alternativas consideradas e as consequências.",
  ADRs: "Architecture Decision Records. Registros de decisões técnicas ou de produto importantes, com as alternativas consideradas e as consequências.",
  API: "Application Programming Interface. Conjunto de chamadas que um sistema oferece para outros sistemas usarem.",
  AWS: "Amazon Web Services. Provedor de nuvem da Amazon.",
  CLI: "Command-Line Interface. Interface de linha de comando, onde você digita os comandos do Compozy.",
  Compozy: "Produto (CLI, daemon e skills de IA) que conduz o pipeline SDD. Ele transforma o PBI em PRD, TechSpec, tasks e código revisado, fase a fase, com gates humanos.",
  CSS: "Cascading Style Sheets. Linguagem que define a aparência das páginas HTML.",
  DORA: "DevOps Research and Assessment. Grupo de pesquisa cujas quatro métricas medem o processo de entrega de software: lead time, frequência de entrega, taxa de falha e tempo de recuperação.",
  DTOs: "Data Transfer Objects. Objetos que levam dados de uma camada a outra, sem lógica de negócio.",
  "EF Core": "Entity Framework Core. ORM da Microsoft para .NET, que mapeia classes C# para tabelas do banco de dados.",
  FAQ: "Frequently Asked Questions. Perguntas frequentes.",
  glob: "Padrão que casa nomes de arquivo usando curingas, como * (qualquer trecho) e ** (qualquer subpasta). Por exemplo, src/pages/** casa qualquer arquivo dentro de src/pages.",
  globs: "Padrão que casa nomes de arquivo usando curingas, como * (qualquer trecho) e ** (qualquer subpasta). Por exemplo, src/pages/** casa qualquer arquivo dentro de src/pages.",
  IA: "Inteligência Artificial.",
  IDE: "Integrated Development Environment. Ambiente de desenvolvimento que junta o editor e as ferramentas num programa só.",
  LoC: "Lines of Code. Métrica que conta as linhas de código, muitas vezes usada (mal) como medida indireta de produtividade.",
  LTS: "Long-Term Support. Versão com suporte estendido, a recomendada para produção.",
  PATH: "Variável de ambiente que lista os diretórios onde o sistema procura os executáveis chamados no terminal.",
  PBI: "Product Backlog Item. Item do backlog de produto com a necessidade de negócio que inicia o processo, descrita em Features/PBI<id>/feature.md.",
  PO: "Product Owner. É o responsável pelo produto e define a intenção de negócio. O dev chama o PO quando o escopo ou o critério de aceite deixam dúvida.",
  PRD: "Product Requirements Document. Documento de requisitos de produto, com o problema, os objetivos, as histórias de usuário e os critérios de aceite.",
  PRDs: "Product Requirements Documents. Documentos de requisitos de produto, com o problema, os objetivos, as histórias de usuário e os critérios de aceite.",
  PRs: "Pull Requests. Propostas de mudança no código, que passam por revisão antes de entrar no branch principal.",
  REST: "Representational State Transfer. Estilo de arquitetura de API sobre HTTP.",
  SDD: "Spec-Driven Development. Desenvolvimento guiado por especificação, em que a spec aprovada é a fonte da verdade e o review compara o código que a IA gera com o que a spec exige.",
  SPA: "Single-Page Application. Aplicação web de página única, que carrega uma vez e troca o conteúdo por JavaScript, sem recarregar a página.",
  SQL: "Structured Query Language. Linguagem para consultar e alterar dados em bancos de dados relacionais.",
  SSE: "Server-Sent Events. Canal HTTP de mão única em que o servidor envia eventos ao navegador em tempo real, sem o navegador precisar perguntar de novo.",
  TechSpec: "Technical Specification. Especificação técnica, com a abordagem de implementação, as decisões de arquitetura (ADRs) e os contratos que guiam a divisão em tasks.",
  TechSpecs: "Technical Specifications. Especificações técnicas, com a abordagem de implementação, as decisões de arquitetura (ADRs) e os contratos que guiam a divisão em tasks.",
  UI: "User Interface. Interface visual que a pessoa usuária vê e usa.",
};

type GlossaryEntry = { name: string; explanation: string; anchor: string };

export const GLOSSARY: GlossaryEntry[] = [
  ...Object.values(TERMS).map((t) => ({ name: t.name, explanation: t.explanation })),
  ...Object.entries(ACRONYMS)
    .filter(([name]) => !(name.endsWith("s") && name.slice(0, -1) in ACRONYMS))
    .map(([name, explanation]) => ({ name, explanation })),
]
  .map((e) => ({ ...e, anchor: slugify(e.name) }))
  .sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }));
