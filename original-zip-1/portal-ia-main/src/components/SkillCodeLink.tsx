import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { codeClass } from "@/components/code-class";
import type { CatalogSkill } from "@/data/types";
import { cn } from "@/lib/utils";

export function SkillCodeLink({ skill, children }: { skill: CatalogSkill; children: ReactNode }) {
  return (
    <Link
      to="/plugins/$plugin/$skill"
      params={{ plugin: skill.plugin, skill: skill.slug }}
      className={cn(codeClass, "text-link underline decoration-link/60 underline-offset-2 hover:decoration-link")}
    >
      {children}
    </Link>
  );
}
