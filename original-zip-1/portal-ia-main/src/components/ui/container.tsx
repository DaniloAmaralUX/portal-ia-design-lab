import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children, ...rest }: ComponentProps<"div"> & { children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)} {...rest}>
      {children}
    </div>
  );
}
