import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Container } from "@/components/ui/container";
import { Term } from "@/components/Term";
import { catalogPlugins, findPlugin } from "@/data/catalog-index";
import { marketplaceAdd, pluginInstall } from "@/lib/commands";
import { cn } from "@/lib/utils";
import { ChatPreview } from "./ChatPreview";
import { DEMO_PLUGIN } from "./demo-plugin";
import { TerminalPreview } from "./TerminalPreview";

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
    preview: <TerminalPreview command={marketplaceAdd} result={`Marketplace pitang adicionado · ${catalogPlugins.length} plugins`} />,
  },
  {
    title: "Instale o plugin da sua área",
    text: "Cada plugin traz as skills de um tema, e as descrições delas entram em toda sessão. Instale os que você vai usar.",
    preview: <TerminalPreview command={pluginInstall(DEMO_PLUGIN)} result={findPlugin(DEMO_PLUGIN) ? `${DEMO_PLUGIN} instalado · ${findPlugin(DEMO_PLUGIN)?.skills.length} skills` : `${DEMO_PLUGIN} instalado`} />,
  },
  {
    title: "Peça em português",
    text: "Não precisa decorar comando. Quando o pedido combina com uma skill, o Claude usa a skill.",
    preview: <ChatPreview />,
  },
];

export function HowItWorks() {
  return (
    <section className="mt-24 sm:mt-28" aria-labelledby="como-title">
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
        <ol className="reveal-children mt-12">
          {steps.map((step, i) => {
            const last = i === steps.length - 1;
            return (
              <li
                key={i}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 lg:grid-cols-[2.5rem_minmax(0,0.6fr)_minmax(0,1.6fr)] lg:gap-x-6"
              >
                <div className="row-span-2 flex flex-col items-center lg:row-span-1">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground font-display text-small font-bold tabular-nums text-background lg:size-10">
                    {i + 1}
                  </span>
                  {!last && <span aria-hidden className="mt-2 w-px flex-1 bg-border" />}
                </div>
                <div className="pt-1 lg:pt-2">
                  <h3 className="font-display text-heading font-bold">{step.title}</h3>
                  <p className="mt-2 max-w-md text-small leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
                <div className={cn("mt-5 lg:mt-0", !last && "pb-12 lg:pb-14")}>
                  <div className="rounded-2xl bg-muted/60 p-2.5">
                    {step.preview}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
