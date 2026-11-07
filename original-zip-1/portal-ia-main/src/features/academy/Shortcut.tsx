import { ResourceCard } from "@/design-system/blocks/ResourceCard";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useReadChapters } from "@/hooks/use-read-chapters";

export function Shortcut({
  to,
  icon,
  title,
  isRead,
  children,
}: {
  to: "/manifesto" | "/academy/em-portugues" | "/academy/glossario";
  icon: ReactNode;
  title: string;
  isRead?: string;
  children: ReactNode;
}) {
  const { readIds } = useReadChapters();
  return (
    <ResourceCard><Link
      to={to}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-[border-color,box-shadow] duration-(--duration-fast) hover:border-foreground/20 hover:shadow-sm"
    >
      <span aria-hidden className="inline-flex size-10 items-center justify-center rounded-xl bg-muted text-foreground/80">
        {icon}
      </span>
      <span className="mt-4 flex items-center gap-2 text-body font-semibold">
        {title}
        {isRead && readIds.has(isRead) && <span className="text-caption font-normal text-muted-foreground">· lido</span>}
      </span>
      <span className="mt-1.5 text-small leading-relaxed text-muted-foreground text-pretty">{children}</span>
      <span className="mt-auto flex justify-end pt-4">
        <ArrowRight aria-hidden className="size-4 text-muted-foreground transition-transform duration-(--duration-base) group-hover:translate-x-0.5" />
      </span>
    </Link></ResourceCard>
  );
}
