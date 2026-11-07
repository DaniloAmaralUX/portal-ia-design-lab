import { Link } from "@tanstack/react-router";
import { AreaDot } from "@/components/AreaDot";
import { Card } from "@/components/ui/card";
import { areaOf, pluginOf } from "@/data/catalog";
import { MODES, modeOf } from "@/data/modes";
import type { Skill } from "@/data/types";
import { formatDate } from "@/lib/utils";
import { EffectsSummary } from "./EffectsSummary";
import { Facts } from "./Facts";
import { trustFacts } from "./trust-facts";

export function SkillSheet({ skill }: { skill: Skill }) {
  const plugin = pluginOf(skill);
  const area = areaOf(plugin);
  const trust = trustFacts({ lifecycle: plugin.lifecycle, listChars: skill.listChars });
  // The same 20px inset as "Mais do plugin" (SiblingSkills), the card under it, so the two text edges line up.
  return (
      <Card className="p-5">
        <h2 className="mb-4 text-small font-semibold lg:mb-3">Ficha técnica</h2>
        <Facts
          items={[
            {
              label: "Plugin",
              value: (
                <Link to="/plugins/$plugin" params={{ plugin: plugin.name }} activeOptions={{ exact: true }} className="link-text">
                  {plugin.displayName}
                </Link>
              ),
            },
            {
              label: "Área",
              value: (
                <span className="inline-flex items-center gap-1.5">
                  <AreaDot area={area.id} />
                  {area.name}
                </span>
              ),
            },
            { label: "Modo", value: MODES[modeOf(skill)].label },
            { label: "Versão", value: <span className="font-mono">{plugin.version}</span> },
            { label: "Atualizada em", value: formatDate(skill.updatedAt) },
            { label: "Mantida por", value: plugin.owner },
            trust.state,
            trust.listSpace,
            {
              label: "No projeto",
              value: (
                <a href="#efeitos" className="block rounded-md hover:opacity-80">
                  <EffectsSummary kinds={skill.effects} className="justify-end" />
                  <span className="sr-only"> (ver o que ela faz no seu projeto)</span>
                </a>
              ),
            },
            { label: "Arquivos", value: skill.files.length },
          ]}
        />
      </Card>
  );
}
