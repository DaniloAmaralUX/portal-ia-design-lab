import { Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { MARKETPLACE_CHANNEL } from "@/data/catalog-index";
import { teamSettings } from "@/lib/commands";
import { code } from "./code";

export function TeamSection() {
  return (
      <section id="time" className="mt-16" aria-labelledby="para-o-time">
        <h2 id="para-o-time" className="font-display text-heading font-bold">
          Para o time inteiro de um projeto
        </h2>
        <p className="mt-3 max-w-measure text-body leading-relaxed text-muted-foreground">
          Commite este trecho no <code className={code}>.claude/settings.json</code> do projeto. Cada colega recebe o plugin quando
          confia na pasta, e a <code className={code}>ref</code> <code className={code}>{MARKETPLACE_CHANNEL}</code> aponta para a última release.
          Para vários plugins de uma vez, monte o kit na{" "}
          <Link to="/plugins" hash="kit" className="link">
            página de plugins
          </Link>
          .
        </p>
        <CodeBlock code={teamSettings("pr-review")} language="json" className="mt-5" name="Copiar o trecho do settings.json do projeto" />
        <p className="mt-5 max-w-measure text-body leading-relaxed text-muted-foreground">
          Cada colega atualiza como em Atualizar, acima. Para o time ficar numa versão só, troque a <code className={code}>ref</code>{" "}
          por uma tag, como <code className={code}>v1.0.0</code>, e troque pela tag nova quando quiser mudar. Para tirar o plugin do
          projeto, apague a linha dele do <code className={code}>enabledPlugins</code> e commite.
        </p>
      </section>
  );
}
