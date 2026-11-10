import { useEffect, useRef } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AreaMark } from "@/components/AreaMark";
import { Progress } from "@/components/Progress";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { areaById } from "@/data/areas";
import { pluginsOfArea, skillCountIn } from "@/data/catalog-index";
import { ROLES, roleFor } from "@/data/roles";
import type { AreaId } from "@/data/types";
import { trackProgress, useCompletedCourses } from "@/features/academy";
import { guideInProgress, roadmapProgress } from "@/features/method";
import { useMyArea } from "@/hooks/use-my-area";
import { useReadChapters } from "@/hooks/use-read-chapters";
import { plural } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

type Step = {
  eyebrow: string;
  title: string;
  detail: string;
  progress?: { done: number; total: number; noun: string };
  cta: string;
  link: LinkProps;
};

function NextStep({ step }: { step: Step }) {
  const { eyebrow, title, detail, progress, cta, link } = step;
  return (
    <li>
      <Link
        {...link}
        className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs interactive-surface"
      >
        <span className="eyebrow block">{eyebrow}</span>
        <span className="mt-2 font-display text-subheading font-bold text-balance">{title}</span>
        <span className="mt-1 text-caption text-muted-foreground text-pretty">{detail}</span>
        <span className="mt-auto block pt-5">
          {progress && <Progress completed={progress.done} total={progress.total} noun={progress.noun} className="mb-3" insideLink />}
          <span className="flex items-center justify-between gap-2 text-caption font-medium text-foreground/85">
            {cta}
            <ArrowRight aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-interaction) motion-safe:group-hover:translate-x-0.5" />
          </span>
        </span>
      </Link>
    </li>
  );
}

function stepsFor(area: AreaId, completed: ReadonlySet<string>, readIds: ReadonlySet<string>): Step[] {
  const track = trackProgress(area, completed);
  const roadmap = roadmapProgress(area, readIds);
  const reading = guideInProgress(readIds);
  const name = areaById[area].name;
  const skills = skillCountIn(areaById[area]);
  return [
    {
      eyebrow: "Capacitação",
      title: track.next?.title ?? "Trilha concluída",
      detail: track.next ? `${track.next.priority} · ${track.next.platform}` : `Você fez os ${track.total} cursos da trilha.`,
      progress: { done: track.done, total: track.total, noun: "cursos feitos" },
      cta: "Abrir a trilha",
      link: { to: "/academy/trilhas/$area", params: { area } },
    },
    {
      eyebrow: `Roteiro de ${name}`,
      title: roadmap.next?.title ?? "Roteiro lido",
      detail: roadmap.next
        ? [roadmap.next.label, roadmap.next.detail].filter(Boolean).join(" · ")
        : "Você leu todos os guias e capítulos do roteiro.",
      progress: { done: roadmap.done, total: roadmap.total, noun: "leituras feitas" },
      cta: roadmap.next ? "Ler o próximo passo" : "Abrir o roteiro",
      link: roadmap.next?.link ?? { to: "/metodo/roteiros/$area", params: { area } },
    },
    reading?.next
      ? {
          eyebrow: "Continuar a leitura",
          title: reading.next.title,
          detail: reading.next.detail ?? "",
          progress: { done: reading.done, total: reading.total, noun: "capítulos lidos" },
          cta: "Continuar",
          link: reading.next.link,
        }
      : {
          eyebrow: "Catálogo",
          title: `Skills de ${name}`,
          detail: `${plural(skills, "skill", "skills")} em ${plural(pluginsOfArea(area).length, "plugin", "plugins")}.`,
          cta: "Ver as skills",
          link: { to: "/explorar", search: { area } },
        },
  ];
}

// What the person does next, by the role chosen here: the course of the track, the step of the roadmap and the guide left halfway.
// With no role chosen, the section asks for it.
export function ForYouSection() {
  const { area, choose } = useMyArea();
  const { completed } = useCompletedCourses();
  const { readIds } = useReadChapters();
  const section = useRef<HTMLElement>(null);
  const moveFocus = useRef(false);

  // The button pressed leaves the page with the choice, so the focus goes to the section that took its place.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    section.current?.focus();
  }, [area]);

  function pick(next: AreaId | null) {
    moveFocus.current = true;
    choose(next);
  }

  const role = area ? roleFor(area) : undefined;
  const steps = area ? stepsFor(area, completed, readIds) : [];
  const started = steps.some((s) => s.progress && s.progress.done > 0);

  return (
    <section ref={section} tabIndex={-1} aria-labelledby="para-voce-title" className="mt-8 outline-none sm:mt-12 lg:mt-4">
      <Container>
        {role ? (
          <>
            <SectionHeading
              id="para-voce-title"
              title={started ? "Continue de onde parou" : "Por onde começar"}
              description={`Pelo seu papel, ${role.name}. O andamento vem dos cursos que você marcou e do que leu neste navegador.`}
              action={
                <Button variant="ghost" size="sm" onClick={() => pick(null)}>
                  Trocar o papel
                </Button>
              }
            />
            <ul className="reveal-children mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <NextStep key={step.eyebrow} step={step} />
              ))}
            </ul>
          </>
        ) : (
          // The roles take two columns as wide as the longest role on one line, beside the text only where both fit.
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-7 xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:gap-8">
            <div>
              <h2 id="para-voce-title" className="font-display text-heading font-bold">
                Qual é o seu papel?
              </h2>
              <p className="mt-2 max-w-measure text-small leading-relaxed text-muted-foreground text-pretty">
                Com o papel, esta página mostra o próximo curso da sua trilha, o próximo passo do roteiro da sua área e o guia que você
                deixou no meio. A escolha fica guardada só neste navegador.
              </p>
            </div>
            <div className="mt-5 grid gap-2 md:grid-cols-2 xl:mt-0">
              {ROLES.map((r) => (
                <Button
                  key={r.area}
                  variant="outline"
                  size="lg"
                  className="h-auto min-h-12 w-full justify-start whitespace-normal rounded-xl py-2 ps-3 text-left"
                  onClick={() => pick(r.area)}
                >
                  <AreaMark area={r.area} size="sm" />
                  {r.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
