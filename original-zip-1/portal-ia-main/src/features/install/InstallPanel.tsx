import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { CommandLine } from "@/components/CommandLine";
import { Term } from "@/components/Term";
import { Disclosure } from "@/components/ui/disclosure";
import { MARKETPLACE_CHANNEL } from "@/data/catalog-index";
import type { Plugin, Skill } from "@/data/types";
import {
  cliMarketplaceAdd,
  cliPluginInstall,
  invokeFromPlugin,
  managedSettings,
  marketplaceAdd,
  pluginInstall,
  teamSettings,
} from "@/lib/commands";
import { pluginZip } from "./downloads";
import { commandCodeClass, noteClass } from "./install-classes";
import { InstallStep } from "./InstallStep";
import { PluginZip } from "./PluginZip";
import { SkillZip } from "./SkillZip";

export function InstallPanel({ plugin, skill }: { plugin: Plugin; skill?: Skill }) {
  const zip = pluginZip(plugin);
  return (
    <div className="space-y-4">
      <p className={noteClass}>
        Antes do primeiro comando,{" "}
        <Link to="/primeiros-passos" hash="credencial" className="link">
          salve a credencial do GitLab no git
        </Link>
        : sem ela, instalar e atualizar falham.
      </p>
      <ol className="space-y-5">
        <InstallStep
          n={1}
          title={
            <>
              Adicione o <Term id="marketplace">marketplace</Term> da Pitang, no canal estável. É uma vez só.
            </>
          }
        >
          <CommandLine command={marketplaceAdd} />
        </InstallStep>
        <InstallStep n={2} title={`Instale o plugin ${plugin.name}.`}>
          <CommandLine command={pluginInstall(plugin.name)} />
        </InstallStep>
        {skill && (
          <InstallStep n={3} title={skill.manual ? "Chame pela barra." : "Peça em português, ou chame direto pela barra."}>
            <CommandLine command={invokeFromPlugin(skill)} prompt="›" />
          </InstallStep>
        )}
      </ol>
      <p className={noteClass}>
        Os comandos vão numa sessão do Claude Code, no terminal ou no app Desktop. A sessão na nuvem (Claude Code na web, ou o
        Desktop em modo Cloud) não atende projeto do GitLab. Para atualizar ou desinstalar, veja{" "}
        <Link to="/primeiros-passos" hash="atualizar" className="link">
          os Primeiros passos
        </Link>
        .
      </p>
      <div className="border-b border-border">
        <Disclosure title="Pelo terminal">
          <CommandLine command={cliMarketplaceAdd} prompt="$" />
          <CommandLine command={cliPluginInstall(plugin.name)} prompt="$" />
        </Disclosure>
        <Disclosure title="Para o time do projeto">
          <p className={noteClass}>
            Commite no <code className={commandCodeClass}>.claude/settings.json</code> do projeto. Cada colega recebe o plugin quando confia na
            pasta, e a <code className={commandCodeClass}>ref</code> <code className={commandCodeClass}>{MARKETPLACE_CHANNEL}</code> aponta para a última release.
          </p>
          <CodeBlock code={teamSettings(plugin.name)} language="json" />
          <Link to="/plugins" search={{ kit: plugin.name }} hash="kit" className={`inline-flex items-center gap-1 text-small link`}>
            Montar o kit com outros plugins
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </Disclosure>
        <Disclosure title="Para a organização, na managed settings">
          <p className={noteClass}>
            Quem tem o papel de Owner no Claude da Pitang cola em <code className={commandCodeClass}>Organization settings</code>,{" "}
            <code className={commandCodeClass}>Claude Code</code>, <code className={commandCodeClass}>Managed settings</code>. O marketplace entra no canal
            estável, com a atualização automática ligada, e cada pessoa instala o plugin pelos comandos acima: o trecho não liga
            plugin nenhum, porque um plugin ligado pela organização ninguém consegue desligar.
          </p>
          <CodeBlock code={managedSettings()} language="json" name="Copiar o trecho da managed settings" />
        </Disclosure>
        <Disclosure title="Pelo .zip, sem o marketplace">
          <PluginZip plugin={plugin} />
          <p className={noteClass}>Para abrir só numa sessão, com o .zip já baixado:</p>
          <CommandLine command={`claude --plugin-dir ~/Downloads/${zip.name}`} prompt="$" />
        </Disclosure>
        {skill && (
          <Disclosure title="Só esta skill">
            <SkillZip skill={skill} plugin={plugin} />
          </Disclosure>
        )}
      </div>
    </div>
  );
}
