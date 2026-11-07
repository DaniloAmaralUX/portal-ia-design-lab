import { Link } from "@tanstack/react-router";
import { InlineCode } from "@/components/InlineCode";
import { ModeBadge } from "@/components/ModeBadge";
import { getSkill } from "@/data/catalog";
import type { FlowTrack, Plugin } from "@/data/types";
import { invokeFromPlugin } from "@/lib/commands";

export function PluginSkills({ plugin }: { plugin: Plugin }) {
  return (
    <div className="space-y-12">
      {plugin.tracks.map((track) => (
        <Track key={track.title} track={track} />
      ))}
    </div>
  );
}

function Track({ track }: { track: FlowTrack }) {
  const sequence = track.steps.length > 1;
  return (
    <div>
      <h3 className="font-display text-subheading font-semibold">{track.title}</h3>
      {track.note && <p className="mt-1 max-w-measure text-small text-muted-foreground text-pretty">{track.note}</p>}
      {sequence ? (
        <ol className="mt-5">
          {track.steps.map((group, i) => {
            const last = i === track.steps.length - 1;
            return (
              <li key={group.join("+")} className="relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4 pb-5 last:pb-0">
                {!last && <span aria-hidden className="absolute bottom-0 left-3.5 top-9 w-px -translate-x-1/2 bg-border" />}
                <span className="tabular mt-1.5 inline-flex size-7 items-center justify-center rounded-full border border-border bg-card font-mono text-micro font-semibold">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  {group.length > 1 && (
                    <p className="mt-2.5 px-3 text-caption text-muted-foreground">Estas {group.length}, na ordem que quiser:</p>
                  )}
                  <ul>
                    {group.map((slug) => (
                      <SkillItem key={slug} slug={slug} optional={track.optional?.includes(slug) ?? false} />
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <ul className="-ml-3 mt-4 grid gap-x-6 sm:grid-cols-2">
          {(track.steps[0] ?? []).map((slug) => (
            <SkillItem key={slug} slug={slug} optional={track.optional?.includes(slug) ?? false} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SkillItem({ slug, optional }: { slug: string; optional: boolean }) {
  const skill = getSkill(slug);
  if (!skill) return null;
  return (
    <li>
      <Link
        to="/plugins/$plugin/$skill"
        params={{ plugin: skill.plugin, skill: skill.slug }}
        className="group block rounded-xl px-3 py-2.5 transition-colors duration-(--duration-fast) hover:bg-accent/60"
      >
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span data-vt="title" className="font-medium leading-snug decoration-foreground/30 underline-offset-4 group-hover:underline">
            {skill.title}
          </span>
          {optional && (
            <span className="rounded-full border border-dashed border-border px-2 py-px text-micro text-muted-foreground">
              Opcional
            </span>
          )}
          {skill.manual && <ModeBadge manual />}
        </span>
        <span className="mt-1 block text-small leading-relaxed text-foreground/85 text-pretty">
          <InlineCode text={skill.summary} />
        </span>
        <span className="mt-1.5 block font-mono text-micro text-muted-foreground">{invokeFromPlugin(skill)}</span>
      </Link>
    </li>
  );
}
