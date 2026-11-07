import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { InlineCode } from "@/components/InlineCode";
import { ModeBadge } from "@/components/ModeBadge";
import { skillsOf } from "@/data/catalog";
import type { Plugin } from "@/data/types";
import { plural } from "@/lib/utils";

export function PluginRow({ plugin }: { plugin: Plugin }) {
  const list = skillsOf(plugin.name);
  return (
    <li className="grid gap-x-12 gap-y-5 py-7 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="group relative">
        <h3 data-vt="title" className="w-fit font-display text-subheading font-bold">
          <Link
            to="/plugins/$plugin"
            params={{ plugin: plugin.name }}
            className="decoration-foreground/30 underline-offset-4 after:absolute after:inset-0 group-hover:underline"
          >
            {plugin.displayName}
          </Link>
        </h3>
        <p className="mt-2 text-small leading-relaxed text-muted-foreground text-pretty">
          <InlineCode text={plugin.tagline} />
        </p>
        <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-caption font-semibold text-foreground">
          {plural(list.length, "skill", "skills")}
          <span className="font-normal text-muted-foreground">· versão {plugin.version}</span>
          <ArrowRight
            aria-hidden
            className="ml-1 size-3.5 transition-transform duration-(--duration-base) group-hover:translate-x-0.5"
          />
        </p>
      </div>
      <ul aria-label={`Skills de ${plugin.displayName}`} className="grid content-start gap-x-6 gap-y-0.5 sm:grid-cols-2">
        {list.map((skill) => (
          <li key={skill.slug}>
            <Link
              to="/plugins/$plugin/$skill"
              params={{ plugin: plugin.name, skill: skill.slug }}
              className="-mx-2.5 flex min-h-9 flex-wrap items-center gap-x-2 gap-y-1 rounded-lg px-2.5 py-1.5 text-small text-foreground/85 transition-colors duration-(--duration-fast) hover:bg-accent hover:text-foreground"
            >
              <span data-vt="title" className="text-pretty underline decoration-foreground/30 underline-offset-2">
                {skill.title}
              </span>
              {skill.manual && <ModeBadge manual />}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
