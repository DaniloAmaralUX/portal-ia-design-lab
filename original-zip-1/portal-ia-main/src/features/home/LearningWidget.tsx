import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/Progress";
import { trackProgress, useCompletedCourses } from "@/features/academy";
import { useMyArea } from "@/hooks/use-my-area";

export function LearningWidget() {
  const { area } = useMyArea();
  const { completed } = useCompletedCourses();
  const progress = area ? trackProgress(area, completed) : null;
  const target = area ? { to: "/academy/trilhas/$area" as const, params: { area } } : { to: "/academy" as const };
  return <aside className="cd-learning" aria-label="Seu aprendizado"><p className="cd-kicker">Seu aprendizado</p><h2>{progress ? "Continue de onde parou" : "Um passo de cada vez"}</h2><p>{progress ? `${progress.done} de ${progress.total} cursos concluídos na sua trilha.` : "Escolha seu papel para encontrar os cursos e guias que fazem sentido para o seu trabalho."}</p>{progress && <Progress completed={progress.done} total={progress.total} noun="cursos concluídos" />}<Link {...target}>{area ? "Continuar aprendendo" : "Explorar a Academy"}<ArrowUpRight aria-hidden size={15} /></Link></aside>;
}
