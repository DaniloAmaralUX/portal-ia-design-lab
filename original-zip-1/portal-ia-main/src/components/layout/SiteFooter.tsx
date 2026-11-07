import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AreaDot } from "@/components/AreaDot";
import { PitangLogo } from "@/components/layout/PitangLogo";
import { REPO_WEB_URL } from "@/data/catalog-index";
import { Container } from "@/components/ui/container";
import { areaById } from "@/data/areas";
import { toolGuides } from "@/data/guides";
import { ROADMAPS } from "@/data/roadmaps";
import { SITE_DESCRIPTION } from "@/shared/brand";

const linkClass = "text-small text-muted-foreground transition-colors hover:text-foreground";
const exact = { exact: true };
const title = "mb-4 text-small font-semibold text-foreground";

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-border bg-card/50">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 min-[70rem]:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 min-[70rem]:col-span-1">
          <PitangLogo className="h-7 w-auto" />
          <p className="mt-4 max-w-xs text-small leading-relaxed text-muted-foreground">{SITE_DESCRIPTION}</p>
          <p className="mt-3 text-caption text-muted-foreground">Site na versão {__SITE_VERSION__}</p>
        </div>
        <div>
          <p className={title}>Academy</p>
          <ul className="space-y-2.5">
            <li>
              <Link to="/academy" activeOptions={exact} className={linkClass}>
                Trilhas de capacitação
              </Link>
            </li>
            <li>
              <Link to="/manifesto" activeOptions={exact} className={linkClass}>
                Manifesto
              </Link>
            </li>
            <li>
              <Link to="/academy/em-portugues" activeOptions={exact} className={linkClass}>
                Estudar em português
              </Link>
            </li>
            <li>
              <Link to="/academy/glossario" activeOptions={exact} className={linkClass}>
                Glossário
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className={title}>Método</p>
          <ul className="space-y-2.5">
            <li>
              <Link to="/metodo" activeOptions={exact} className={linkClass}>
                Os guias, em ordem
              </Link>
            </li>
            {ROADMAPS.map((roadmap) => (
              <li key={roadmap.area}>
                <Link to="/metodo/roteiros/$area" params={{ area: roadmap.area }} activeOptions={exact} className={`${linkClass} inline-flex items-center gap-2`}>
                  <AreaDot area={roadmap.area} />
                  Roteiro de {areaById[roadmap.area].name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={title}>Ferramentas</p>
          <ul className="space-y-2.5">
            <li>
              <Link to="/ferramentas" activeOptions={exact} className={linkClass}>
                Todas as ferramentas
              </Link>
            </li>
            {toolGuides.map((guide) => (
              <li key={guide.slug}>
                <Link to="/ferramentas/$guide" params={{ guide: guide.slug }} activeOptions={exact} className={linkClass}>
                  {guide.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={title}>Catálogo</p>
          <ul className="space-y-2.5">
            <li>
              <Link to="/explorar" activeOptions={exact} className={linkClass}>
                Skills
              </Link>
            </li>
            <li>
              <Link to="/plugins" activeOptions={exact} className={linkClass}>
                Plugins
              </Link>
            </li>
            <li>
              <Link to="/primeiros-passos" activeOptions={exact} className={linkClass}>
                Primeiros passos
              </Link>
            </li>
            <li>
              <Link to="/novidades" activeOptions={exact} className={linkClass}>
                Novidades
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className={title}>Contribuir</p>
          <ul className="space-y-2.5">
            <li>
              <Link to="/contribuir" activeOptions={exact} className={linkClass}>
                Como contribuir
              </Link>
            </li>
            <li>
              <Link to="/contribuir" hash="pedir" activeOptions={{ exact: true, includeHash: true }} className={linkClass}>
                Pedir uma skill
              </Link>
            </li>
            <li>
              <a href={REPO_WEB_URL} target="_blank" rel="noreferrer" className={`${linkClass} inline-flex items-center gap-1`}>
                Repositório no GitLab
                <ArrowUpRight strokeWidth={1.5} className="size-3.5" />
                <span className="sr-only">(abre em outra aba)</span>
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-col gap-1 py-5 text-caption text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Pitang Agile IT</span>
          <span>Feito para o Claude Code</span>
        </Container>
      </div>
    </footer>
  );
}
