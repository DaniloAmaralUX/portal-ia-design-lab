import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Shared interactive surface composed from the portal's existing Card and Widget tokens.
export function ResourceCard({ className, ...props }: ComponentProps<typeof Slot>) {
  return <Slot className={cn("group relative flex h-full min-w-0 flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 hover:border-foreground/25 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", className)} {...props} />;
}
