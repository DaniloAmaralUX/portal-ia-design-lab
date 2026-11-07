import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { findSkill } from "@/data/catalog-index";
import { splitAtSkillNames } from "@/lib/skill-name";

export function SkillLinkedText({ text }: { text: string }) {
  const parts = splitAtSkillNames(text);
  return (
    <>
      {parts.map((part, i) => {
        const skill = part.startsWith("pg-") ? findSkill(part) : undefined;
        if (!skill) return <Fragment key={i}>{part}</Fragment>;
        return (
          <Link
            key={i}
            to="/plugins/$plugin/$skill"
            params={{ plugin: skill.plugin, skill: skill.slug }}
            className="font-mono text-[0.9em] link-text [overflow-wrap:anywhere]"
          >
            {part}
          </Link>
        );
      })}
    </>
  );
}
