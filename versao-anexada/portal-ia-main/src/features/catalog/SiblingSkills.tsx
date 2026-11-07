import { Link } from "@tanstack/react-router";
import { ModeBadge } from "@/components/ModeBadge";
import { Card } from "@/components/ui/card";
import type { Plugin, Skill } from "@/data/types";

export function SiblingSkills({ plugin, siblings }: { plugin: Plugin; siblings: Skill[] }) {
  if (!siblings.length) return null;
  return (
    <Card className="overflow-hidden">
      <h2 className="px-5 pb-2 pt-5 text-small font-semibold">Mais do plugin</h2>
      <ul className="pb-2">
        {siblings.slice(0, 6).map((s) => (
          <li key={s.slug}>
            <Link
              to="/plugins/$plugin/$skill"
              params={{ plugin: s.plugin, skill: s.slug }}
              className="group flex items-center justify-between gap-3 px-5 py-2 text-small transition-colors duration-(--duration-fast) hover:bg-accent/60 focus-visible:-outline-offset-2"
            >
              <span className="text-pretty decoration-foreground/30 underline-offset-4 group-hover:underline">{s.title}</span>
              {s.manual && <ModeBadge manual compact />}
            </Link>
          </li>
        ))}
      </ul>
      {siblings.length > 6 && (
        <Link
          to="/plugins/$plugin"
          params={{ plugin: plugin.name }}
          activeOptions={{ exact: true }}
          className="block border-t border-border px-5 py-3 text-caption link focus-visible:-outline-offset-2"
        >
          Ver as {siblings.length + 1} skills do plugin
        </Link>
      )}
    </Card>
  );
}
