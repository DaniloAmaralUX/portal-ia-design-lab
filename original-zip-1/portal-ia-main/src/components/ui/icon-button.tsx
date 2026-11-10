import type { ComponentProps, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type IconButtonProps = Omit<ComponentProps<"button">, "aria-label" | "children"> & {
  label: string;
  children: ReactNode;
  asChild?: boolean;
  size?: "sm" | "default" | "lg";
  tone?: "default" | "terminal";
  shape?: "circle" | "rounded";
};

const sizes = { sm: "size-8", default: "size-9", lg: "size-10" };

export function IconButton({
  label,
  children,
  asChild = false,
  size = "default",
  tone = "default",
  shape = "circle",
  title = label,
  type = "button",
  className,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...props}
      type={asChild ? undefined : type}
      aria-label={label}
      title={title}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
        sizes[size],
        shape === "circle" ? "rounded-full" : "rounded-lg",
        tone === "terminal"
          ? "text-terminal-muted hover:bg-white/10 hover:text-terminal-foreground focus-visible:outline-terminal-gold"
          : "text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-ring",
        press,
        className,
      )}
    >
      {children}
    </Comp>
  );
}
