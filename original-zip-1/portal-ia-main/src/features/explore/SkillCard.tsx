import { ResourceCard } from "@/design-system/blocks/ResourceCard";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AreaDot } from "@/components/AreaDot";
import { PluginMark } from "@/components/PluginMark";
import { ModeBadge } from "@/components/ModeBadge";
import { Badge } from "@/design-system/primitives";
import { pluginOf } from "@/data/catalog";
import type { Skill } from "@/data/types";
import { cn } from "@/lib/utils";

export function SkillCard({ skill, className, style }: { skill: Skill; className?: string; style?: React.CSSProperties }) {
  const plugin = pluginOf(skill);
  return (
    <ResourceCard><Link
      to="/plugins/$plugin/$skill"
      params={{ plugin: skill.plugin, skill: skill.slug }}
      data-result
      style={style}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-[box-shadow,border-color] duration-(--duration-fast) ease-out hover:border-foreground/15 hover:shadow-sm",
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <PluginMark plugin={skill.plugin} area={plugin.area} />
        <div className="min-w-0 flex-1">
          <h3 data-vt="title" className="w-fit font-display text-subheading font-semibold text-balance">
            {skill.title}
          </h3>
          <p className="mt-0.5 truncate font-mono text-micro text-muted-foreground">{skill.slug}</p>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100 group-focus-visible:opacity-100" />
      </div>
      <p className="mt-3 line-clamp-2 text-small leading-relaxed text-muted-foreground">{skill.summary}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <span className="inline-flex items-center gap-1.5 text-micro font-medium text-foreground/75">
          <AreaDot area={plugin.area} />
          {plugin.displayName}
        </span>
        <ModeBadge manual={skill.manual} />
        {skill.news && <Badge variant="outline">{skill.news.label}</Badge>}
      </div>
    </Link></ResourceCard>
  );
}
