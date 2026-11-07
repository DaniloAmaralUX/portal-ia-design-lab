import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { AreaDot } from "@/components/AreaDot";
import { areaIdOf, catalogSkills } from "@/data/catalog-index";
import { mentions } from "./mentions";

export function ExcerptSkills({ guide, chapter }: { guide: string; chapter?: string }) {
  const count = (slug: string) =>
    (mentions[slug] ?? [])
      .filter((m) => m.guide === guide && (chapter === undefined || m.chapter === chapter))
      .reduce((total, m) => total + m.count, 0);
  const list = catalogSkills
    .map((skill) => ({ skill, count: count(skill.slug) }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
  if (!list.length) return null;
  return (
    <aside aria-labelledby="skills-do-trecho" className="mt-14 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 id="skills-do-trecho" className="flex items-center gap-2 text-small font-semibold">
        <Sparkles aria-hidden strokeWidth={1.5} className="size-4 text-muted-foreground" />
        {chapter ? "Skills deste capítulo" : "Skills deste guia"}
      </h2>
      <p className="mt-1 text-caption text-muted-foreground">As que o texto cita, para instalar e usar no projeto.</p>
      <ul className="mt-3 divide-y divide-border border-t border-border">
        {list.map(({ skill }) => (
          <li key={skill.slug}>
            <Link
              to="/plugins/$plugin/$skill"
              params={{ plugin: skill.plugin, skill: skill.slug }}
              className="group flex items-center justify-between gap-4 py-2.5"
            >
              <span className="min-w-0">
                <span className="block text-small font-medium decoration-foreground/30 underline-offset-4 group-hover:underline">
                  {skill.title}
                </span>
                <span className="flex items-center gap-1.5 text-caption text-muted-foreground">
                  <AreaDot area={areaIdOf(skill.plugin)} />
                  <span className="font-mono">{skill.slug}</span>
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-base) group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
