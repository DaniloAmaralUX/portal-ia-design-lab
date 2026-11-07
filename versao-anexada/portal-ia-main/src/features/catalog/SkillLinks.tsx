import { Link } from "@tanstack/react-router";
import { AreaDot } from "@/components/AreaDot";
import { getSkill, pluginOf } from "@/data/catalog";

export function SkillLinks({ slugs }: { slugs: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {slugs.map((slug) => {
        const s = getSkill(slug);
        if (!s) return null;
        return (
          <li key={slug}>
            <Link
              to="/plugins/$plugin/$skill"
              params={{ plugin: s.plugin, skill: s.slug }}
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-small transition-colors duration-(--duration-fast) hover:border-foreground/20"
            >
              <AreaDot area={pluginOf(s).area} />
              <span className="font-medium decoration-foreground/30 underline-offset-4 group-hover:underline">{s.title}</span>
              <span className="hidden font-mono text-micro text-muted-foreground sm:inline">{s.slug}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
