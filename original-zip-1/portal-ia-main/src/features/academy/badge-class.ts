import type { Priority } from "./training";

export const PRIORITY_BADGE_CLASS: Record<Priority, string> = {
  essential: "border-foreground bg-foreground text-background",
  recommended: "border-foreground/60 bg-card text-foreground",
  optional: "border-dashed border-foreground/40 text-muted-foreground",
};

export const badgeClass = "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-micro font-medium";
