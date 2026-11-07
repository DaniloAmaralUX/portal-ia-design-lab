import { CommandLine } from "@/components/CommandLine";
import { Card } from "@/components/ui/card";
import {
  cliMarketplaceRemove,
  cliMarketplaceUpdate,
  cliPluginUninstall,
  cliPluginUpdate,
  marketplaceUpdate,
  pluginManage,
  pluginUninstall,
} from "@/lib/commands";
import { code } from "./code";

export function AfterInstall() {
  return (
      <section className="mt-16" aria-labelledby="depois-de-instalar">
        <h2 id="depois-de-instalar" className="font-display text-heading font-bold">
          Depois de instalar
        </h2>
        <p className="mt-3 max-w-measure text-body leading-relaxed text-muted-foreground">
          A página de cada plugin mostra a versão atual, e o <code className={code}>/plugin list</code> mostra a que você tem. Os
          comandos abaixo usam o pr-review. Troque pelo nome do seu plugin.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card id="atualizar" className="p-6">
            <h3 className="font-display text-subheading font-bold">Atualizar</h3>
            <div className="mt-3 space-y-3 text-body leading-relaxed text-muted-foreground">
              <p>
                A atualização automática vem desligada num marketplace de fora da Anthropic, como o da Pitang, e ligá-la é opcional.
                Para ligar, abra no <code className={code}>/plugin</code> a aba{" "}
                <strong className="font-semibold text-foreground">Marketplaces</strong>, escolha o pitang e ative{" "}
                <strong className="font-semibold text-foreground">Enable auto-update</strong>. Como o repositório é um GitLab
                privado, ela só roda em segundo plano com a credencial salva ou com o SSH; sem isso, atualize à mão.
              </p>
              <p className="pt-2 text-small">Para atualizar na hora, busque a lista nova do marketplace:</p>
              <CommandLine command={marketplaceUpdate} />
              <p>
                Depois, digite o comando abaixo, escolha o pr-review na lista e selecione{" "}
                <strong className="font-semibold text-foreground">Update now</strong>.
              </p>
              <CommandLine command={pluginManage} />
              <p className="pt-2 text-small">Pelo terminal, são dois comandos, nessa ordem:</p>
              <CommandLine command={cliMarketplaceUpdate} prompt="$" />
              <CommandLine command={cliPluginUpdate("pr-review")} prompt="$" />
            </div>
          </Card>
          <Card id="desinstalar" className="p-6">
            <h3 className="font-display text-subheading font-bold">Desinstalar</h3>
            <div className="mt-3 space-y-3 text-body leading-relaxed text-muted-foreground">
              <p>Digite o comando com o nome do plugin. As skills dele saem, e o marketplace continua adicionado.</p>
              <CommandLine command={pluginUninstall("pr-review")} />
              <p className="pt-2 text-small">Pelo terminal:</p>
              <CommandLine command={cliPluginUninstall("pr-review")} prompt="$" />
              <p className="pt-2 text-small">Para tirar também o marketplace, e com ele todos os plugins da Pitang:</p>
              <CommandLine command={cliMarketplaceRemove} prompt="$" />
            </div>
          </Card>
        </div>
      </section>
  );
}
