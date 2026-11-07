import { useId } from "react";
import { useParams } from "@tanstack/react-router";
import { NavGroup } from "@/components/NavGroup";
import { NavLink } from "@/components/NavLink";
import { toolGuides } from "@/data/guides";
import { GuideOutline } from "@/features/method";

// The menu of Ferramentas lists the tools. The chapters and the sections of the open one are in its outline: on the right of the text
// from 1280px, and under the tool in the menu below that, as in the menu of the Method.
export function ToolsNav({ onNavigate }: { onNavigate?: () => void }) {
  const id = useId();
  const { guide: open } = useParams({ strict: false });
  return (
    <nav aria-label="Ferramentas">
      <NavLink to="/ferramentas" activeOptions={{ exact: true }} onClick={onNavigate}>
        Visão geral
      </NavLink>
      <NavGroup id={`${id}-tools`} title="As ferramentas">
        {toolGuides.map((guide) => (
          <li key={guide.slug}>
            <NavLink
              to="/ferramentas/$guide"
              params={{ guide: guide.slug }}
              activeOptions={{ exact: true }}
              // On a chapter the tool is the section the page is in: it keeps the mark and says so with aria-current="true", since "page" is the chapter's, in the outline.
              {...(open === guide.slug ? { "data-status": "active", "aria-current": "true" as const } : {})}
              onClick={onNavigate}
            >
              <span className="min-w-0 flex-1">{guide.label}</span>
            </NavLink>
            {open === guide.slug && (
              <div className="mb-3 ml-2.5 mt-2 xl:hidden">
                <GuideOutline onNavigate={onNavigate} />
              </div>
            )}
          </li>
        ))}
      </NavGroup>
    </nav>
  );
}
