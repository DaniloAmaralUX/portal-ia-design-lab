// The page of the Catalyst Toolkit in Ferramentas: the install and what each system needs the first time, as the README of
// pitang-agentic/catalyst-toolkit writes them, and a card for each chapter of its guide. The way here is the item Ferramentas of the
// menu at the top.
export const TOOLKIT = {
  slug: "catalyst-toolkit",
  name: "Catalyst Toolkit",
} as const;

export type System = "macos" | "linux" | "windows";

// The command of the install, the same on every system: on Windows it runs inside the WSL2.
export const COMMAND = "npm i -g @pitang/catalyst-toolkit";

export type SetupStep = { text: string; commands?: string[]; link?: { text: string; href: string } };

// What a computer needs the first time, as the README of pitang-agentic/catalyst-toolkit lists it, in its order: the Node, the Claude
// Code with its login, the sandbox on Linux, the token of reading of the GitLab, the address of the package and the package.
const NODE: SetupStep = { text: "Tenha o Node 22 ou mais novo, instalado na sua conta, como pelo nvm.", link: { text: "Instalar o nvm", href: "https://github.com/nvm-sh/nvm" } };
const CLAUDE: SetupStep = {
  text: "Instale o Claude Code e rode-o uma vez, para entrar na sua conta. O catalyst usa esse login.",
  commands: ["claude"],
  link: { text: "Instalar o Claude Code", href: "https://code.claude.com/docs/en/setup" },
};
const SANDBOX: SetupStep = { text: "Instale o bubblewrap, o sandbox que isola o Claude Code. No Debian e no Ubuntu:", commands: ["sudo apt-get install -y bubblewrap"] };
const TOKEN: SetupStep = {
  text: "Crie no GitLab um token de leitura, do tipo Fine-grained, com o Package em Read, só no projeto catalyst-toolkit.",
  link: { text: "Criar o token", href: "https://gitlab.pitang.com/-/user_settings/personal_access_tokens" },
};
const REGISTRY: SetupStep = {
  text: "Diga ao npm onde mora o pacote e guarde o seu token, trocando o SEU_TOKEN por ele.",
  commands: [
    "npm config set @pitang:registry=https://gitlab.pitang.com/api/v4/projects/1273/packages/npm/",
    "npm config set //gitlab.pitang.com/api/v4/projects/1273/packages/npm/:_authToken=SEU_TOKEN",
  ],
};
const PACKAGE: SetupStep = { text: "Instale o catalyst, sem sudo.", commands: [COMMAND] };
const LINUX = [NODE, CLAUDE, SANDBOX, TOKEN, REGISTRY, PACKAGE];

export const SETUP: Record<System, { label: string; intro?: string; steps: SetupStep[] }> = {
  macos: { label: "macOS", steps: [NODE, CLAUDE, TOKEN, REGISTRY, PACKAGE] },
  linux: { label: "Linux", steps: LINUX },
  windows: {
    label: "Windows",
    intro: "O catalyst roda no WSL2, o Linux que o Windows instala com um comando. Depois do primeiro passo, tudo roda no terminal dele.",
    steps: [{ text: "No PowerShell, instale o WSL2 e reinicie o computador se o Windows pedir.", commands: ["wsl --install"] }, ...LINUX],
  },
};

export const SYSTEMS = Object.keys(SETUP) as System[];

// The system the browser runs on, to open the tab of the install on it. A phone opens on the macOS, the most common computer here.
const SYSTEM_OF: [RegExp, System][] = [
  [/android|iphone|ipad/i, "macos"],
  [/win/i, "windows"],
  [/linux|x11|cros/i, "linux"],
];

export function systemOf(platform: string, userAgent: string): System {
  const text = `${platform} ${userAgent}`;
  return SYSTEM_OF.find(([pattern]) => pattern.test(text))?.[1] ?? "macos";
}

// The chapter of the guide each card opens. The step by step of the install has no card: the bar of the install leads to it.
export const TOOLKIT_CARDS: { chapter: string; title: string; text: string }[] = [
  {
    chapter: "o-que-faz",
    title: "O que faz",
    text: "Por que um agente de IA erra o que não está escrito, e os sete requisitos que o catalyst mede no seu projeto.",
  },
  {
    chapter: "primeiro-uso",
    title: "Primeiro uso",
    text: "Abra o catalyst no seu projeto e confira a instalação, sem gastar a sua conta do Claude Code.",
  },
  {
    chapter: "doctor",
    title: "Diagnosticar com o doctor",
    text: "O exame do projeto, a revisão com IA e a página que diz o que falta e quem resolve.",
  },
  {
    chapter: "init",
    title: "Preparar com o init",
    text: "A entrevista que escreve com você o que falta, e grava só os arquivos que você marcar.",
  },
  {
    chapter: "problemas",
    title: "Quando algo dá errado",
    text: "Cada mensagem de erro da instalação e do doctor, com o conserto.",
  },
];
