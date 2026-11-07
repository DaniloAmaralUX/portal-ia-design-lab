import { Check, Circle } from "lucide";
import { FeedbackText } from "@/components/craft/FeedbackText";
import { StateIcon, usePointerFeedback } from "@/components/craft/StateIcon";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Course } from "./courses";
import { useCompletedCourses } from "./use-completed-courses";

export function DoneButton({ course, className }: { course: Course; className?: string }) {
  const { completed, toggle } = useCompletedCourses();
  const done = completed.has(course.id);
  const { instant, record } = usePointerFeedback();
  return (
    <button
      type="button"
      aria-label={`${done ? "Feito" : "Marcar como feito"}: ${course.title}`}
      aria-pressed={done}
      onClick={(event) => { record(event); toggle(course.id); }}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-caption font-medium",
        done ? "border-success/40 bg-success/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
        press,
        className,
      )}
    >
      <StateIcon icon={done ? Check : Circle} instant={instant} className={cn("size-3.5", done && "text-success")} />
      <span aria-hidden className="inline-grid min-w-27 text-left">
        <FeedbackText instant={instant}>{done ? "Feito" : "Marcar como feito"}</FeedbackText>
      </span>
    </button>
  );
}
