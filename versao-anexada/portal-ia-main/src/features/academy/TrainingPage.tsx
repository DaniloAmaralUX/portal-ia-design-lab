import { getRouteApi, Link } from "@tanstack/react-router";
import { NextLink } from "@/components/NextLink";
import { OutlineDetails } from "@/components/OutlineDetails";
import { OutlineRail } from "@/components/OutlineRail";
import { Toc } from "@/components/Toc";
import { tocIds } from "@/components/toc-groups";
import { ROLES } from "@/data/roles";
import { roadmapFor } from "@/data/roadmaps";
import { useActiveSection } from "@/hooks/use-active-section";
import { useUi } from "@/store/ui";
import { LanguageNotice } from "./LanguageNotice";
import { PlatformTrackSection } from "./PlatformTrackSection";
import { TimeSection } from "./TimeSection";
import { trackOutline } from "./track-outline";
import { TrackHeader } from "./TrackHeader";
import { trainingFor } from "./training";
import { TrainingSources } from "./TrainingSources";

const route = getRouteApi("/academy/trilhas/$area");

export function TrainingPage() {
  const { role } = route.useLoaderData();
  const platforms = trainingFor(role.area)?.tracks ?? [];
  const track = roadmapFor(role.area);
  const others = ROLES.filter((p) => p.area !== role.area);
  const outline = trackOutline(platforms);
  useActiveSection(tocIds(outline));
  const active = useUi((s) => s.activeSection);
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-x-12">
      <div className="min-w-0 max-w-3xl">
        <TrackHeader role={role} />
        <LanguageNotice className="mt-6" />
        <OutlineDetails label="Nesta página" className="mt-8 xl:hidden">
          <Toc groups={outline} active={active} />
        </OutlineDetails>

        <TimeSection platforms={platforms} />

        {platforms.map((t) => (
          <PlatformTrackSection key={t.platform} track={t} />
        ))}

        <section aria-labelledby="depois-dos-cursos" className="mt-24">
          <h2 id="depois-dos-cursos" className="font-display text-heading font-bold">
            Depois dos cursos
          </h2>
          {track && (
            <NextLink to="/metodo/roteiros/$area" params={{ area: track.area }} kicker="No Método, os guias e as skills da sua área, na ordem" label={track.title} />
          )}
          <p className="mt-6 text-small text-muted-foreground">
            Outras trilhas:{" "}
            {others.map((p, i) => (
              <span key={p.area}>
                {i > 0 && " · "}
                <Link to="/academy/trilhas/$area" params={{ area: p.area }} className="link">
                  {p.name}
                </Link>
              </span>
            ))}
          </p>
        </section>

        <TrainingSources />
      </div>
      <OutlineRail label="Nesta página" className="hidden xl:block" follow={active ?? ""}>
        <Toc groups={outline} active={active} />
      </OutlineRail>
    </div>
  );
}
