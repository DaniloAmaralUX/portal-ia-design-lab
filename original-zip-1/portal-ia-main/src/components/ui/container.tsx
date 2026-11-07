import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children, ...rest }: ComponentProps<"div"> & { children: ReactNode }) {
  return (
    <div className={cn("portal-container mx-auto w-full max-w-[1240px] px-5 sm:px-6", className)} {...rest}>
      {children}
    </div>
  );
}
