import type { AreaId } from "@/data/types";
import type { PlatformId } from "./courses";

export type Priority = "essential" | "recommended" | "optional";

export const PRIORITIES: { id: Priority; name: string; when: string }[] = [
  { id: "essential", name: "Essencial", when: "obrigatório, e você aplica direto na rotina" },
  { id: "recommended", name: "Recomendado", when: "vem depois dos essenciais e amplia o que você faz no papel" },
  { id: "optional", name: "Opcional", when: "conforme o seu interesse, a senioridade ou o projeto" },
];

type PhaseId = "fundamentals" | "practice" | "advanced";

export const PHASES: { id: PhaseId; name: string }[] = [
  { id: "fundamentals", name: "Fundamentos" },
  { id: "practice", name: "Aplicação" },
  { id: "advanced", name: "Aprofundamento" },
];

export type CourseStep = {
  courseId: string;
  priority: Priority;
  reason: string;
  techLead?: boolean;
  slice?: { from: string; to: string; minutes: number };
  note?: string;
};

export type PlatformTrack = {
  platform: PlatformId;
  recommendation: string;
  coverage: string;
  phases: Record<PhaseId, CourseStep[]>;
};

type TrainingProgram = {
  area: AreaId;
  tracks: PlatformTrack[];
};

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    area: "produto",
    tracks: [
      {
        platform: "anthropic",
        recommendation: "Módulos selecionados",
        coverage: "Cobre fluência em IA e o uso do Claude no dia a dia, com o Cowork. Não tem curso de discovery nem de escrita de requisitos.",
        phases: {
          fundamentals: [
            {
              courseId: "ai-fluency-framework-foundations",
              priority: "essential",
              reason: "Base de fluência: delegar, descrever, discernir e agir com diligência",
            },
            {
              courseId: "ai-capabilities-and-limitations",
              priority: "essential",
              reason: "Saber o que a IA faz e não faz antes de especificar features com IA",
            },
            { courseId: "claude-101", priority: "essential", reason: "Uso diário: resumos, rascunhos de histórias e critérios de aceite" },
          ],
          practice: [
            {
              courseId: "introduction-to-claude-cowork",
              priority: "essential",
              reason: "Trabalhar direto em documentos de requisitos, pesquisa e consolidação",
            },
            {
              courseId: "ai-fluency-for-builders",
              priority: "recommended",
              reason: "Entender como o time técnico constrói com IA, para conversar com ele sobre o que delegar",
            },
          ],
          advanced: [
            {
              courseId: "introduction-to-agent-skills",
              priority: "optional",
              reason: "Padronizar templates de histórias e critérios de aceite em skills",
            },
            { courseId: "claude-code-101", priority: "optional", reason: "Entender como o time de dev trabalha com IA" },
          ],
        },
      },
      {
        platform: "openai",
        recommendation: "Trilha completa (Foundations) + 2\u00a0cursos API",
        coverage: "A melhor cobertura para PO: a trilha Foundations inteira, mais o Scope AI Solutions e o Evaluate AI Applications.",
        phases: {
          fundamentals: [
            { courseId: "ai-foundations", priority: "essential", reason: "Instruções claras, contexto e revisão crítica das respostas" },
            {
              courseId: "applied-ai-foundations",
              priority: "essential",
              reason: "Transformar refinamento, atas e escrita de histórias em workflows repetíveis",
            },
          ],
          practice: [
            {
              courseId: "agents-and-workflows",
              priority: "essential",
              reason: "Delegar análises em várias etapas a agentes com pontos de controle",
            },
            {
              courseId: "scope-ai-solutions",
              priority: "essential",
              reason: "Descobrir oportunidades de IA e transformá-las em plano de solução/backlog",
            },
          ],
          advanced: [
            {
              courseId: "evaluate-ai-applications",
              priority: "recommended",
              reason: "Definir critérios de aceite mensuráveis para features com IA",
            },
            { courseId: "ai-leadership", priority: "optional", reason: "PO sênior: ligar a iniciativa de IA a prioridades de negócio e roadmap" },
            { courseId: "get-started-with-codex", priority: "optional", reason: "Entender como o time de dev trabalha com IA" },
          ],
        },
      },
      {
        platform: "microsoft",
        recommendation: "Só fundamentos (AI-901 + Responsible AI)",
        coverage: "O plano da Microsoft é para AI Engineer. Para PO, servem só os fundamentos e o módulo de IA responsável.",
        phases: {
          fundamentals: [
            { courseId: "ai-901", priority: "recommended", reason: "Fundamentos de IA e dos serviços de IA da Microsoft" },
          ],
          practice: [
            {
              courseId: "responsible-ai-studio",
              priority: "recommended",
              reason: "Requisitos não funcionais de IA: segurança, privacidade, guardrails",
            },
          ],
          advanced: [
            { courseId: "ai-103-lp4", priority: "optional", reason: "Casos de uso com documentos e dados corporativos" },
            {
              courseId: "model-catalog-evaluate",
              priority: "optional",
              reason: "Noções de escolha e avaliação de modelos para critérios de aceite",
            },
          ],
        },
      },
    ],
  },
  {
    area: "engenharia",
    tracks: [
      {
        platform: "anthropic",
        recommendation: "Trilha completa (bloco técnico)",
        coverage: "A plataforma com mais cursos para dev: Claude Code, API, MCP, skills e subagentes.",
        phases: {
          fundamentals: [
            { courseId: "ai-fluency-for-builders", priority: "essential", reason: "O ponto de partida do dev: os quatro Ds aplicados ao código e à experiência do usuário" },
            { courseId: "ai-capabilities-and-limitations", priority: "recommended", reason: "Onde a IA falha, para desenhar a feature contando com isso" },
            { courseId: "claude-code-101", priority: "essential", reason: "Claude Code no fluxo diário de desenvolvimento" },
            { courseId: "claude-code-in-action", priority: "essential", reason: "Sessões longas e autônomas com verificação e automação" },
          ],
          practice: [
            { courseId: "introduction-to-agent-skills", priority: "essential", reason: "Padronizar práticas do time em skills reutilizáveis" },
            { courseId: "claude-platform-101", priority: "essential", reason: "A API, os modelos e o loop do agente, antes do curso principal da API" },
            {
              courseId: "building-with-the-claude-api",
              priority: "essential",
              reason: "Curso principal: prompts, tool use, RAG, avaliação e agentes",
            },
            {
              courseId: "introduction-to-model-context-protocol",
              priority: "essential",
              reason: "Conectar IA a sistemas e dados internos do cliente",
            },
          ],
          advanced: [
            {
              courseId: "introduction-to-subagents",
              priority: "recommended",
              reason: "Workflows especializados com subagentes (review, testes, docs)",
            },
            { courseId: "model-context-protocol-advanced-topics", priority: "recommended", reason: "MCP em produção" },
            { courseId: "claude-with-amazon-bedrock", priority: "optional", reason: "Somente se o cliente usa AWS Bedrock ou Google Vertex AI" },
          ],
        },
      },
      {
        platform: "openai",
        recommendation: "Trilhas completas (Codex + API)",
        coverage: "As trilhas Codex e API inteiras: agentes, RAG, evals e desempenho. Não cobre MCP.",
        phases: {
          fundamentals: [
            { courseId: "ai-foundations", priority: "recommended", reason: "O mesmo básico de uso e revisão crítica que o resto do time faz" },
            { courseId: "get-started-with-codex", priority: "essential", reason: "Agentic coding com Codex em repositórios reais" },
          ],
          practice: [
            { courseId: "extend-codex-workflows", priority: "essential", reason: "Automação multietapas de código" },
            { courseId: "design-and-build-agentic-systems", priority: "essential", reason: "Agentes em produto com a OpenAI API" },
            { courseId: "build-with-retrieval-augmented-generation", priority: "essential", reason: "IA sobre bases de conhecimento do cliente" },
            { courseId: "evaluate-ai-applications", priority: "essential", reason: "Evals que barram a regressão antes da produção" },
          ],
          advanced: [
            { courseId: "scope-ai-solutions", priority: "recommended", reason: "Escopar soluções de IA junto com PO" },
            { courseId: "optimize-ai-application-performance", priority: "recommended", reason: "Latência, custo e desempenho em produção" },
            {
              courseId: "scale-codex-across-teams-and-systems",
              priority: "recommended",
              reason: "Tech leads: Codex em vários times, com governança",
              techLead: true,
            },
          ],
        },
      },
      {
        platform: "microsoft",
        recommendation: "Trilha completa se o projeto for Azure",
        coverage: "Os quatro roteiros de aprendizagem do AI-103 somam cerca de 30\u00a0h, todos em Azure e Microsoft Foundry. Fazem sentido quando o cliente usa Azure, e a certificação AI-103 é paga.",
        phases: {
          fundamentals: [
            { courseId: "ai-901", priority: "recommended", reason: "Fundamentos de IA e serviços Azure" },
            { courseId: "ai-103-lp1", priority: "essential", reason: "Modelos, chat apps, tools, RAG/fine-tuning e IA responsável no Foundry" },
          ],
          practice: [
            { courseId: "ai-103-lp2", priority: "essential", reason: "Foundry Agent Service, Microsoft Agent Framework, multiagentes" },
          ],
          advanced: [
            { courseId: "ai-103-lp3", priority: "recommended", reason: "Quando o projeto envolver texto ou voz" },
            { courseId: "ai-103-lp4", priority: "recommended", reason: "Extrair dados de imagens e documentos" },
            { courseId: "ai-103", priority: "optional", reason: "Credencial para projetos Microsoft (substitui o AI-102)" },
          ],
        },
      },
    ],
  },
  {
    area: "qualidade",
    tracks: [
      {
        platform: "anthropic",
        recommendation: "Módulos selecionados",
        coverage: "Claude Code para automação de testes, e avaliação de prompts dentro do curso da API. Não tem curso só de testes de IA.",
        phases: {
          fundamentals: [
            { courseId: "ai-fluency-framework-foundations", priority: "essential", reason: "Base de fluência e uso responsável" },
            {
              courseId: "ai-capabilities-and-limitations",
              priority: "essential",
              reason: "Entender alucinação e não determinismo, que mudam a forma de testar",
            },
            { courseId: "claude-101", priority: "essential", reason: "Apoio na análise de requisitos e desenho de cenários" },
            { courseId: "claude-code-101", priority: "essential", reason: "Gerar, manter e refatorar testes automatizados" },
          ],
          practice: [
            { courseId: "claude-code-in-action", priority: "recommended", reason: "Automação e verificação de mudanças em sessões longas" },
            { courseId: "introduction-to-claude-cowork", priority: "recommended", reason: "Planos, evidências e relatórios de teste" },
            { courseId: "introduction-to-agent-skills", priority: "recommended", reason: "Skills com os padrões de teste do time" },
          ],
          advanced: [
            {
              courseId: "building-with-the-claude-api",
              priority: "recommended",
              reason: "Foco nos módulos de avaliação de prompts (evals)",
              slice: { from: "prompt-evaluation", to: "quiz-on-prompt-evaluation", minutes: 82 },
              note: "Foco no bloco Prompt evaluation (aulas 9 a 14 + quiz). Curso completo: 67\u00a0aulas, 8\u00a0h\u00a053\u00a0min.",
            },
            { courseId: "ai-fluency-for-builders", priority: "recommended", reason: "Entender como o time técnico constrói com IA, para saber o que testar no que sai dele" },
            { courseId: "introduction-to-subagents", priority: "optional", reason: "Subagente dedicado a testes/revisão" },
          ],
        },
      },
      {
        platform: "openai",
        recommendation: "Módulos selecionados",
        coverage: "Tem um curso só de avaliação de apps com IA (Evaluate AI Applications), e o Codex para review e testes.",
        phases: {
          fundamentals: [
            { courseId: "ai-foundations", priority: "essential", reason: "Instruções claras e revisão crítica das respostas" },
            {
              courseId: "get-started-with-codex",
              priority: "essential",
              reason: "Code review assistido e execução de testes para validar mudanças",
            },
          ],
          practice: [
            { courseId: "evaluate-ai-applications", priority: "essential", reason: "Testar sistemas com IA: evals, métricas e regressão" },
            { courseId: "applied-ai-foundations", priority: "recommended", reason: "Workflows padronizados de geração de casos de teste" },
            {
              courseId: "agents-and-workflows",
              priority: "recommended",
              reason: "Delegar tarefas de teste em várias etapas com pontos de revisão",
            },
          ],
          advanced: [
            { courseId: "extend-codex-workflows", priority: "recommended", reason: "Automatizar validações no pipeline" },
            { courseId: "optimize-ai-application-performance", priority: "recommended", reason: "Testes de performance e custo de apps com IA" },
          ],
        },
      },
      {
        platform: "microsoft",
        recommendation: "Módulos selecionados (avaliação + Responsible AI)",
        coverage: "Avaliação de modelos e IA responsável. Não tem conteúdo de automação de testes com IA.",
        phases: {
          fundamentals: [
            { courseId: "ai-901", priority: "recommended", reason: "Fundamentos de IA e serviços Azure" },
          ],
          practice: [
            { courseId: "responsible-ai-studio", priority: "essential", reason: "Testes de segurança, conteúdo e guardrails" },
            { courseId: "model-catalog-evaluate", priority: "recommended", reason: "Métricas e avaliação de modelos" },
          ],
          advanced: [
            { courseId: "ai-103-lp1", priority: "optional", reason: "Saber como o dev constrói a app no Foundry, para escolher o que testar" },
            { courseId: "ai-103-lp2", priority: "optional", reason: "Entender agentes para testar comportamento e ferramentas" },
          ],
        },
      },
    ],
  },
  {
    area: "meio",
    tracks: [
      {
        platform: "anthropic",
        recommendation: "Módulos selecionados",
        coverage: "Cobre fluência em IA, o Claude no dia a dia e o Cowork nos seus arquivos e no Microsoft 365. Os cursos de Claude Code e da API são para quem programa e ficam de fora.",
        phases: {
          fundamentals: [
            {
              courseId: "ai-fluency-framework-foundations",
              priority: "essential",
              reason: "Base de fluência: o que delegar à IA, como pedir e como conferir",
            },
            {
              courseId: "ai-capabilities-and-limitations",
              priority: "essential",
              reason: "Saber quando a resposta pede conferência antes de ir para um relatório ou um e-mail",
            },
            { courseId: "claude-101", priority: "essential", reason: "Uso diário: projetos, resumos, rascunhos e conectores" },
          ],
          practice: [
            {
              courseId: "introduction-to-claude-cowork",
              priority: "essential",
              reason: "O Claude trabalhando nas planilhas, nos documentos e no Microsoft 365 da área",
            },
          ],
          advanced: [
            {
              courseId: "introduction-to-agent-skills",
              priority: "optional",
              reason: "Transformar uma rotina que se repete numa skill. O curso usa o Claude Code, e a skill também roda no Cowork",
            },
          ],
        },
      },
      {
        platform: "openai",
        recommendation: "Trilha Foundations + Scope AI Solutions",
        coverage: "Cobre o uso do ChatGPT no trabalho e a passagem de tarefa recorrente para workflow. Os cursos de Codex e da API são para quem programa e ficam de fora.",
        phases: {
          fundamentals: [
            { courseId: "ai-foundations", priority: "essential", reason: "Instruções claras, contexto, revisão das respostas e uso responsável" },
          ],
          practice: [
            {
              courseId: "applied-ai-foundations",
              priority: "essential",
              reason: "Transformar fechamento, conciliação e relatório do mês em workflows com pontos de revisão",
            },
            { courseId: "scope-ai-solutions", priority: "recommended", reason: "Escolher na área as tarefas que valem automatizar primeiro" },
          ],
          advanced: [
            { courseId: "agents-and-workflows", priority: "optional", reason: "Delegar tarefas de várias etapas a agentes, com pontos de controle" },
          ],
        },
      },
      {
        platform: "microsoft",
        recommendation: "Só os conceitos",
        coverage: "O conteúdo da Microsoft no catálogo é técnico, do Azure. Para as áreas de meio, vale o roteiro Conceitos de IA, do AI-901.",
        phases: {
          fundamentals: [
            {
              courseId: "ai-901",
              priority: "recommended",
              reason: "Conceitos de IA, sem programação",
              note: "Foco no roteiro Conceitos de IA (7\u00a0módulos, 3\u00a0h\u00a051\u00a0min). O segundo roteiro é de apps e agentes no Azure, para quem desenvolve.",
            },
          ],
          practice: [
            { courseId: "responsible-ai-studio", priority: "optional", reason: "Os riscos do conteúdo que a IA gera e os filtros que os contêm" },
          ],
          advanced: [
            {
              courseId: "ai-103-lp4",
              priority: "optional",
              reason: "Ver como a IA extrai dados de documentos e notas, para saber o que pedir ao time técnico",
            },
          ],
        },
      },
    ],
  },
];

export function trainingFor(area: string): TrainingProgram | undefined {
  return TRAINING_PROGRAMS.find((c) => c.area === area);
}

export function stepsOf(track: PlatformTrack): CourseStep[] {
  return PHASES.flatMap((phase) => track.phases[phase.id]);
}

export function coursesOf(training: TrainingProgram): string[] {
  return [...new Set(training.tracks.flatMap((t) => stepsOf(t).map((p) => p.courseId)))];
}

export function sharedFundamentals(): string[] {
  const [first, ...others] = TRAINING_PROGRAMS.map((c) => c.tracks.flatMap((t) => t.phases.fundamentals.map((p) => p.courseId)));
  return (first ?? []).filter((courseId) => others.every((list) => list.includes(courseId)));
}
