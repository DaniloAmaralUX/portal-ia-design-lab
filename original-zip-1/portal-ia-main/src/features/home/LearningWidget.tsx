import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PlantProgress } from "@/components/devl/PlantProgress";
import { trackProgress, useCompletedCourses } from "@/features/academy";
import { useMyArea } from "@/hooks/use-my-area";

export function LearningWidget() {
  const { area } = useMyArea();
  const { completed } = useCompletedCourses();
  const progress = area ? trackProgress(area, completed) : null;
  const value = progress?.total ? (progress.done / progress.total) * 100 : 0;
  const target = area ? { to: "/academy/trilhas/$area" as const, params: { area } } : { to: "/academy" as const };
  return (
    <PlantProgress value={value} label="Sua jornada com IA" hue="orange" className="max-w-none bg-card">
      <p className="text-small text-muted-foreground">
        {progress ? `${progress.done} de ${progress.total} cursos concluídos na sua trilha.` : "Escolha seu papel e cultive uma nova habilidade por vez."}
      </p>
      <Link {...target} className="mt-3 inline-flex min-h-9 items-center gap-2 text-small font-semibold text-link">
        {area ? "Continuar aprendendo" : "Explorar a Academy"} <ArrowUpRight aria-hidden className="size-4" />
      </Link>
    </PlantProgress>
  );
}
