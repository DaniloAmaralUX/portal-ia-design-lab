// Wigggle UI widget, adapted from @wigggle-ui/widget. See ../wigggle/LICENSE.md.
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const widgetVariants = cva(
  "relative flex flex-col rounded-2xl border border-transparent whitespace-nowrap",
  {
    defaultVariants: {
      design: "default",
      size: "sm",
      variant: "default",
    },
    variants: {
      design: {
        default: "p-6",
        mumbai: "p-4",
      },
      size: {
        lg: "size-96",
        md: "h-48 w-96",
        sm: "size-48",
      },
      variant: {
        default: "bg-background text-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
    },
  }
);

export interface WidgetProps
  extends
    React.ComponentPropsWithRef<"div">,
    VariantProps<typeof widgetVariants> {
  asChild?: boolean;
}

export const Widget = ({
  className,
  size,
  design,
  variant,
  ...props
}: WidgetProps) => (
  <div
    className={cn(widgetVariants({ className, design, size, variant }))}
    {...props}
  />
);

export const WidgetHeader = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    className={cn(
      "flex flex-none items-start justify-between font-semibold",
      className
    )}
    {...props}
  />
);

type WidgetTitleProps = React.ComponentPropsWithRef<"h5"> & {
  children: React.ReactNode;
};

export const WidgetTitle = ({ className, children, ...props }: WidgetTitleProps) => (
  <h5
    className={cn("leading-none font-semibold tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
);

export const WidgetContent = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    className={cn("flex flex-1 items-center justify-center", className)}
    {...props}
  />
);

export const WidgetFooter = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    className={cn("flex flex-none items-center justify-between", className)}
    {...props}
  />
);
