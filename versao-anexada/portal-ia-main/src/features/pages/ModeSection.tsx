import { ModeBadge } from "@/components/ModeBadge";
import { code } from "./code";

export function ModeSection() {
  return (
      <section className="mt-16" aria-labelledby="sozinha-ou-manual">
        <h2 id="sozinha-ou-manual" className="font-display text-heading font-bold">
          Dispara sozinha ou só manual?
        </h2>
        <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt>
              <ModeBadge manual={false} />
            </dt>
            <dd className="mt-2 text-small leading-relaxed text-muted-foreground">
              O Claude usa quando o seu pedido combina com a skill. Também dá para chamar pela barra.
            </dd>
          </div>
          <div>
            <dt>
              <ModeBadge manual />
            </dt>
            <dd className="mt-2 text-small leading-relaxed text-muted-foreground">
              Só roda quando alguém chama pela barra, como <code className={code}>/automation-bdd:pg-setup-automation</code>. É o
              caso do que configura o projeto, traz coisa em lote ou é difícil de desfazer.
            </dd>
          </div>
        </dl>
      </section>
  );
}
