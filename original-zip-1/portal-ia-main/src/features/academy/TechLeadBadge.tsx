import { cn } from "@/lib/utils";
import { badgeClass } from "./badge-class";

export function TechLeadBadge() {
  return <span className={cn(badgeClass, "border-border bg-muted text-foreground/85")}>Tech lead</span>;
}
