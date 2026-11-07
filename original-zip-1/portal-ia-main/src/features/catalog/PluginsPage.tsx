import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { AreaDot } from "@/components/AreaDot";
import { CatalogTabs } from "@/components/CatalogTabs";
import { Term } from "@/components/Term";
import { Container } from "@/components/ui/container";
import { areas } from "@/data/areas";
import { plugins } from "@/data/catalog";
import { ProjectKit } from "@/features/install";
import { PluginRow } from "./PluginRow";

const route = getRouteApi("/plugins/");

export function PluginsPage() {
  const { kit } = route.useSearch();
  const navigate = useNavigate({ from: "/plugins/" });
  const selected = kit ? kit.split(",") : [];
  return (
    <Container className="pb-8 pt-10 sm:pt-14">
      <CatalogTabs current="plugins" />
      <h1 className="mt-8 font-display text-title font-extrabold">Todos os plugins</h1>
      <p className="mt-4 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty">
        Cada <Term id="plugin">plugin</Term> junta as <Term id="skill">skills</Term> de um mesmo problema. Quem
        instala o plugin leva todas elas, e cada skill também pode ser instalada sozinha. Para o time de um projeto,{" "}
        <a href="#kit" className="link">
          monte o kit
        </a>
        .
      </p>
      <div className="mt-12 space-y-14">
        {areas.map((area) => {
          const list = plugins.filter((p) => p.area === area.id);
          if (!list.length) return null;
          return (
            <section key={area.id} aria-labelledby={`area-${area.id}`}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-3">
                <AreaDot area={area.id} className="size-2.5 translate-y-[-1px] self-center" />
                <h2 id={`area-${area.id}`} className="font-display text-heading font-bold">
                  {area.name}
                </h2>
                <span className="text-small text-muted-foreground">{area.audience}</span>
              </div>
              <ul className="reveal-children divide-y divide-border">
                {list.map((plugin) => (
                  <PluginRow key={plugin.name} plugin={plugin} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <div className="mt-16">
        <ProjectKit
          selected={selected}
          onChange={(list) => void navigate({ search: list.length ? { kit: list.join(",") } : {}, replace: true, resetScroll: false })}
        />
      </div>
    </Container>
  );
}
