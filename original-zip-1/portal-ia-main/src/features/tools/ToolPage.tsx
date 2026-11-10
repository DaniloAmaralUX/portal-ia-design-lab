import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Compass, LifeBuoy, MessagesSquare, Play, Stethoscope, type LucideIcon } from "lucide-react";
import { ReadMark } from "@/components/ReadMark";
import { TOOLKIT_CARDS } from "@/data/catalyst-toolkit";
import type { Guide } from "@/data/guides";
import { useReadChapters } from "@/hooks/use-read-chapters";
import { CatalystCycle } from "@/features/method";
import type { ChapterMeta } from "@/lib/guide-text";
import { ToolHero } from "./ToolHero";

const ICON: Record<string, LucideIcon> = {
  "o-que-faz": Compass,
  "primeiro-uso": Play,
  doctor: Stethoscope,
  init: MessagesSquare,
  problemas: LifeBuoy,
};

const KEPT = [
  "A revisão com IA só começa depois do seu enter, e a tela mostra quanto ela custou.",
  "O init só grava os arquivos que você marcar e não faz commit: a mudança espera a sua revisão.",
  "O Claude Code trabalha num sandbox, sem escrever no projeto e sem ler os arquivos com segredo.",
];

const SYSTEMS = ["macOS", "Linux", "Windows, pelo WSL2", "Claude Code"];

// A section of the page, as in a manual: the name on the left, in small capitals, and what it says on the right.
function Row({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-3 border-t border-border py-8 @2xl:grid-cols-[9rem_minmax(0,1fr)] @2xl:gap-8">
      <h2 id={id} className="eyebrow pt-1 text-brand-red-ink">
        {label}
      </h2>
      <div className="min-w-0 text-body leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

// The page of a tool of the house, its showcase in the portal: the top with the install, and then, as in a manual, what it does, how
// it works, what stays with you, where it runs and the guide, a card per chapter.
export function ToolPage({ guide, chapters }: { guide: Guide; chapters: ChapterMeta[] }) {
  const { readIds } = useReadChapters();
  const minutes = new Map(chapters.map((c) => [c.id, c.minutes]));
  return (
    <div>
      <ToolHero guide={guide} />

      <div className="reveal-children @container mx-auto mt-20 max-w-4xl sm:mt-28">
        <Row id="produto-faz" label="O que faz">
          <p className="max-w-measure text-pretty">
            Um agente de IA só acerta o que encontra escrito. Quando o projeto não diz como se constrói, como se testa ou o que não pode
            mudar, o agente adivinha, e quem descobre o erro é quem revisa.
          </p>
          <p className="mt-3 max-w-measure text-pretty">
            O catalyst mede o seu projeto pelos sete requisitos do padrão AI-maintainable, da Pitang, e escreve com você o que falta. Ele
            usa o Claude Code da sua máquina, com o login que já é seu.
          </p>
        </Row>

        <Row id="produto-como" label="Como funciona">
          <CatalystCycle label="Ciclo: o doctor mede o projeto e monta o plano; o init prepara o que falta numa entrevista com você; o doctor mede de novo e mostra o que mudou" />
          <p className="mt-5 max-w-measure text-small text-muted-foreground text-pretty">
            O <code className="font-mono text-brand-red-ink">catalyst</code>, sem comando, abre a casa: o último diagnóstico do projeto e
            os dois comandos à mão.
          </p>
        </Row>

        <Row id="produto-voce" label="Fica com você">
          <ul className="grid max-w-measure gap-2.5">
            {KEPT.map((line) => (
              <li key={line} className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2 text-pretty">
                <span aria-hidden className="font-mono text-success">
                  ✓
                </span>
                {line}
              </li>
            ))}
          </ul>
        </Row>

        <Row id="produto-onde" label="Onde roda">
          <ul className="flex flex-wrap gap-2">
            {SYSTEMS.map((system) => (
              <li key={system} className="rounded-md border border-border px-2.5 py-1 font-mono text-caption text-foreground/85">
                {system}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-small text-muted-foreground">Precisa do Node 22 ou mais novo e do git.</p>
        </Row>

        <Row id="produto-guia" label="O guia">
          <ul className="grid grid-cols-1 gap-3 @lg:grid-cols-2">
            {TOOLKIT_CARDS.map((card) => {
              const Icon = ICON[card.chapter] ?? BookOpen;
              return (
                <li key={card.chapter}>
                  <Link
                    to="/ferramentas/$guide/$chapter"
                    params={{ guide: guide.slug, chapter: card.chapter }}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs interactive-surface"
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-muted text-foreground">
                      <Icon aria-hidden strokeWidth={1.75} className="size-4.5" />
                    </span>
                    <span className="mt-4 self-start font-display text-subheading font-bold">{card.title}</span>
                    <span className="mt-1.5 text-small leading-relaxed text-muted-foreground text-pretty">{card.text}</span>
                    <span className="mt-auto flex items-center justify-between gap-2 pt-5 text-caption font-medium text-foreground/85">
                      <span className="flex items-center gap-1.5">
                        ~{minutes.get(card.chapter) ?? 1} min
                        {readIds.has(`${guide.slug}/${card.chapter}`) && <ReadMark />}
                      </span>
                      <ArrowRight aria-hidden className="size-4 text-muted-foreground transition-transform duration-(--duration-base) group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Row>
      </div>
    </div>
  );
}
