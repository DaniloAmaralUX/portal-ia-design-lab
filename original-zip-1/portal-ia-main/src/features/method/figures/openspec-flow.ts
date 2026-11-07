import { dim, ok, prompt, strong, type Screen } from "./terminal-screen";

// Who does the work of a step: the strongest model plans, a faster one runs the plan, and the person decides at the gates.
export type Actor = "strong" | "fast" | "you";

export const ACTORS: Record<Actor, string> = {
  strong: "Modelo mais forte",
  fast: "Modelo rápido",
  you: "Você",
};

// One line of the folder tree beside the terminal. A hot line is a file or folder that the step writes or edits.
export type TreeLine = { depth: number; name: string; hot?: boolean };

export type FlowStep = {
  // What the box of the step says in the diagram.
  node: string;
  // The command the step runs, shown on the card.
  command: string;
  actor: Actor;
  // A human gate: the flow stops until the person approves.
  gate?: boolean;
  title: string;
  text: string;
  note?: string;
  screen: Screen;
  tree: TreeLine[];
};

const ROOT = "Grupo.NomeProjeto.Sdd/";
const CHANGE = "exportar-relatorio-csv";

const feature: TreeLine[] = [
  { depth: 0, name: ROOT },
  { depth: 1, name: "Feature/" },
  { depth: 2, name: "plano-de-execucao.pdf" },
  { depth: 2, name: "transcricoes/" },
];

const change = (hot: string[]): TreeLine[] => [
  { depth: 0, name: ROOT },
  { depth: 1, name: "openspec/" },
  { depth: 2, name: "changes/" },
  { depth: 3, name: `${CHANGE}/`, hot: hot.includes("folder") },
  { depth: 4, name: "proposal.md", hot: hot.includes("proposal") },
  { depth: 4, name: "design.md", hot: hot.includes("design") },
  { depth: 4, name: "tasks.md", hot: hot.includes("tasks") },
  { depth: 4, name: "specs/exportacao-relatorios/spec.md", hot: hot.includes("spec") },
];

