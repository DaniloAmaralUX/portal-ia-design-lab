import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Beautiful UI Context Cards surface: https://www.beautifului.dev/#context-cards
export function ContextCard({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("overflow-hidden rounded-2xl border border-transparent bg-card", className)} {...props} />;
}
