import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const PLUS =
  "M94.8 46.6 94.8 41.3C94.8 37.4 97.9 34.3 101.8 34.3L107.1 34.3C111 34.3 114.1 31.2 114.1 27.3L114.1 27.3C114.1 23.4 111 20.3 107.1 20.3L101.8 20.3C97.9 20.3 94.8 17.2 94.8 13.3L94.8 8C94.8 4.1 91.7 1 87.8 1L87.8 1C83.9 1 80.8 4.1 80.8 8L80.8 13.3C80.8 17.2 77.7 20.3 73.8 20.3L68.5 20.3C64.6 20.3 61.5 23.4 61.5 27.3L61.5 27.3C61.5 31.2 64.6 34.3 68.5 34.3L73.8 34.3C77.7 34.3 80.8 37.4 80.8 41.3L80.8 46.6C80.8 50.5 83.9 53.6 87.8 53.6L87.8 53.6C91.6 53.6 94.8 50.4 94.8 46.6Z";

export function BrandPlus({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="60.5 0 54.6 54.6" aria-hidden className={cn("text-brand-red", className)} {...props}>
      <path d={PLUS} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

