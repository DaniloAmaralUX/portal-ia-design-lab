import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowRightLeft,
  BookOpen,
  ClipboardList,
  Database,
  FileText,
  FlaskConical,
  GitPullRequest,
  Hand,
  ListTodo,
  Mail,
  MessagesSquare,
  MonitorSmartphone,
  Package,
  PenTool,
  Server,
  type LucideIcon,
} from "lucide-react";
import { Acronym } from "@/components/Acronym";
import { Badge } from "@/design-system/primitives";
import { getPlugin } from "@/data/catalog";
import { ACRONYMS } from "@/data/glossary";
import { cn } from "@/lib/utils";

function Prd({ first = false }: { first?: boolean }) {
  return first ? <Acronym tip={ACRONYMS.PRD ?? ""}>PRD</Acronym> : <>PRD</>;
}

function StagePlugin({ name }: { name: string }) {
  const plugin = getPlugin(name);
  if (!plugin) return null;
  return (
    <Link
      to="/plugins/$plugin"
      params={{ plugin: name }}
      className="inline-flex items-center gap-1 self-start text-caption link"
    >
      Plugin {plugin.displayName}
      <ArrowRight aria-hidden className="size-3.5" />
    </Link>
  );
}

function Hil({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-2.5 py-1 text-caption font-medium text-foreground/85">
      <Hand aria-hidden className="size-3.5 shrink-0" />
      <span>{children}</span>
    </span>
  );
}

