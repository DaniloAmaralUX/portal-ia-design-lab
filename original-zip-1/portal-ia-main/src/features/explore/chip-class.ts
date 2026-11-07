import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const chip = cn(
  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-small font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  press,
);
export const chipIdle = "border-border bg-card text-foreground/80 hover:border-foreground/20 hover:text-foreground";
export const chipActive = "border-foreground bg-foreground text-background";

export const suggestionChip = cn(chip, chipIdle);
