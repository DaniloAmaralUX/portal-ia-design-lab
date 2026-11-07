import { cn } from "@/lib/utils";
import { badgeClass, PRIORITY_BADGE_CLASS } from "./badge-class";
import { PRIORITIES, type Priority } from "./training";

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const name = PRIORITIES.find((c) => c.id === priority)?.name;
  return <span className={cn(badgeClass, PRIORITY_BADGE_CLASS[priority], className)}>{name}</span>;
}
