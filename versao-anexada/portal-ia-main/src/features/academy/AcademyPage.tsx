import { BookA, Languages, Sprout } from "lucide-react";
import { COURSES, getCourse, PLATFORMS, type Course } from "./courses";
import { CourseCard } from "./CourseCard";
import { LanguageNotice } from "./LanguageNotice";
import { PriorityLegend } from "./PriorityLegend";
import { RoleCard } from "./RoleCard";
import { Shortcut } from "./Shortcut";
import { Stat } from "./Stat";
import { sharedFundamentals } from "./training";
import { TrainingSources } from "./TrainingSources";
import { ROLES } from "@/data/roles";
import { useIntro } from "@/hooks/use-intro";
import { delay } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function AcademyPage() {
  useIntro();
  const fundamentals = sharedFundamentals()
    .map(getCourse)
    .filter((c): c is Course => Boolean(c));
  const intro = "animate-intro";
  return (
    <div className="max-w-4xl">
      <header>
        <p className={cn("eyebrow", intro)}>Academy · como a Pitang aprende IA</p>
        <h1 className={cn("mt-3 font-display text-title font-extrabold text-balance", intro)} style={delay(1)}>
          Trilhas de capacitação em IA
        </h1>
        <p className={cn("mt-4 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty", intro)} style={delay(2)}>
          Cada papel tem uma trilha montada com cursos gratuitos da Anthropic, da OpenAI e da Microsoft, em três fases: fundamentals,
          aplicação e aprofundamento. Escolha o seu papel, siga as etapas na ordem e comece pelos cursos essenciais.
        </p>
        <dl className={cn("mt-8 flex max-w-xl flex-wrap gap-px overflow-hidden rounded-2xl border border-border bg-border", intro)} style={delay(3)}>
          <Stat label="Trilhas por papel" value={ROLES.length} />
          <Stat label="Cursos gratuitos" value={COURSES.filter((c) => !c.exam).length} />
          <Stat label="Plataformas" value={PLATFORMS.length} />
        </dl>
        <div className={intro} style={delay(4)}>
          <LanguageNotice className="mt-6 max-w-xl" />
        </div>
      </header>

      <div className={intro} style={delay(4)}>
        <section aria-labelledby="trilhas" className="mt-14">
          <h2 id="trilhas" className="font-display text-heading font-bold">
            Escolha a sua trilha
          </h2>
          <p className="mt-1 max-w-measure text-small text-muted-foreground text-pretty">
            Cada trilha tem os cursos do papel nas três plataformas, o tempo de cada classificação e o porquê de cada curso. O cartão
            mostra os essenciais da Anthropic.
          </p>
          <ul className="reveal-children mt-5 grid grid-cols-1 gap-3 @2xl:grid-cols-3">
            {ROLES.map((role) => (
              <li key={role.area}>
                <RoleCard role={role} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="antes" className="mt-14">
          <h2 id="antes" className="font-display text-heading font-bold">
            Antes de começar
          </h2>
          <ul className="reveal-children mt-5 grid grid-cols-1 gap-3 @2xl:grid-cols-3">
            <li>
              <Shortcut to="/manifesto" icon={<Sprout className="size-5" />} title="Manifesto" isRead="manifesto">
                Por que a Pitang adota IA agora, e como pedir ajuda ao Pitang Labs.
              </Shortcut>
            </li>
            <li>
              <Shortcut to="/academy/em-portugues" icon={<Languages className="size-5" />} title="Estudar em português" isRead="em-portugues">
                Legenda nos vídeos e tradução da página inteira, no Chrome e no Edge.
              </Shortcut>
            </li>
            <li>
              <Shortcut to="/academy/glossario" icon={<BookA className="size-5" />} title="Glossário">
                Os termos e as siglas do site e dos guias do Método.
              </Shortcut>
            </li>
          </ul>
        </section>

        <section aria-labelledby="comece" className="mt-14">
          <h2 id="comece" className="font-display text-heading font-bold">
            Novo em IA? Comece por aqui
          </h2>
          <p className="mt-1 max-w-measure text-small text-muted-foreground text-pretty">
            Os {fundamentals.length} cursos de fundamentals que estão na trilha de todo papel, um de cada plataforma. Marque o que já fez: o
            andamento aparece na trilha do seu papel, guardado só neste navegador.
          </p>
          <ul className="reveal-children mt-5 grid grid-cols-1 gap-3 @2xl:grid-cols-3">
            {fundamentals.map((course) => (
              <li key={course.id}>
                <CourseCard course={course} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="classificacao" className="mt-14">
          <h2 id="classificacao" className="font-display text-heading font-bold">
            Como ler a classificação
          </h2>
          <p className="mt-1 max-w-measure text-small text-muted-foreground text-pretty">
            Cada curso traz a classificação para o seu papel. Os essenciais das três plataformas são o mínimo da sua trilha, e a
            página dela soma o tempo deles.
          </p>
          <PriorityLegend className="mt-4" />
        </section>

        <TrainingSources />
      </div>
    </div>
  );
}
