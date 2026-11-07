import { useId } from "react";
import { useParams } from "@tanstack/react-router";
import { AreaDot } from "@/components/AreaDot";
import { NavGroup } from "@/components/NavGroup";
import { NavLink } from "@/components/NavLink";
import { ReadMark } from "@/components/ReadMark";
import { areaById } from "@/data/areas";
import { METHOD_GROUPS, guidesIn } from "@/data/guides";
import { ROADMAPS } from "@/data/roadmaps";
import { useReadChapters } from "@/hooks/use-read-chapters";
import { GuideOutline } from "./GuideOutline";

function GuideGroup({ group, id, onNavigate }: { group: (typeof METHOD_GROUPS)[number]; id: string; onNavigate?: () => void }) {
  const { readIds } = useReadChapters();
  const { guide: open } = useParams({ strict: false });
  return (
    <NavGroup id={`${id}-${group.id}`} title={group.name}>
      {guidesIn(group.id).map((guide) => (
        <li key={guide.slug} className={guide.tool ? "ml-3" : undefined}>
          <NavLink
            to="/metodo/$guide"
            params={{ guide: guide.slug }}
            activeOptions={{ exact: true }}
            // On a chapter the guide is the section the page is in: it keeps the mark and says so with aria-current="true", since "page" is the chapter's, in the outline.
            {...(open === guide.slug ? { "data-status": "active", "aria-current": "true" as const } : {})}
            onClick={onNavigate}
          >
            <span className="min-w-0 flex-1">{guide.label}</span>
            {!guide.chapters && readIds.has(guide.slug) && <ReadMark />}
          </NavLink>
          {/* Under 1280px the column on the right is gone: the outline of the open guide sits here, under it, beside the text. */}
          {open === guide.slug && (
            <div className="mb-3 ml-2.5 mt-2 xl:hidden">
              <GuideOutline onNavigate={onNavigate} />
            </div>
          )}
        </li>
      ))}
    </NavGroup>
  );
}

// The menu lists the guides. The chapters and the sections of the open guide are in its outline: on the right of the text from 1280px,
// and under the guide in the menu below that.
export function MethodNav({ onNavigate }: { onNavigate?: () => void }) {
  const id = useId();
  return (
    <nav aria-label="Método">
      <NavLink to="/metodo" activeOptions={{ exact: true }} onClick={onNavigate}>
        Visão geral
      </NavLink>
      <NavGroup id={`${id}-roadmaps`} title="Roteiros por área">
        {ROADMAPS.map((roadmap) => (
          <li key={roadmap.area}>
            <NavLink
              to="/metodo/roteiros/$area"
              params={{ area: roadmap.area }}
              onClick={onNavigate}
            >
              <AreaDot area={roadmap.area} className="size-1.5" />
              {areaById[roadmap.area].name}
            </NavLink>
          </li>
        ))}
      </NavGroup>
      {METHOD_GROUPS.map((group) => (
        <GuideGroup key={group.id} group={group} id={id} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}
