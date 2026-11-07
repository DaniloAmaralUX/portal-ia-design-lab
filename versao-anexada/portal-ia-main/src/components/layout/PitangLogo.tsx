import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { PITANG_WORDMARK_PATH as WORDMARK, PITANG_SYMBOL_PATH as SYMBOL } from "@/shared/pitang-logo";

export function PitangLogo({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="-5 0 326 91" role="img" aria-label="Pitang" className={cn("text-brand-red", className)} {...props}>
      <path d={SYMBOL} fill="currentColor" />
      <path d={WORDMARK} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}
