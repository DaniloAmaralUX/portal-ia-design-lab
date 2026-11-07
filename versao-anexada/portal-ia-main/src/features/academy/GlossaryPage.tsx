import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Crumb } from "@/components/Crumb";
import { GLOSSARY } from "@/data/glossary";

export function GlossaryPage() {
  const letters = [...new Set(GLOSSARY.map((e) => e.name.charAt(0).toUpperCase()))];
  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[
          <Crumb key="a" to="/academy">
            Academy
          </Crumb>,
          <span key="c">Antes de começar</span>,
        ]}
      />
      <h1 className="mt-6 font-display text-headline font-bold">Glossário</h1>
      <p className="mt-3 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty">
        Os termos e as siglas que o site e os guias do Método usam. Nas páginas, a palavra com sublinhado pontilhado mostra a
        explicação num balão.
      </p>
      <nav aria-label="Letras do glossário" className="mt-8 flex flex-wrap gap-1.5">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letra-${letter}`}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card font-mono text-small transition-colors hover:border-foreground/20 hover:bg-accent"
          >
            {letter}
          </a>
        ))}
      </nav>
      <div className="mt-10 space-y-10">
        {letters.map((letter) => (
          <section key={letter} aria-labelledby={`letra-${letter}`}>
            <h2 id={`letra-${letter}`} className="border-b border-border pb-2 font-display text-heading font-bold">
              {letter}
            </h2>
            <dl className="mt-4 space-y-5">
              {GLOSSARY.filter((e) => e.name.charAt(0).toUpperCase() === letter).map((e) => (
                <div key={e.anchor} id={e.anchor}>
                  <dt className="text-body font-semibold text-foreground">{e.name}</dt>
                  <dd className="mt-1 max-w-measure text-body leading-relaxed text-foreground/85">{e.explanation}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