function Box({
  icon: Icon,
  title,
  tag,
  items,
  hil,
  plugin,
  className,
}: {
  icon: LucideIcon;
  title: string;
  tag?: string;
  items: ReactNode[];
  hil?: ReactNode;
  plugin?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-xs", className)}>
      {tag && (
        <Badge variant="outline" className="self-start">
          {tag}
        </Badge>
      )}
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
          <Icon aria-hidden className="size-4" />
        </span>
        <h3 className="font-display text-body font-bold">{title}</h3>
      </div>
      <ul className="list-disc space-y-1.5 pl-5 text-small leading-relaxed text-muted-foreground marker:text-muted-foreground/60">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      {plugin && <StagePlugin name={plugin} />}
      {hil && (
        <div className="mt-auto pt-1">
          <Hil>{hil}</Hil>
        </div>
      )}
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-dashed border-foreground/25 bg-background px-3 py-1 text-caption font-medium">{children}</span>;
}

function DownArrow({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 py-1">
      <ArrowDown aria-hidden className="size-5 text-muted-foreground" />
      {children && <div className="flex flex-wrap justify-center gap-2">{children}</div>}
      {children && <ArrowDown aria-hidden className="size-5 text-muted-foreground" />}
    </div>
  );
}

const TRIGGERS: [LucideIcon, string][] = [
  [FileText, "Atas de reunião"],
  [Mail, "E-mails"],
  [MessagesSquare, "Conversas / demandas"],
];

const SUPPORT: [LucideIcon, string, string, string?][] = [
  [BookOpen, "Documentação de código", "Apoio a requisitos / dev", "technical-documentation"],
  [Database, "RAG de código", "Contexto recuperado do repositório"],
  [ListTodo, "Planejamento de atividades", "Orquestração do fluxo"],
  [GitPullRequest, "Revisão de PR", "Técnica + regra de negócio da demanda", "pr-review"],
];

export function PipelineDiagram() {
  return (
    <div className="@container space-y-4">
      <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-3">
        <div className="rounded-2xl border border-dashed border-border p-4 @3xl:col-span-3">
          <h2 className="eyebrow mb-3">Gatilhos iniciais</h2>
          <ul className="grid gap-2 @3xl:grid-cols-3">
            {TRIGGERS.map(([Icon, name]) => (
              <li key={name} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-small font-medium">
                <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center gap-2 text-caption font-medium text-muted-foreground @3xl:col-span-3">
          <span className="text-center">Inputs do cliente</span>
          <ArrowDown aria-hidden className="size-5" />
        </div>
        <Box
          icon={ClipboardList}
          title="1. Levantamento de requisitos"
          items={["Analisa inputs (fluxo agêntico ou Projetos ChatGPT)", "Gera história de usuário estruturada"]}
          hil="Aprovação da US"
          plugin="requirements"
        />
        <Box
          icon={PenTool}
          tag="Opcional"
          title="Prototipação"
          items={["Protótipo / design system / UX (ex.: Claude Code/Paper)", "Em paralelo ao levantamento de requisitos"]}
          hil="Aprovação do protótipo"
        />
        <Box
          icon={ArrowRightLeft}
          tag="Entrada dedicada"
          title="Migração"
          items={[
            "O código do projeto legado é o próprio requisito",
            <>
              Fatia o projeto em funcionalidades, com um <Prd first /> para cada uma
            </>,
          ]}
          hil={
            <>
              Aprovação do <Prd />
            </>
          }
        />
      </div>

      <DownArrow>
        <Pill>História de usuário</Pill>
        <Pill>Protótipo (quando houver)</Pill>
        <Pill>
          <Prd /> (migração)
        </Pill>
      </DownArrow>

      <section aria-labelledby="esteira-integrada" className="rounded-3xl border border-border bg-muted/40 p-5 sm:p-6">
        <Badge variant="mono" className="whitespace-normal">
          1 dev · 1 funcionalidade · execução simultânea
        </Badge>
        <h2 id="esteira-integrada" className="mt-3 font-display text-heading font-bold">
          2. Implementação integrada
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 @2xl:grid-cols-3">
          <Box icon={Server} title="Backend" items={["Gera código com SDD"]} hil="Revisão de PR" />
          <Box
            icon={MonitorSmartphone}
            title="Frontend"
            items={[
              <>
                <b className="font-semibold text-foreground">Padrão:</b> gera React/Web do zero com SDD
              </>,
              <>
                <b className="font-semibold text-foreground">Designer:</b> parte do protótipo, remove mocks e conecta
              </>,
            ]}
            hil="Revisão de PR"
          />
          <Box
            icon={FlaskConical}
            title="Testes funcionais (QA)"
            items={[
              <>
                Gera testes E2E Playwright com SDD a partir da US / <Prd />
              </>,
            ]}
            hil="Revisão de PR"
            plugin="automation-bdd"
          />
        </div>
      </section>

      <DownArrow>
        <Pill>Funcionalidade implementada + suíte de testes</Pill>
      </DownArrow>

      <section aria-labelledby="esteira-final" className="mx-auto max-w-md rounded-2xl border-2 border-primary/30 bg-card p-6 text-center shadow-md">
        <div className="flex items-center justify-center gap-2.5">
          <Package aria-hidden className="size-5 text-link" />
          <h2 id="esteira-final" className="font-display text-body font-bold">
            3. Artefato final
          </h2>
        </div>
        <p className="mt-3 font-display text-heading font-bold text-balance">Versão pronta para propagação</p>
        <p className="mt-1 font-mono text-caption text-muted-foreground">Deploy-Ready Package</p>
      </section>

      <section aria-labelledby="esteira-apoio" className="!mt-12 rounded-2xl border border-border p-5">
        <h2 id="esteira-apoio" className="eyebrow">
          Serviços de apoio transversais
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 @xl:grid-cols-2 @3xl:grid-cols-4">
          {SUPPORT.map(([Icon, name, desc, plugin]) => (
            <li key={name} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5">
              <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="flex flex-col gap-1.5">
                <span>
                  <span className="block text-small font-semibold">{name}</span>
                  <span className="block text-caption text-muted-foreground">{desc}</span>
                </span>
                {plugin && <StagePlugin name={plugin} />}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-3 pt-2 text-small text-muted-foreground @2xl:flex-row @2xl:items-center @2xl:justify-between">
        <p className="flex flex-wrap items-center gap-2">
          <Hil>Human-in-the-Loop</Hil>
          <span>= ponto de controle e aprovação humana (presente em todas as etapas)</span>
        </p>
        <p className="italic">Conceito de inteligência agêntica aplicada ao desenvolvimento</p>
      </div>
    </div>
  );
}
