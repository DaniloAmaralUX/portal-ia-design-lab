import { useEffect, useRef } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { FluidGroup } from "@/components/fluid/FluidGroup";
import { useCraft } from "@/components/craft/craft-context";
import { usePointerFeedback } from "@/components/craft/StateIcon";
import { ArrowRight } from "lucide-react";
import { AreaMark } from "@/components/AreaMark";
import { Progress } from "@/design-system/primitives";
import { Widget } from "@/components/ui/widget";
import { Button } from "@/design-system/primitives";
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
      <Widget className="h-full w-full whitespace-normal rounded-xl border bg-card p-0 shadow-xs">
      <Link
        {...link}
        className="group flex h-full flex-col rounded-xl p-5 transition-colors hover:bg-accent/40"
      >
        <span className="eyebrow block">{eyebrow}</span>
        <span className="mt-2 font-display text-subheading font-bold text-balance">{title}</span>
        <span className="mt-1 text-caption text-muted-foreground text-pretty">{detail}</span>
        <span className="mt-auto block pt-5">
          {progress && <Progress completed={progress.done} total={progress.total} noun={progress.noun} className="mb-3" insideLink />}
          <span className="flex items-center justify-between gap-2 text-caption font-medium text-foreground/85">
            {cta}
            <ArrowRight aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-base) group-hover:translate-x-0.5" />
          </span>
        </span>
      </Link>
      </Widget>
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
  const { instant, record } = usePointerFeedback();
  const reduce = useReducedMotion();
  const { duration, distance } = useCraft();

  // The button pressed leaves the page with the choice, so the focus goes to the section that took its place.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    section.current?.focus({ preventScroll: true });
  }, [area]);

  function pick(next: AreaId | null) {
    moveFocus.current = true;
    choose(next);
  }

  const role = area ? roleFor(area) : undefined;
  const steps = area ? stepsFor(area, completed, readIds) : [];
  const started = steps.some((s) => s.progress && s.progress.done > 0);

  return (
    <section ref={section} tabIndex={-1} aria-labelledby="para-voce-title" className="mt-2 outline-none sm:mt-4">
      <Container>
        <motion.div key={area ?? "choose"} initial={instant || reduce ? false : { opacity: 0, y: distance }} animate={{ opacity: 1, y: 0 }} transition={{ duration: duration / 1000, ease: [0.23, 1, 0.32, 1] }}>
        {role ? (
          <>
            <SectionHeading
              id="para-voce-title"
              title={started ? "Continue de onde parou" : "Por onde começar"}
              description={`Pelo seu papel, ${role.name}. O andamento vem dos cursos que você marcou e do que leu neste navegador.`}
              action={
                <Button variant="ghost" size="sm" onClick={(event) => { record(event); pick(null); }}>
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
          <Widget className="h-auto w-full whitespace-normal rounded-2xl bg-card p-6">
            <div>
              <h2 id="para-voce-title" className="font-display text-heading font-bold">
                Qual é o seu papel?
              </h2>
              <p className="mt-2 max-w-measure text-small leading-relaxed text-muted-foreground text-pretty">
                Selecione seu papel para ver a trilha de capacitação e o próximo passo do Método. Seu progresso fica salvo neste navegador.
              </p>
            </div>
            <FluidGroup className="mt-5 grid gap-1 rounded-xl md:grid-cols-2" label="Seu papel">
              {ROLES.map((r) => (
                <Button
                  key={r.area}
                  variant="choice"
                  size="lg"
                  data-fluid-item
                  className="h-auto min-h-12 w-full justify-start whitespace-normal rounded-lg py-2 ps-3 text-left"
                  onClick={(event) => { record(event); pick(r.area); }}
                >
                  <AreaMark area={r.area} size="sm" />
                  {r.name}
                </Button>
              ))}
            </FluidGroup>
          </Widget>
        )}
        </motion.div>
      </Container>
    </section>
  );
}
