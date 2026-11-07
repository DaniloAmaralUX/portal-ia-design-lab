import { getRouteApi, Link } from "@tanstack/react-router";
import { AreaTitle } from "@/components/AreaTitle";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Crumb } from "@/components/Crumb";
import { NextLink } from "@/components/NextLink";
import { areaById } from "@/data/areas";
import { ROADMAPS } from "@/data/roadmaps";
import { roleFor } from "@/data/roles";
import { useReadChapters } from "@/hooks/use-read-chapters";
import { RoadmapItem } from "./RoadmapItem";

const route = getRouteApi("/metodo/roteiros/$area");

function audience(text: string): string {
  return /^\p{Lu}\p{Ll}/u.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

export function RoadmapPage() {
  const { roadmap } = route.useLoaderData();
  const { readIds } = useReadChapters();
  const area = areaById[roadmap.area];
  const others = ROADMAPS.filter((t) => t.area !== roadmap.area);
  const role = roleFor(roadmap.area);
  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[
          <Crumb key="m" to="/metodo">
            Método
          </Crumb>,
          <span key="r">Roteiros por área</span>,
        ]}
      />
      <AreaTitle area={roadmap.area}>{roadmap.title}</AreaTitle>
      <p className="mt-3 text-lead leading-relaxed text-muted-foreground text-pretty">{roadmap.summary}</p>
      <p className="mt-2 text-caption text-muted-foreground">Para {audience(area.audience)}.</p>

      <ol aria-label={roadmap.title} className="mt-10 border-y border-border">
        {roadmap.steps.map((step, i) => (
          <li key={i} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 border-b border-border last:border-b-0">
            <span className="tabular mt-5 inline-flex size-8 items-center justify-center rounded-full bg-foreground font-display text-small font-bold text-background">
              {i + 1}
            </span>
            <RoadmapItem step={step} readIds={readIds} />
          </li>
        ))}
      </ol>

      {role && (
        <NextLink
          to="/academy/trilhas/$area"
          params={{ area: role.area }}
          kicker="Na Academy, os cursos de IA do seu papel"
          label={`Trilha de capacitação: ${role.name}`}
          className="mt-10"
        />
      )}

      <p className="mt-10 text-small text-muted-foreground">
        Outros roteiros:{" "}
        {others.map((t, i) => (
          <span key={t.area}>
            {i > 0 && " · "}
            <Link to="/metodo/roteiros/$area" params={{ area: t.area }} className="link">
              {areaById[t.area].name}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}
