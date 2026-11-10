import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { SkillDoc } from "./SkillDoc";
import { Term } from "@/components/Term";
import { Card } from "@/components/ui/card";
import { focusRegion } from "@/hooks/use-route-focus";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { SkillDocText } from "./skill-loader";
import { SkillSection } from "./SkillSection";

export function SkillMd({ doc }: { doc: SkillDocText }) {
  const [expanded, setExpanded] = useState(false);
  return (
      <SkillSection id="skill-md" title={<Term id="skill-md">SKILL.md</Term>}>
        <p className="-mt-1 mb-4 text-small text-muted-foreground">
          As instruções que o Claude segue. É aqui que a skill guarda o jeito do time de fazer a tarefa.
        </p>
        <CodeBlock code={`---\n${doc.frontmatter}\n---`} language="frontmatter" className="mb-4" wrap />
        <Card className="relative overflow-hidden">
          <div
            id="skill-md-conteudo"
            onFocus={(e) => {
              if (expanded) return;
              const target = e.target;
              setExpanded(true);
              requestAnimationFrame(() => target.scrollIntoView({ block: "nearest" }));
            }}
            className={cn("px-5 py-6 outline-none sm:px-8 sm:py-8", !expanded && "max-h-[560px] overflow-hidden")}
          >
            <SkillDoc source={doc.body} />
          </div>
          {!expanded && (
            <div className="absolute inset-x-0 bottom-0 flex h-40 items-end justify-center bg-gradient-to-t from-card via-card/90 to-transparent pb-5">
              <button
                type="button"
                onClick={() => {
                  setExpanded(true);
                  requestAnimationFrame(() => focusRegion("skill-md-conteudo", { preventScroll: true }));
                }}
                aria-controls="skill-md-conteudo"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-small font-semibold shadow-md hover:border-foreground/25",
                  press,
                )}
              >
                Mostrar o SKILL.md inteiro
                <ChevronDown className="size-4" />
              </button>
            </div>
          )}
        </Card>
      </SkillSection>
  );
}
