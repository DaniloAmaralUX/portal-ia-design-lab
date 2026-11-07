import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { guideTarget } from "./guide-target";

export function GuideLink({
  slug,
  chapter,
  hash,
  className,
  children,
}: {
  slug: string;
  chapter?: string | null;
  hash?: string | null;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link {...guideTarget({ guide: slug, chapter, anchor: hash })} activeOptions={{ exact: true, includeHash: Boolean(hash) }} className={className}>
      {children}
    </Link>
  );
}
