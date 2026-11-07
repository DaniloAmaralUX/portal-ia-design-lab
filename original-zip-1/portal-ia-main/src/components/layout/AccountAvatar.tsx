import { cn, initials } from "@/lib/utils";

export function AccountAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("grid size-10 shrink-0 place-items-center rounded-full bg-accent font-display text-small font-bold text-foreground ring-1 ring-border", className)}
    >
      {initials(name)}
    </span>
  );
}
