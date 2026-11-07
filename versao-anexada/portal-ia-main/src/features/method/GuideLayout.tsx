import { Outlet, useMatch } from "@tanstack/react-router";
import { OutlineRail } from "@/components/OutlineRail";
import { useActiveSection } from "@/hooks/use-active-section";
import { useUi } from "@/store/ui";
import { GuideOutline } from "./GuideOutline";
import { useGuideOutline } from "./use-guide-outline";

// The frame of every page of a guide: the text, and its outline in the column on the right of the wide screens. It stays mounted
// from chapter to chapter, so the column keeps its scroll and only the marks move.
export function GuideLayout() {
  const { chapters, current, items, ids } = useGuideOutline();
  useActiveSection(ids);
  const active = useUi((s) => s.activeSection);
  // The page of a tool lists its chapters as cards, so the column on the right would list them a second time.
  const productPage = Boolean(useMatch({ from: "/ferramentas/$guide/", shouldThrow: false }));
  if ((!chapters && !items.length) || productPage) return <Outlet />;
  return (
    // From xl the column on the right takes 13rem and its gap out of the text, which fell from 768px to 624px and cut the code. The
    // grid reaches into the empty margin on the right instead, up to 2rem from the edge of the screen (the 1200px of Container), so
    // the text gets 664px at 1280px and 744px at 1440px, and the left edge stays under the logo.
    <div className="xl:-mr-[min(16rem,calc((100vw-1200px)/2))] xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-x-12">
      <div className="min-w-0">
        <Outlet />
      </div>
      <OutlineRail label={chapters ? "Neste guia" : "Nesta página"} className="hidden xl:block" follow={`${current ?? ""}#${active ?? ""}`}>
        <GuideOutline />
      </OutlineRail>
    </div>
  );
}
