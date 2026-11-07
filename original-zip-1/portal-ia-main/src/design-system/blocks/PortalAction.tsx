import type { ReactNode } from "react";
import { Button } from "../primitives";
export function PortalAction({ href, children, secondary = false, className = "" }: { href: string; children: ReactNode; secondary?: boolean; className?: string }) {
  return <Button asChild variant={secondary ? "outline" : "default"} className={className}><a href={href}>{children}</a></Button>;
}
