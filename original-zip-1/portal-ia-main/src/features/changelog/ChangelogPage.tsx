import { Link } from "@tanstack/react-router";
import { RichText } from "@/components/RichText";
import { Container } from "@/components/ui/container";
import { releases } from "@/data/changelog";
import { RecentAcademySection } from "@/features/news";
import { formatDate } from "@/lib/utils";

export function ChangelogPage() {
  return (
    <>
      <Container className="pb-8 pt-10 sm:pt-14">
      <h1 className="font-display text-title font-extrabold">Novidades</h1>
      <p className="mt-4 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty">
        O que há de novo no catálogo de skills e na Academy. As novidades do catálogo vêm do CHANGELOG do repositório skills.
      </p>
      <p className="mt-3 max-w-2xl text-small leading-relaxed text-muted-foreground">
        Cada versão chega ao plugin quando você o atualiza, e a atualização automática vem desligada.{" "}
        <Link to="/primeiros-passos" hash="atualizar" className="link">
          Veja como atualizar e como ligá-la
        </Link>
        .
      </p>

      <ol className="mt-12 max-w-3xl space-y-14">
        {releases.map((version) => (
          <li key={version.version} aria-labelledby={`v-${version.version}`}>
            <h2 id={`v-${version.version}`} className="flex flex-wrap items-baseline gap-x-3 border-b border-border pb-3 font-display text-heading font-bold">
              Versão {version.version}
              {version.date && <span className="text-small font-normal text-muted-foreground">{formatDate(version.date)}</span>}
            </h2>
            <div className="mt-6 space-y-8">
              {version.sections.map((section) => (
                <section key={section.kind} aria-label={`${section.title} na versão ${version.version}`}>
                  <h3 className="eyebrow">{section.title}</h3>
                  <ul className="mt-3 max-w-measure list-disc space-y-2 pl-5 text-body leading-relaxed text-foreground/85 marker:text-muted-foreground">
                    {section.items.map((item) => (
                      <li key={item}>
                        <RichText text={item} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </li>
        ))}
      </ol>
      </Container>
      <RecentAcademySection className="mt-24 sm:mt-28" />
    </>
  );
}