export const FLOW_STEPS: FlowStep[] = [
  {
    node: "prompt-mestre",
    command: "claude",
    actor: "you",
    title: "insumos → prompt-mestre",
    text: "Reuniões, requisitos e contratos vão para Feature/. O prompt-mestre reúne as decisões fechadas e a sequência de changes.",
    screen: {
      title: "claude · Grupo.NomeProjeto.Sdd",
      lines: [
        [prompt("❯"), " ", strong("claude")],
        [prompt(">"), " Leia tudo em @Feature/ e escreva Feature/prompt-sdd.md"],
        ["  ", ok("●"), " Write(Feature/prompt-sdd.md)"],
        ["    ", dim("└ o que não está nos documentos vira Pendência")],
      ],
    },
    tree: [...feature, { depth: 2, name: "prompt-sdd.md", hot: true }],
  },
  {
    node: "/opsx:explore",
    command: "/opsx:explore",
    actor: "strong",
    title: "prompt-mestre → decisões",
    text: "Conversa livre para tirar as dúvidas de regra de negócio. O agente lê documentos e código, pergunta e não grava código.",
    note: "Nenhum arquivo muda: as decisões existem só na conversa.",
    screen: {
      title: "claude · modelo mais forte",
      lines: [
        [prompt(">"), " ", strong("/opsx:explore @Feature/prompt-sdd.md")],
        ["  ", ok("●"), " Li o prompt e os anexos. Três pontos mudam o escopo:"],
        ["    1. o arquivo respeita os filtros da tela?"],
        ["    2. existe limite de linhas?"],
        ["    3. todos os perfis podem exportar?"],
      ],
    },
    tree: [...feature, { depth: 2, name: "prompt-sdd.md" }],
  },
  {
    node: "/opsx:propose",
    command: `/opsx:propose ${CHANGE}`,
    actor: "strong",
    title: "decisões → plano da change",
    text: "Gera, em ordem de dependência, a proposta, o delta do spec, o design e as tasks. Só planeja: o agente para quando o plano está pronto.",
    screen: {
      title: "claude · modelo mais forte",
      lines: [
        [prompt(">"), " ", strong(`/opsx:propose ${CHANGE}`)],
        ["  ", ok("●"), " Write(proposal.md)"],
        ["  ", ok("●"), " Write(specs/exportacao-relatorios/spec.md)"],
        ["  ", ok("●"), " Write(design.md)"],
        ["  ", ok("●"), " Write(tasks.md)"],
        ["    ", dim("└ plano pronto, sem código")],
      ],
    },
    tree: change(["folder", "proposal", "design", "tasks", "spec"]),
  },
  {
    node: "o plano está certo?",
    command: `/opsx:update ${CHANGE}`,
    actor: "you",
    gate: true,
    title: "plano → plano aprovado",
    text: "O gate principal. Você lê os artefatos no disco e edita o que quiser. Quando decide algo novo, o update reconcilia os arquivos entre si e nunca mexe em código.",
    screen: {
      title: "claude · você revisa",
      lines: [
        [prompt(">"), " ", strong(`/opsx:update ${CHANGE}`)],
        ["  ", ok("●"), " spec.md e tasks.md reconciliados com a decisão"],
        [prompt("❯"), " ", strong(`openspec validate ${CHANGE} --strict`)],
        ["  ", ok("✓"), " ", dim("formato válido")],
      ],
    },
    tree: change(["spec", "tasks"]),
  },
  {
    node: "/opsx:apply",
    command: `/opsx:apply ${CHANGE}`,
    actor: "fast",
    title: "plano aprovado → código",
    text: "Executa o tasks.md task a task e marca [x] na hora, com a evidência de um comando que rodou e passou. Pausa diante de dúvida ou de trabalho que o plano não prevê.",
    screen: {
      title: "ops-executor · modelo rápido",
      lines: [
        [prompt(">"), " ", strong(`/opsx:apply ${CHANGE}`)],
        ["  ", ok("●"), " [x] 1.1 endpoint de exportação"],
        ["    ", dim("└ npm test -- exportacao: 9/9")],
        ["  ", ok("●"), " [ ] 2.1 botão Exportar CSV"],
      ],
    },
    tree: [
      { depth: 0, name: "Grupo.NomeProjeto/" },
      { depth: 1, name: "Grupo.NomeProjeto.Api/", hot: true },
      { depth: 1, name: "Grupo.NomeProjeto.View/", hot: true },
      { depth: 1, name: "Grupo.NomeProjeto.Sdd/openspec/…/tasks.md", hot: true },
    ],
  },
  {
    node: "/opsx:verify",
    command: "/code-review",
    actor: "fast",
    title: "código → achados",
    text: "Revisa as pastas que a change tocou e confere a implementação contra os specs. Os achados vão para a seção Revisão do tasks.md, e cada um é corrigido com evidência.",
    screen: {
      title: "ops-executor · modelo rápido",
      lines: [
        [prompt(">"), " ", strong("/code-review")],
        [prompt(">"), " ", strong("/opsx:verify")],
        [prompt("❯"), " ", strong(`openspec validate ${CHANGE} --strict`)],
        ["  ", ok("●"), " achados registrados em ## Revisão"],
      ],
    },
    tree: change(["tasks"]),
  },
  {
    node: "/opsx:archive",
    command: `/opsx:archive ${CHANGE}`,
    actor: "you",
    gate: true,
    title: "change pronta → histórico",
    text: "Confere artefatos e tasks e oferece o sync dos specs: é aqui que o delta vira spec principal. A pasta da change vai para o histórico.",
    screen: {
      title: "claude · você confirma",
      lines: [
        [prompt(">"), " ", strong(`/opsx:archive ${CHANGE}`)],
        ["  ", ok("●"), " sync dos specs: aceito"],
        ["  ", ok("●"), " changes/archive/2026-10-08-" + CHANGE + "/"],
      ],
    },
    tree: [
      { depth: 0, name: ROOT },
      { depth: 1, name: "openspec/" },
      { depth: 2, name: "specs/exportacao-relatorios/spec.md", hot: true },
      { depth: 2, name: "changes/archive/" },
      { depth: 3, name: `2026-10-08-${CHANGE}/`, hot: true },
    ],
  },
];
