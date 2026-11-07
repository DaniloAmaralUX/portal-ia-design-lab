import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, TriangleAlert } from "lucide-react";
import { AreaDot } from "@/components/AreaDot";
import { CommandLine } from "@/components/CommandLine";
import { ExamplePrompt } from "@/components/ExamplePrompt";
import { Notice } from "@/components/Notice";
import { areas } from "@/data/areas";
import { findPlugin, pluginsOfArea } from "@/data/catalog-index";
import { marketplaceAdd, pluginInstall } from "@/lib/commands";
import { Step } from "./Step";

export function GettingStartedSteps() {
  return (
    <>
      <h2 id="passo-a-passo" className="mt-16 font-display text-heading font-bold">
        Passo a passo
      </h2>
      <ol className="mt-8">
        <Step n={1} title="Tenha o Claude Code">
          <p>
            Ele roda no terminal, no app para desktop e nas extensões de IDE, como a do VS Code, numa sessão local: todos leem os mesmos
            arquivos de configuração, então recebem o mesmo marketplace. O plugin do JetBrains abre o terminal na IDE. A sessão na
            nuvem (Claude Code na web, ou o Desktop em modo Cloud) não atende projeto do GitLab. Se você ainda não tem acesso, fale com o time de Plataforma.
          </p>
          <a href="https://code.claude.com/docs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 link">
            Documentação do Claude Code
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </Step>
        <Step n={2} id="credencial" title="Salve a credencial do GitLab">
          <p>
            O marketplace mora no GitLab da Pitang. Salve a sua credencial no git: no Keychain, no macOS, ou no Git Credential Manager,
            no Windows. Uma chave SSH no agente também serve.
          </p>
          <Notice icon={TriangleAlert} className="max-w-measure">
            <p>
              O Claude Code nunca pede a senha do GitLab. Sem a credencial salva, instalar e atualizar falham, porque o git não tem
              com que entrar no repositório.
            </p>
          </Notice>
        </Step>
        <Step n={3} title="Adicione o marketplace">
          <p>No Claude Code, cole o comando abaixo. É uma vez só, por máquina.</p>
          <CommandLine command={marketplaceAdd} />
        </Step>
        <Step n={4} title="Instale o plugin da sua área">
          <p>Troque o nome do plugin pelo que resolve o seu caso. Não sabe qual? Comece pela sua área:</p>
          <ul className="grid gap-2 sm:grid-cols-3">
            {areas.map((area) => (
              <li key={area.id}>
                <Link
                  to="/explorar"
                  search={{ area: area.id }}
                  className="flex h-full flex-col gap-1 rounded-xl border border-border bg-card px-3.5 py-2.5 transition-colors hover:border-foreground/20"
                >
                  <span className="flex items-center gap-2 text-small font-medium text-foreground">
                    <AreaDot area={area.id} />
                    {area.name}
                  </span>
                  <span className="font-mono text-micro text-muted-foreground">
                    {pluginsOfArea(area.id).map((p, i) => (
                      <Fragment key={p}>
                        {i > 0 && ", "}
                        <span>{findPlugin(p)?.name}</span>
                      </Fragment>
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <CommandLine command={pluginInstall("pr-review")} />
        </Step>
        <Step n={5} title="Peça em português" last>
          <p>Não precisa decorar nada. Quando o pedido combina com uma skill, o Claude usa a skill.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ExamplePrompt text="Revise a segurança deste PR" />
            <ExamplePrompt text="Transforme esta ata em histórias de usuário" />
          </div>
        </Step>
      </ol>
    </>
  );
}
