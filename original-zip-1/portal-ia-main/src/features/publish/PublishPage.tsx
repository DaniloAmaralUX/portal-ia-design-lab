import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PublishShell } from "./PublishShell";

const card =
  "group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function PublishPage() {
  return (
    <PublishShell title="Publicar no Academy" lead="Cada formulário gera o arquivo de um intervalo técnico ou de uma aula, no formato que o portal publica.">
      <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <Link to="/publicar/intervalo-tecnico" className={card}>
            <span className="font-display text-heading font-bold">Intervalo técnico</span>
            <span className="mt-2 text-small leading-relaxed text-muted-foreground">Uma gravação com o texto dela, em Intervalos técnicos.</span>
            <ArrowRight aria-hidden className="mt-4 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
        <li>
          <Link to="/publicar/treinamento" className={card}>
            <span className="font-display text-heading font-bold">Aula de treinamento</span>
            <span className="mt-2 text-small leading-relaxed text-muted-foreground">A próxima aula de um treinamento, ou a primeira de um treinamento novo.</span>
            <ArrowRight aria-hidden className="mt-4 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      </ul>
    </PublishShell>
  );
}
