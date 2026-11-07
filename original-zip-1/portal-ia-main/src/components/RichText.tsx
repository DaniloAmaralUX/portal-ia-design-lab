import { citedSkill } from "@/components/cited-skill";
import { codeClass } from "@/components/code-class";
import { SkillCodeLink } from "@/components/SkillCodeLink";
import { SkillLinkedText } from "@/components/SkillLinkedText";

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (!(part.startsWith("`") && part.endsWith("`"))) return <SkillLinkedText key={i} text={part} />;
        const inside = part.slice(1, -1);
        const skill = citedSkill(inside);
        return skill ? (
          <SkillCodeLink key={i} skill={skill}>
            {inside}
          </SkillCodeLink>
        ) : (
          <code key={i} className={codeClass}>
            {inside}
          </code>
        );
      })}
    </>
  );
}
