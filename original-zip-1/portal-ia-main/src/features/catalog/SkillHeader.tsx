import { Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { AreaDot } from "@/components/AreaDot";
import { CopyButton } from "@/design-system/primitives";
import { Crumb } from "@/components/Crumb";
import { MetaSep } from "./MetaSep";
import { Term } from "@/components/Term";
import { Badge } from "@/design-system/primitives";
import { Button } from "@/design-system/primitives";
import { areaOf, pluginOf } from "@/data/catalog";
import { MODES, modeOf } from "@/data/modes";
import type { Skill } from "@/data/types";
import { CopyCommandButton } from "@/features/install";
import { invokeFromPlugin } from "@/lib/commands";
import { CatalogHeader } from "./CatalogHeader";

export function SkillHeader({ skill }: { skill: Skill }) {
  const plugin = pluginOf(skill);
  const area = areaOf(plugin);
  const invoke = invokeFromPlugin(skill);
  return (
    <CatalogHeader
      crumbs={[
        <Crumb key="c" to="/explorar">
          Catálogo
        </Crumb>,
        <Crumb key="p" to="/plugins">
          Plugins
        </Crumb>,
        <Crumb key="pl" to="/plugins/$plugin" params={{ plugin: plugin.name }}>
          {plugin.displayName}
        </Crumb>,
        <span key="s" className="text-foreground">
          {skill.title}
        </span>,
      ]}
      title={skill.title}
      meta={
        <>
          <Link
            to="/plugins/$plugin"
            params={{ plugin: plugin.name }}
            activeOptions={{ exact: true }}
            className="inline-flex items-center gap-1.5 font-medium text-foreground decoration-foreground/30 underline-offset-4 hover:underline"
          >
            <AreaDot area={area.id} />
            {plugin.displayName}
          </Link>
          <MetaSep />
          <Term id={MODES[modeOf(skill)].term}>{MODES[modeOf(skill)].label}</Term>
          <MetaSep />
          <span>versão {plugin.version}</span>
          <MetaSep />
          <span className="inline-flex items-center gap-0.5">
            <code className="font-mono text-caption">{skill.slug}</code>
            <CopyButton text={skill.slug} label="Copiar o nome da skill" message="Nome copiado" className="size-7" />
          </span>
          {skill.news && <Badge variant="outline">{skill.news.label} na v{skill.news.version}</Badge>}
        </>
      }
      by={{ creator: skill.creator, contributors: skill.contributors }}
      summary={skill.summary}
      actions={
        <>
          <Button asChild size="lg">
            <a href="#instalar">
              Instalar
              <ArrowDown data-icon="inline-end" />
            </a>
          </Button>
          <CopyCommandButton
            command={invoke}
            size="lg"
            variant="outline"
            message="Comando copiado"
            title={invoke}
            aria-label={`Copiar o comando ${invoke}`}
            className="h-auto min-h-12 max-w-full whitespace-normal py-2.5 text-left font-mono text-caption font-medium"
          >
            {/* On a phone the command wraps only after the plugin, each part on a line of its own: a part breaks inside only when it
                alone is longer than the button. */}
            <span className="min-w-0">
              <span className="inline-block max-w-full [overflow-wrap:anywhere]">{invoke.slice(0, invoke.indexOf(":") + 1)}</span>
              <wbr />
              <span className="inline-block max-w-full [overflow-wrap:anywhere]">{invoke.slice(invoke.indexOf(":") + 1)}</span>
            </span>
          </CopyCommandButton>
        </>
      }
    />
  );
}
