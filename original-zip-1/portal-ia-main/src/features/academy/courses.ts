import { stepsOf, type Priority, type CourseStep, type PlatformTrack } from "./training";

export type PlatformId = "anthropic" | "openai" | "microsoft";

type Platform = {
  id: PlatformId;
  name: string;
  domain: string;
  language: string;
};

export const PLATFORMS: Platform[] = [
  {
    id: "anthropic",
    name: "Anthropic Academy",
    domain: "academy.claude.com",
    language: "Inglês · vídeos com legenda",
  },
  {
    id: "openai",
    name: "OpenAI Academy",
    domain: "academy.openai.com",
    language: "Inglês · traduzir a página",
  },
  {
    id: "microsoft",
    name: "Microsoft Learn",
    domain: "learn.microsoft.com",
    language: "Disponível em português",
  },
];

export type Course = {
  id: string;
  platform: PlatformId;
  title: string;
  language?: "en";
  url: string;
  summary: string;
  minutes?: number;
  lessonCount?: number;
  level?: "Introdução" | "Iniciante" | "Intermediário" | "Avançado";
  exam?: boolean;
  note?: string;
};

export const COURSES: Course[] = [
  {
    id: "ai-fluency-framework-foundations",
    platform: "anthropic",
    title: "AI Fluency: Framework & Foundations",
    language: "en",
    url: "https://academy.claude.com/courses/ai-fluency-framework-foundations",
    summary: "Os quatro Ds da fluência em IA (delegação, descrição, discernimento e diligência), com uma aula para cada um e técnicas de prompt",
    minutes: 228,
  },
  {
    id: "ai-capabilities-and-limitations",
    platform: "anthropic",
    title: "AI Capabilities and Limitations",
    language: "en",
    url: "https://academy.claude.com/courses/ai-capabilities-and-limitations",
    summary: "Por que a IA acerta e erra: previsão do próximo token, conhecimento, memória de trabalho e direcionamento, com exercícios",
    minutes: 213,
  },
  {
    id: "claude-101",
    platform: "anthropic",
    title: "Claude 101",
    language: "en",
    url: "https://academy.claude.com/courses/claude-101",
    summary: "O Claude no trabalho do dia a dia: projetos, artifacts, skills, conectores, pesquisa e casos de uso por papel",
    minutes: 147,
  },
  {
    id: "introduction-to-claude-cowork",
    platform: "anthropic",
    title: "Introduction to Claude Cowork",
    language: "en",
    url: "https://academy.claude.com/courses/introduction-to-claude-cowork",
    summary: "O Claude trabalhando nos seus arquivos e tarefas: instruções globais, projetos, skills, plugins, Chrome e Microsoft 365",
    minutes: 162,
  },
  {
    id: "ai-fluency-for-builders",
    platform: "anthropic",
    title: "AI Fluency for Builders",
    language: "en",
    url: "https://academy.claude.com/courses/ai-fluency-for-builders",
    summary: "Os quatro Ds para quem constrói software: delegar, descrever, avaliar o código e a experiência do usuário e responder pelo que entrega",
    minutes: 171,
  },
  {
    id: "introduction-to-agent-skills",
    platform: "anthropic",
    title: "Introduction to agent skills",
    language: "en",
    url: "https://academy.claude.com/courses/introduction-to-agent-skills",
    summary: "Criar, configurar, compartilhar e corrigir skills no Claude Code",
    minutes: 58,
  },
  {
    id: "claude-code-101",
    platform: "anthropic",
    title: "Claude Code 101",
    language: "en",
    url: "https://academy.claude.com/courses/claude-code-101",
    summary: "Usar o Claude Code no fluxo diário de desenvolvimento",
    minutes: 81,
  },
  {
    id: "claude-code-in-action",
    platform: "anthropic",
    title: "Claude Code in Action",
    language: "en",
    url: "https://academy.claude.com/courses/claude-code-in-action",
    summary: "Sessões longas e autônomas: orientar, configurar, automatizar e verificar",
    minutes: 58,
  },
  {
    id: "claude-platform-101",
    platform: "anthropic",
    title: "Claude Platform 101",
    language: "en",
    url: "https://academy.claude.com/courses/claude-platform-101",
    summary: "A primeira chamada à API, a escolha do modelo, o loop do agente, tool use, MCP e agentes gerenciados",
    minutes: 83,
  },
  {
    id: "building-with-the-claude-api",
    platform: "anthropic",
    title: "Building with the Claude API",
    language: "en",
    url: "https://academy.claude.com/courses/building-with-the-claude-api",
    summary: "API completa: prompts, avaliação, tool use, RAG, MCP, agentes e workflows",
    minutes: 533,
  },
  {
    id: "introduction-to-model-context-protocol",
    platform: "anthropic",
    title: "Introduction to Model Context Protocol",
    language: "en",
    url: "https://academy.claude.com/courses/introduction-to-model-context-protocol",
    summary: "Servidores e clientes MCP em Python: tools, resources e prompts",
    minutes: 61,
  },
  {
    id: "introduction-to-subagents",
    platform: "anthropic",
    title: "Introduction to subagents",
    language: "en",
    url: "https://academy.claude.com/courses/introduction-to-subagents",
    summary: "Usar e criar subagentes para delegar tarefas e organizar contexto",
    minutes: 35,
  },
  {
    id: "model-context-protocol-advanced-topics",
    platform: "anthropic",
    title: "Model Context Protocol: Advanced Topics",
    language: "en",
    url: "https://academy.claude.com/courses/model-context-protocol-advanced-topics",
    summary: "Sampling, notificações, file system e transporte para MCP em produção",
    minutes: 81,
  },
  {
    id: "claude-with-amazon-bedrock",
    platform: "anthropic",
    title: "Claude with Amazon Bedrock / Claude on Google Cloud",
    language: "en",
    url: "https://academy.claude.com/courses/claude-with-amazon-bedrock",
    summary: "Claude nas nuvens AWS e Google Cloud",
    minutes: 480,
    lessonCount: 65,
    note: "Bedrock: 65\u00a0aulas, 8\u00a0h · Vertex AI: 66\u00a0aulas, 8,5\u00a0h. Faça só o da nuvem do cliente.",
  },
  {
    id: "ai-foundations",
    platform: "openai",
    title: "AI Foundations",
    language: "en",
    url: "https://academy.openai.com/public/courses/ai-foundations-dnq5w",
    summary: "Básico de IA, LLMs e ChatGPT; instruções claras, contexto, revisão e uso responsável",
    minutes: 70,
    level: "Introdução",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "applied-ai-foundations",
    platform: "openai",
    title: "Applied AI Foundations",
    language: "en",
    url: "https://academy.openai.com/public/courses/applied-ai-foundations-szsmv",
    summary: "Transformar tarefas recorrentes em workflows repetíveis com pontos de revisão",
    minutes: 80,
    level: "Intermediário",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "agents-and-workflows",
    platform: "openai",
    title: "Agents and Workflows",
    language: "en",
    url: "https://academy.openai.com/public/courses/agents-and-workflows-y0qoc",
    summary: "Direcionar trabalho com agentes em fluxos estruturados",
    minutes: 90,
    level: "Intermediário",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "scope-ai-solutions",
    platform: "openai",
    title: "Scope AI Solutions",
    language: "en",
    url: "https://academy.openai.com/public/courses/scope-ai-solutions-kjplw",
    summary: "Identificar oportunidades de IA e transformar as melhores em plano de solução",
    minutes: 45,
    level: "Intermediário",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "evaluate-ai-applications",
    platform: "openai",
    title: "Evaluate AI Applications",
    language: "en",
    url: "https://academy.openai.com/public/courses/evaluate-ai-applications-pxds7",
    summary: "Avaliar a qualidade de aplicações com IA (evals)",
    minutes: 70,
    level: "Intermediário",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "ai-leadership",
    platform: "openai",
    title: "AI Leadership",
    language: "en",
    url: "https://academy.openai.com/public/courses/ai-leadership-kaf7k",
    summary: "Transformar uma iniciativa de IA em roadmap e estratégia inicial",
    minutes: 180,
    level: "Intermediário",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "get-started-with-codex",
    platform: "openai",
    title: "Get Started with Codex",
    language: "en",
    url: "https://academy.openai.com/public/courses/get-started-with-codex-jkhsq",
    summary: "Codex no trabalho de código do dia a dia",
    minutes: 80,
    level: "Intermediário",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "extend-codex-workflows",
    platform: "openai",
    title: "Extend Codex Workflows",
    language: "en",
    url: "https://academy.openai.com/public/courses/extend-codex-workflows-4e61p",
    summary: "Processos multietapas e automação de código com Codex",
    minutes: 90,
    level: "Intermediário",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "design-and-build-agentic-systems",
    platform: "openai",
    title: "Design and Build Agentic Systems",
    language: "en",
    url: "https://academy.openai.com/public/courses/design-and-build-agentic-systems-k5uke",
    summary: "Projetar e construir sistemas agênticos com a OpenAI API",
    minutes: 110,
    level: "Intermediário",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "build-with-retrieval-augmented-generation",
    platform: "openai",
    title: "Build with Retrieval-Augmented Generation",
    language: "en",
    url: "https://academy.openai.com/public/courses/build-with-retrieval-augmented-generation-2v6xg",
    summary: "Aplicações que respondem com base em documentos, com RAG",
    minutes: 110,
    level: "Intermediário",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "optimize-ai-application-performance",
    platform: "openai",
    title: "Optimize AI Application Performance",
    language: "en",
    url: "https://academy.openai.com/public/courses/optimize-ai-application-performance-1k50h",
    summary: "Desempenho, latência e custo de aplicações com IA em produção",
    minutes: 45,
    level: "Intermediário",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "scale-codex-across-teams-and-systems",
    platform: "openai",
    title: "Scale Codex Across Governed Teams and Systems",
    language: "en",
    url: "https://academy.openai.com/public/courses/scale-codex-across-teams-and-systems-jr83a",
    summary: "Codex em vários times e sistemas, com governança",
    minutes: 100,
    level: "Avançado",
    note: "O badge sai com a avaliação do fim do curso, a partir de 80% de acerto.",
  },
  {
    id: "ai-901",
    platform: "microsoft",
    title: "AI-901: Introduction to AI in Azure",
    language: "en",
    url: "https://learn.microsoft.com/pt-br/training/courses/ai-901t00",
    summary: "Fundamentos de IA e serviços de IA do Azure. Dois roteiros de aprendizagem: Conceitos de IA (7\u00a0módulos, 3\u00a0h\u00a051\u00a0min) e Introdução a apps e agentes de IA no Azure (8\u00a0módulos, 5\u00a0h\u00a037\u00a0min).",
    minutes: 568,
    level: "Iniciante",
  },
  {
    id: "responsible-ai-studio",
    platform: "microsoft",
    title: "Módulo: Implement a responsible generative AI solution",
    language: "en",
    url: "https://learn.microsoft.com/pt-br/training/modules/responsible-ai-studio/",
    summary: "Riscos, guardrails, filtros de conteúdo e IA responsável (módulo do roteiro de aprendizagem LP1).",
    minutes: 45,
    level: "Intermediário",
  },
  {
    id: "ai-103-lp4",
    platform: "microsoft",
    title: "AI-103 LP4: Extração de informação e conteúdo",
    url: "https://learn.microsoft.com/pt-br/training/paths/insight-visual-data/",
    summary: "No Microsoft Learn, o roteiro de aprendizagem 4 se chama \"Extrair insights de dados visuais no Azure\": imagem, documentos e conteúdo, em 8\u00a0módulos.",
    minutes: 426,
    level: "Intermediário",
  },
  {
    id: "model-catalog-evaluate",
    platform: "microsoft",
    title: "Módulo: Select, deploy, and evaluate Microsoft Foundry models",
    language: "en",
    url: "https://learn.microsoft.com/pt-br/training/modules/model-catalog-evaluate/",
    summary: "Seleção, implantação e avaliação de modelos no Foundry (módulo do roteiro de aprendizagem LP1).",
    minutes: 63,
    level: "Intermediário",
  },
  {
    id: "ai-103-lp1",
    platform: "microsoft",
    title: "AI-103 LP1: Develop generative AI apps (completo)",
    language: "en",
    url: "https://learn.microsoft.com/pt-br/training/paths/develop-generative-ai-apps/",
    summary: "Roteiro de aprendizagem \"Desenvolver aplicativos de IA generativos no Azure\": planejar, selecionar/implantar/avaliar modelos, app de chat, ferramentas, otimização (RAG, fine-tuning) e IA responsável. 6 módulos.",
    minutes: 412,
    level: "Intermediário",
  },
  {
    id: "ai-103-lp2",
    platform: "microsoft",
    title: "AI-103 LP2: Develop AI agents on Azure",
    language: "en",
    url: "https://learn.microsoft.com/pt-br/training/paths/develop-ai-agents-azure/",
    summary: "Roteiro de aprendizagem \"Desenvolver agentes de IA no Azure\": Foundry Agent Service, Microsoft Agent Framework, multiagentes. 9\u00a0módulos.",
    minutes: 592,
    level: "Intermediário",
  },
  {
    id: "ai-103-lp3",
    platform: "microsoft",
    title: "AI-103 LP3: Linguagem natural (texto e fala)",
    url: "https://learn.microsoft.com/pt-br/training/paths/develop-language-solutions-azure-ai/",
    summary: "No Microsoft Learn, o roteiro de aprendizagem 3 se chama \"Desenvolver soluções de linguagem natural no Azure\": texto e fala, em 7\u00a0módulos.",
    minutes: 346,
    level: "Intermediário",
  },
  {
    id: "ai-103",
    platform: "microsoft",
    title: "Certificação AI-103 (exame pago)",
    url: "https://learn.microsoft.com/pt-br/training/courses/ai-103t00",
    summary: "Exame pago que substitui o AI-102, aposentado em 30/06/2026. Os quatro roteiros de aprendizagem do AI-103 preparam para ele.",
    level: "Intermediário",
    exam: true,
  },
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function platformOf(id: PlatformId): Platform {
  const platform = PLATFORMS.find((p) => p.id === id);
  if (!platform) throw new Error(`Unknown platform: ${id}`);
  return platform;
}

export function stepMinutes(step: CourseStep): number {
  return step.slice?.minutes ?? getCourse(step.courseId)?.minutes ?? 0;
}

export type Total = { minutes: number; courses: number; exams: number };

export function totalsOf(track: PlatformTrack): Record<Priority | "total", Total> {
  const empty = (): Total => ({ minutes: 0, courses: 0, exams: 0 });
  const totals = { essential: empty(), recommended: empty(), optional: empty(), total: empty() };
  for (const step of stepsOf(track)) {
    const exam = getCourse(step.courseId)?.exam ? 1 : 0;
    for (const total of [totals[step.priority], totals.total]) {
      total.minutes += stepMinutes(step);
      total.courses += 1;
      total.exams += exam;
    }
  }
  return totals;
}
