import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Container } from "@/components/ui/container";
import { Term } from "@/components/Term";
import { findPlugin } from "@/data/catalog-index";
import { pluginInstall } from "@/lib/commands";
import { TaskRows } from "@/components/beautiful-ui/TaskRows";
import { TerminalDemo } from "./TerminalDemo";
import { ChatPreview } from "./ChatPreview";
import { DEMO_PLUGIN } from "./demo-plugin";
import { TerminalPreview } from "./TerminalPreview";
import { cn } from "@/lib/utils";

const demoCount = findPlugin(DEMO_PLUGIN)?.skills.length;

const steps = [
  {
    title: (
      <>
        Adicione o <Term id="marketplace">marketplace</Term>
      </>
    ),
    text: (
      <>
        Uma vez só, no Claude Code, com a{" "}
        <Link
          to="/primeiros-passos"
          hash="credencial"
          className="link"
        >
          credencial do GitLab salva no git
        </Link>
        : sem ela, o comando falha. Depois disso, ele conhece todos os plugins da Pitang.
      </>
    ),
    preview: <TerminalDemo />,
  },
  {
    title: "Instale o plugin da sua área",
    text: "Cada plugin traz as skills de um tema, e as descrições delas entram em toda sessão. Instale os que você vai usar.",
    preview: <TerminalPreview command={pluginInstall(DEMO_PLUGIN)} result={`${DEMO_PLUGIN} instalado${demoCount === undefined ? "" : ` · ${demoCount} skills`}`} />,
  },
  {
    title: "Peça em português",
    text: "Não precisa decorar comando. Quando o pedido combina com uma skill, o Claude usa a skill.",
    preview: <ChatPreview />,
  },
];

export function HowItWorks({ compact = false }: { compact?: boolean }) {
  return (
    <section className={cn(!compact && "mt-14 sm:mt-16")} aria-labelledby="como-title">
      <Container>
        <SectionHeading
          id="como-title"
          title="Instale uma vez. Depois, é só pedir."
          description="Três passos, e só os dois primeiros têm comando. Dá para copiar e colar."
          action={
            <Link to="/primeiros-passos" className="inline-flex items-center gap-1.5 text-small font-semibold link-text">
              Nunca usou o Claude Code? Veja o passo a passo
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <TaskRows items={steps.map((step) => ({
          title: typeof step.title === "string" ? step.title : "Adicione o marketplace",
          content: <div className="grid gap-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]"><p className="text-small leading-relaxed text-muted-foreground">{step.text}</p><div className="min-w-0">{step.preview}</div></div>,
        }))} />
      </Container>
    </section>
  );
}
