import type { ReactNode } from "react";
import { LoadingState } from "@/design-system/beautiful/LoadingState";
import { ThinkingState } from "@/design-system/beautiful/ThinkingState";
import { StreamingText } from "@/design-system/beautiful/StreamingText";
import { ApprovalCard } from "@/design-system/beautiful/ApprovalCard";
import { ToolChips } from "@/design-system/beautiful/ToolChips";
import { TaskRows } from "@/design-system/beautiful/TaskRows";
import { ChatComposer } from "@/design-system/beautiful/ChatComposer";
import { PromptBar } from "@/design-system/beautiful/PromptBar";
import { RecommendationCard } from "@/design-system/beautiful/RecommendationCard";
import { ContextCards } from "@/design-system/beautiful/ContextCards";
import { DiffTable } from "@/design-system/beautiful/DiffTable";
import { RecordsTable } from "@/design-system/beautiful/RecordsTable";
import { FilterTable } from "@/design-system/beautiful/FilterTable";
import { SidebarNav } from "@/design-system/beautiful/SidebarNav";
import { SearchList } from "@/design-system/beautiful/SearchList";
import { Flowchart } from "@/design-system/beautiful/Flowchart";
import { InsightCards } from "@/design-system/beautiful/InsightCards";
import { CodeBlock } from "@/design-system/beautiful/CodeBlock";
import { FineTuneCard } from "@/design-system/beautiful/FineTuneCard";
import { SelectionActions } from "@/design-system/beautiful/SelectionActions";
import { AgentScreen } from "@/design-system/beautiful/AgentScreen";

export const beautifulRegistry: { id: string; title: string; description: string; variants: string[]; render: (variant: string) => ReactNode }[] = [
  { id: "loading-state", title: "Loading State", description: "Indicadores de processamento com tempo decorrido.", variants: ["Drive", "Dots", "Orbit", "Surfer"], render: (variant) => <LoadingState variant={variant} /> },
  { id: "thinking-state", title: "Thinking", description: "Etapas expans?veis de uma tarefa do agente.", variants: ["Steps", "Reasoning", "Search", "Coding"], render: (variant) => <ThinkingState variant={variant} /> },
  { id: "streaming-text", title: "Streaming Text", description: "Resposta progressiva, fontes e perguntas de continuidade.", variants: ["Default"], render: (variant) => <StreamingText variant={variant} /> },
  { id: "approval-card", title: "Approval Card", description: "Perguntas e aprova??o humana antes de uma a??o.", variants: ["Default"], render: (variant) => <ApprovalCard variant={variant} /> },
  { id: "tool-chips", title: "Tool Chips", description: "Chamadas de ferramentas, arquivos e diferen?as.", variants: ["Default"], render: (variant) => <ToolChips variant={variant} /> },
  { id: "task-rows", title: "Task Rows", description: "Tarefas em execu??o, conclu?das ou com falha.", variants: ["Capsules", "List"], render: (variant) => <TaskRows variant={variant} /> },
  { id: "chat-composer", title: "Chat", description: "Conversa com contexto e campo de mensagem.", variants: ["Default"], render: (variant) => <ChatComposer variant={variant} /> },
  { id: "prompt-bar", title: "Prompt Bar", description: "Composi??o com comandos, fontes e sele??o de modelo.", variants: ["Rounded", "Pill"], render: (variant) => <PromptBar variant={variant} /> },
  { id: "recommendation-card", title: "Recommendation Card", description: "Recomenda??o com alternativas e n?vel de confian?a.", variants: ["Default"], render: (variant) => <RecommendationCard variant={variant} /> },
  { id: "context-cards", title: "Context Cards", description: "Trechos de conhecimento com origem identificada.", variants: ["Default"], render: (variant) => <ContextCards variant={variant} /> },
  { id: "diff-table", title: "Diff Table", description: "Revis?o e aceita??o de altera??es em uma tabela.", variants: ["Default"], render: (variant) => <DiffTable variant={variant} /> },
  { id: "records-table", title: "Records Table", description: "Registros com sele??o, ordena??o e colunas ajust?veis.", variants: ["Default"], render: (variant) => <RecordsTable variant={variant} /> },
  { id: "filter-table", title: "Filter Table", description: "Filtros por status sobre uma lista de tarefas.", variants: ["Default"], render: (variant) => <FilterTable variant={variant} /> },
  { id: "sidebar-nav", title: "Sidebar Nav", description: "Navega??o de workspace e hist?rico de conversas.", variants: ["Default"], render: (_variant) => <SidebarNav /> },
  { id: "search", title: "Search", description: "Pesquisa com resultados filtrados e estado vazio.", variants: ["Default"], render: (variant) => <SearchList variant={variant} /> },
  { id: "flowchart", title: "Flowchart", description: "Fluxo com gatilhos, condi??es e conex?es.", variants: ["Default"], render: (variant) => <Flowchart variant={variant} /> },
  { id: "insight-cards", title: "Insight Cards", description: "Insights naveg?veis e gr?ficos interativos.", variants: ["Default"], render: (variant) => <InsightCards variant={variant} /> },
  { id: "code-block", title: "Code Block", description: "C?digo numerado, c?pia e compara??o de altera??es.", variants: ["Code", "Diff"], render: (variant) => <CodeBlock variant={variant} /> },
  { id: "fine-tune-card", title: "Fine-tune Card", description: "Ajustes de dimens?es, apar?ncia e tipografia.", variants: ["Default"], render: (variant) => <FineTuneCard variant={variant} /> },
  { id: "selection-actions", title: "Selection Actions", description: "Sele??o de texto com a??es de revis?o.", variants: ["Default"], render: (_variant) => <SelectionActions /> },
  { id: "agent-screen", title: "Agent Screen", description: "Visualiza??o de tela e simula??o de grava??o.", variants: ["Working", "Loading"], render: (variant) => <AgentScreen variant={variant} /> },
];
