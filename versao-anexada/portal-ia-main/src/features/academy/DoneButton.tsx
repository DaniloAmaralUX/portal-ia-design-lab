import { Check, Circle } from "lucide-react";
import { iconHidden, iconShown, iconSwap, press } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Course } from "./courses";
import { useCompletedCourses } from "./use-completed-courses";

export function DoneButton({ course, className }: { course: Course; className?: string }) {
  const { completed, toggle } = useCompletedCourses();
  const done = completed.has(course.id);
  return (
    <button
      type="button"
      aria-label={`${done ? "Feito" : "Marcar como feito"}: ${course.title}`}
      onClick={() => toggle(course.id)}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-caption font-medium",
        done ? "border-success/40 bg-success/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
        press,
        className,
      )}
    >
      <span aria-hidden className="relative inline-grid size-3.5 place-items-center">
        <Circle className={cn("absolute size-3.5", iconSwap, done ? iconHidden : iconShown)} />
        <Check className={cn("absolute size-3.5 text-success", iconSwap, done ? iconShown : iconHidden)} />
      </span>
      <span className="inline-grid">
        <span className={cn("col-start-1 row-start-1", done && "invisible")}>Marcar como feito</span>
        <span className={cn("col-start-1 row-start-1", !done && "invisible")}>Feito</span>
      </span>
    </button>
  );
}
