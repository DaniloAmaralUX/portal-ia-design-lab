import { Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { AreaDot } from "@/components/AreaDot";
import { Crumb } from "@/components/Crumb";
import { MetaSep } from "./MetaSep";
import { Term } from "@/components/Term";
import { Button } from "@/design-system/primitives";
import { areaOf, skillsOf } from "@/data/catalog";
import { MARKETPLACE_NAME } from "@/data/catalog-index";
import type { Plugin } from "@/data/types";
import { DownloadButton, pluginZip } from "@/features/install";
import { CatalogHeader } from "./CatalogHeader";

export function PluginHeader({ plugin }: { plugin: Plugin }) {
  const list = skillsOf(plugin.name);
  const area = areaOf(plugin);
  return (
    <CatalogHeader
      crumbs={[
        <Crumb key="c" to="/explorar">
          Catálogo
        </Crumb>,
        <Crumb key="p" to="/plugins">
          Plugins
        </Crumb>,
        <span key="c" className="text-foreground">
          {plugin.displayName}
        </span>,
      ]}
      title={plugin.displayName}
      meta={
        <>
          <Link
            to="/explorar"
            search={{ area: area.id }}
            className="inline-flex items-center gap-1.5 font-medium text-foreground decoration-foreground/30 underline-offset-4 hover:underline"
          >
            <AreaDot area={area.id} />
            {area.name}
          </Link>
          <MetaSep />
          <span>
            {list.length} <Term id="skill">{list.length === 1 ? "skill" : "skills"}</Term>
          </span>
          <MetaSep />
          <span>versão {plugin.version}</span>
          <MetaSep />
          <code className="font-mono text-caption">
            {plugin.name}@{MARKETPLACE_NAME}
          </code>
        </>
      }
      summary={plugin.intro}
      actions={
        <>
          <Button asChild size="lg">
            <a href="#instalar">
              Instalar
              <ArrowDown data-icon="inline-end" />
            </a>
          </Button>
          <DownloadButton download={pluginZip(plugin)} size="lg" />
        </>
      }
    />
  );
}
