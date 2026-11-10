import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-small font-semibold transition-[color,background-color,border-color,box-shadow,scale] duration-(--duration-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-[color-mix(in_oklch,var(--primary)_88%,black)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary)_85%,var(--foreground))]",
        outline: "border border-border bg-card text-foreground shadow-xs hover:border-foreground/20 hover:bg-accent",
        inverse: "bg-foreground text-background shadow-sm hover:bg-[color-mix(in_oklch,var(--foreground)_85%,var(--background))]",
        ghost: "text-foreground/80 hover:bg-accent hover:text-foreground",
        link: "h-auto rounded-none px-0 text-link underline decoration-link underline-offset-4 hover:decoration-2",
      },
      size: {
        default: "h-10 px-5 has-[>[data-icon=inline-start]]:ps-4.5 has-[>[data-icon=inline-end]]:pe-4.5",
        sm: "h-8 px-3.5 text-caption has-[>[data-icon=inline-start]]:ps-3 has-[>[data-icon=inline-end]]:pe-3",
        lg: "h-12 px-6 text-body has-[>[data-icon=inline-start]]:ps-5.5 has-[>[data-icon=inline-end]]:pe-5.5",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
