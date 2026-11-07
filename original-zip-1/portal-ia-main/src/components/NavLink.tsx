import type { ComponentProps } from "react";
import { createLink } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// The item of a section menu. The router marks the link of the page that is open with data-status, and the style follows it.
function NavAnchor({ className, ...props }: ComponentProps<"a"> & { "data-status"?: string }) {
  return (
    <a
      {...props}
      className={cn(
        "relative flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-small transition-colors",
        props["data-status"] === "active"
          ? "bg-accent font-medium text-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-0 before:rounded-full before:border-l-2 before:border-link"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        className,
      )}
    />
  );
}

export const NavLink = createLink(NavAnchor);
