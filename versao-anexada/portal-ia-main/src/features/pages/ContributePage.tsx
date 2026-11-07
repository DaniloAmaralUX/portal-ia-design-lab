import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandArcs } from "@/components/BrandArcs";
import { CommandLine } from "@/components/CommandLine";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CONTRIBUTING_URL, curation, questions, standard } from "./contribute-content";

export function ContributePage() {
  return (
    <Container className="pb-8 pt-10 sm:pt-14">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-terminal-border bg-terminal px-6 py-12 text-terminal-foreground shadow-lg sm:px-12 sm:py-14">
        <BrandArcs className="pointer-events-none absolute -bottom-48 right-6 hidden w-[460px] opacity-90 lg:block" />
        <div className="relative max-w-xl">
          <h1 className="font-display text-title font-extrabold text-balance">
            Tem uma tarefa que o seu time repete toda semana? Ela pode virar skill.
          </h1>
          <p className="mt-4 text-body leading-relaxed text-terminal-foreground">
            A <span className="font-mono">pg-escrever-skill</span> cria a skill no padrão da casa e testa o trabalho com e sem ela,
            antes de você abrir o MR.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/plugins/$plugin/$skill" params={{ plugin: "engineering-practices", skill: "pg-escrever-skill" }}>
                Criar uma skill
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-terminal-muted/65 bg-terminal text-terminal-foreground hover:border-terminal-foreground/80 hover:bg-terminal-foreground/5"
            >
              <a href={CONTRIBUTING_URL} target="_blank" rel="noreferrer">
                Ler o CONTRIBUTING
                <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2">
        <section aria-labelledby="que-tipo">
          <h2 id="que-tipo" className="font-display text-headline font-bold">
            Skill, rule, agente ou plugin?
          </h2>
          <p className="mt-3 max-w-measure text-body leading-relaxed text-muted-foreground">
            Cinco perguntas, na ordem. O primeiro sim decide. Plugin é a embalagem que leva skills, agentes, hooks e MCP juntos,
            e não um tipo.
          </p>
          <ol className="mt-6 space-y-4">
            {questions.map(([question, response], i) => (
              <li key={question} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3">
                <span className="tabular mt-0.5 inline-flex size-7 items-center justify-center rounded-full border border-border bg-card font-mono text-micro font-semibold">
                  {i + 1}
                </span>
                <div>
                  <p className="text-body font-medium text-foreground">{question}</p>
                  <p className="text-small text-muted-foreground">{response}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="do-rascunho">
          <h2 id="do-rascunho" className="font-display text-headline font-bold">
            Do rascunho ao MR
          </h2>
          <ol className="mt-6 space-y-6">
            <li>
              <p className="text-body font-medium">1. Crie ou altere pela skill da casa.</p>
              <p className="mt-1 text-small text-muted-foreground">Toda skill nova ou alterada passa por ela.</p>
              <CommandLine command="/engineering-practices:pg-escrever-skill" className="mt-3" />
            </li>
            <li>
              <p className="text-body font-medium">2. Rode o validador do acervo.</p>
              <p className="mt-1 text-small text-muted-foreground">É o mesmo comando do CI, e precisa sair verde.</p>
              <CommandLine command="npm test" prompt="$" className="mt-3" />
            </li>
            <li>
              <p className="text-body font-medium">3. Varra o dado sensível.</p>
              <p className="mt-1 max-w-measure text-small text-muted-foreground">
                No acervo, commitar é publicar: quem instala recebe a pasta inteira, e o histórico guarda o que vazou. O passo a
                passo está no CLAUDE.md do repositório.
              </p>
            </li>
            <li>
              <p className="text-body font-medium">4. Abra o MR com a evidência.</p>
              <p className="mt-1 max-w-measure text-small text-muted-foreground">
                O resumo do eval com e sem a skill, a versão do plugin subida com a linha no CHANGELOG e o resultado da varredura.
              </p>
              <CommandLine command="claude plugin eval plugins/<plugin>" prompt="$" className="mt-3" />
            </li>
          </ol>
        </section>

        <section aria-labelledby="padrao">
          <h2 id="padrao" className="font-display text-headline font-bold">
            O padrão da casa
          </h2>
          <ul className="mt-6 max-w-measure list-disc space-y-2 pl-5 text-body leading-relaxed text-foreground/85 marker:text-muted-foreground">
            {standard.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <p className="mt-4 text-small text-muted-foreground">
            O detalhe e as exceções estão no{" "}
            <a href={CONTRIBUTING_URL} target="_blank" rel="noreferrer" className="link">
              CONTRIBUTING.md
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="curadoria">
          <h2 id="curadoria" className="font-display text-headline font-bold">
            O que a curadoria olha
          </h2>
          <dl className="mt-6 space-y-4">
            {curation.map(([question, criterion]) => (
              <div key={question}>
                <dt className="text-body font-medium">{question}</dt>
                <dd className="max-w-measure text-small leading-relaxed text-muted-foreground">{criterion}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <Card id="pedir" className="mt-16 p-6 sm:p-8">
        <h2 className="font-display text-heading font-bold">Pedir uma skill</h2>
        <p className="mt-2 max-w-measure text-body leading-relaxed text-muted-foreground">
          Não achou a skill que resolve? Conte ao Pitang Labs qual tarefa se repete, em que time e onde ela dói. Quem cria
          a skill parte desse relato.
        </p>
        <Link
          to="/manifesto"
          hash="contato"
          className="mt-4 inline-flex items-center gap-1 text-small link"
        >
          Falar com o Pitang Labs
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </Card>
    </Container>
  );
}
