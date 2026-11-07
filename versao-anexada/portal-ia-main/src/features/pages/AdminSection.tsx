import type { ReactNode } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { MARKETPLACE_CHANNEL, MARKETPLACE_URL } from "@/data/catalog-index";
import { managedSettingsWithAllowlist } from "@/lib/commands";
import { code } from "./code";

const C = ({ children }: { children: ReactNode }) => <code className={code}>{children}</code>;
const item = "text-small leading-relaxed text-muted-foreground";

// The text follows the README of the skills repository, which has the same JSON; the sections of the Claude Code docs stay in parentheses.
export function AdminSection() {
  const host = new URL(MARKETPLACE_URL).hostname;
  return (
    <section id="administrar" className="mt-16" aria-labelledby="para-quem-administra">
      <h2 id="para-quem-administra" className="font-display text-heading font-bold">
        Para quem administra o Claude Code na empresa
      </h2>
      <p className="mt-3 max-w-measure text-body leading-relaxed text-muted-foreground">
        Quem tem o papel de Owner no Claude da Pitang abre <C>Organization settings</C> &gt; <C>Claude Code</C> &gt; <C>Managed settings</C> (no
        plano Team, vale para todos os membros) e cola um JSON só. O que fica fora do bloco opcional registra o marketplace e liga as sugestões.
        As três linhas do bloco opcional (a entrada <C>claude-plugins-official</C>, o <C>strictKnownMarketplaces</C> e o{" "}
        <C>disableSideloadFlags</C>) são a lista de permissão, e o Owner apaga as três juntas se não quiser a lista.
      </p>
      <CodeBlock code={managedSettingsWithAllowlist()} language="json" className="mt-5" name="Copiar a configuração gerenciada" />

      <h3 className="mt-10 font-display text-subheading font-semibold">O que cada parte faz</h3>
      <p className="mt-2 max-w-measure text-small text-muted-foreground">Com a seção da doc do Claude Code em que ela está.</p>
      <ul className="mt-3 max-w-measure list-disc space-y-2 pl-5">
        <li className={item}>
          O <C>ref: {MARKETPLACE_CHANNEL}</C> aponta para a última release. Só a release move esse branch.
        </li>
        <li className={item}>
          O <C>autoUpdate: true</C> deixa o Claude Code atualizar o marketplace e os plugins em segundo plano. Num GitLab privado isso só roda
          com a credencial salva ou o SSH, e a versão nova vale na sessão seguinte (plugins/org, &quot;Set update policy&quot;, e
          plugins/host-marketplace, &quot;Grant access to a private marketplace&quot;).
        </li>
        <li className={item}>
          O <C>pluginSuggestionMarketplaces</C> liga as sugestões. Sem ele, o bloco <C>relevance</C> que os plugins trazem não faz nada, porque a
          pessoa só vê sugestão de um marketplace que o Owner lista aí e cuja origem a mesma managed settings declara. Sugestão não instala nada: o
          Claude Code mostra o comando, e a pessoa confirma. Por isso ela não fere a decisão de não obrigar plugin (plugins/relevance,
          &quot;Enable suggestions in managed settings&quot;).
        </li>
        <li className={item}>
          O <C>pluginTrustMessage</C> entra no aviso que o <C>/plugin</C> mostra antes de instalar um plugin (plugins/org, &quot;Control
          matrix&quot;).
        </li>
        <li className={item}>
          Esta managed settings só registra o marketplace, e cada pessoa instala os plugins que quer pelos comandos desta página. Ela não leva{" "}
          <C>enabledPlugins</C> porque um <C>enabledPlugins</C> gerenciado obriga o plugin e a pessoa não consegue desligá-lo (plugins/org,
          &quot;Require a marketplace and its plugins&quot;). Enquanto todo plugin está em <C>experimental</C>, ninguém é obrigado a usar nenhum.
          Um plugin em <C>supported</C> entra com <C>&quot;enabledPlugins&quot;: {"{"} &quot;&lt;plugin&gt;@pitang&quot;: true {"}"}</C> no mesmo
          documento, e o Owner decide plugin por plugin.
        </li>
      </ul>

      <h3 className="mt-10 font-display text-subheading font-semibold">O bloco opcional: só os marketplaces que a Pitang aprova</h3>
      <p className="mt-3 max-w-measure text-body leading-relaxed text-muted-foreground">
        Decisão de segurança da Pitang. Com ele, o Claude Code só adiciona marketplace do GitLab da Pitang e o oficial da Anthropic (plugins/org,
        &quot;Allowlist with strictKnownMarketplaces&quot;).
      </p>
      <ul className="mt-3 max-w-measure list-disc space-y-2 pl-5">
        <li className={item}>
          O <C>hostPattern</C> <C>{`^${host.replaceAll(".", "\\\\.")}$`}</C> admite <strong>qualquer</strong> repositório de <C>{host}</C>, e não só este: quem cria um
          marketplace em qualquer projeto do GitLab da Pitang passa na lista. Para limitar a este repositório, troque a linha por{" "}
          <C>{`{ "source": "git", "url": "${MARKETPLACE_URL}", "ref": "${MARKETPLACE_CHANNEL}" }`}</C>. Essa entrada casa só com essa URL escrita assim e
          com esse <C>ref</C>: a URL, o <C>ref</C> e o <C>path</C> precisam coincidir, e uma entrada sem <C>ref</C> não cobre uma origem com{" "}
          <C>ref: &quot;{MARKETPLACE_CHANNEL}&quot;</C> (plugins/org, &quot;How entries match&quot;).
        </li>
        <li className={item}>
          Com a lista ligada, o <C>claude-plugins-official</C> entra também em <C>extraKnownMarketplaces</C>, como no JSON acima. A lista não
          registra nada: quem registra é a entrada de <C>extraKnownMarketplaces</C>, e a entrada só vale se a origem passar na lista (plugins/org,
          &quot;Allow the official marketplace and your own&quot;).
        </li>
        <li className={item}>
          Sem a linha <C>skills-dir</C>, os plugins que a pessoa mantém em <C>~/.claude/skills/</C> param de carregar: as pastas com{" "}
          <C>.claude-plugin/plugin.json</C>, como o .zip de um plugin baixado deste portal. A skill solta, só com <C>SKILL.md</C>, segue carregando
          (plugins/org, &quot;Keep skills-directory plugins loading&quot;).
        </li>
        <li className={item}>
          O <C>disableSideloadFlags</C> faz o Claude Code recusar, na subida, o <C>--plugin-dir</C>, o <C>--plugin-url</C>, o <C>--agents</C>, a opção{" "}
          <C>plugins</C> do Agent SDK, o <C>--mcp-config</C> fora do SDK e as pastas da variável <C>CLAUDE_CODE_PLUGIN_DIRS</C>. Isso desliga o
          caminho do .zip com <C>--plugin-dir</C> que as páginas dos plugins ensinam, e também o <C>--mcp-config</C> de quem não usa plugin nenhum.
          Ele não restringe o <C>.mcp.json</C>, o <C>claude mcp add</C> nem os servidores do SDK: para isso, o <C>allowedMcpServers</C> (plugins/org,
          &quot;Control matrix&quot;).
        </li>
        <li className={item}>
          Vale para todo membro e bloqueia qualquer outro marketplace, inclusive o que a pessoa já adicionou antes (plugins/org, &quot;Restrict what
          users can install&quot;).
        </li>
      </ul>

      <h3 className="mt-10 font-display text-subheading font-semibold">O que a managed settings do admin não alcança</h3>
      <ul className="mt-3 max-w-measure list-disc space-y-2 pl-5">
        <li className={item}>
          <strong>Quem usa Bedrock, Vertex ou um <C>ANTHROPIC_BASE_URL</C> próprio.</strong> A managed settings do servidor, a do admin do Claude, exige
          conexão direta com <C>api.anthropic.com</C> e um login de Team ou Enterprise. Com uma variável <C>CLAUDE_CODE_USE_*</C> ou um{" "}
          <C>ANTHROPIC_BASE_URL</C> diferente do padrão, o Claude Code pula a busca, e nada daqui chega (server-managed-settings, &quot;Platform
          availability&quot; e &quot;Security considerations&quot;). Para essas pessoas, a política vai pelo caminho da máquina, por MDM ou por um{" "}
          <C>managed-settings.json</C>, ou elas seguem o comando e o trecho do projeto.
        </li>
        <li className={item}>
          <strong>O trecho do <C>.claude/settings.json</C> do projeto não liga o <C>autoUpdate</C>.</strong> A atualização em segundo plano vem
          desligada, e quem liga é a pessoa, em <strong>Marketplaces</strong> no <C>/plugin</C> (&quot;Enable auto-update&quot;), ou o Owner, na managed
          settings acima (plugins/host-marketplace, &quot;Turn on auto-update&quot;). Por isso o trecho do projeto não leva essa chave, e quem quer
          atualização automática liga na mão.
        </li>
      </ul>

      <p className="mt-5 max-w-measure text-small leading-relaxed text-muted-foreground">
        Cada pessoa recebe isso na próxima sessão do Claude Code. O repositório é privado: cada pessoa ainda precisa da credencial do GitLab salva
        (passo 2). O formato está no{" "}
        <a href="https://code.claude.com/docs/en/plugins/org" target="_blank" rel="noreferrer" className="link">
          guia de plugins para organizações
        </a>
        , na documentação do Claude Code.
      </p>
    </section>
  );
}
