import { getRouteApi, Link } from '@tanstack/react-router';
import { AreaDot } from '@/components/AreaDot';
import { EmptyState } from '@/components/EmptyState';
import { areaById, areas } from '@/data/areas';
import { courses } from '@/data/trainings';
import { cn, plural } from '@/lib/utils';
import { TrainingCourseCard } from './TrainingCourseCard';

const route = getRouteApi('/academy/treinamentos/');

const chip = 'inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-small font-medium transition-colors';
const chipActive = 'border-foreground bg-foreground text-background';
const chipIdle = 'border-border bg-card text-foreground/85 hover:border-foreground/30 hover:text-foreground';

export function TreinamentosPage() {
  const { area } = route.useSearch();
  const list = area ? courses.filter((c) => c.area === area) : courses;
  return (
    <div className="max-w-4xl">
      <header>
        <p className="eyebrow">Academy · treinamentos</p>
        <h1 className="mt-3 font-display text-title font-extrabold text-balance">Treinamentos</h1>
        <p className="mt-4 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty">
          As gravações dos treinamentos da Pitang, um card por curso, com as aulas na ordem em que se assistem. Cada aula
          abre com o vídeo e o texto que explica o que foi mostrado.
        </p>
      </header>

      {courses.length > 0 && (
        <nav aria-label="Filtrar por área" className="mt-8 flex flex-wrap gap-2">
          <Link
            to="/academy/treinamentos"
            search={{}}
            aria-current={area ? undefined : 'page'}
            className={cn(chip, area ? chipIdle : chipActive)}
          >
            Todas as áreas
          </Link>
          {areas.map((a) => (
            <Link
              key={a.id}
              to="/academy/treinamentos"
              search={{ area: a.id }}
              aria-current={area === a.id ? 'page' : undefined}
              className={cn(chip, area === a.id ? chipActive : chipIdle)}
            >
              <AreaDot area={a.id} />
              {a.name}
            </Link>
          ))}
        </nav>
      )}

      {list.length > 0 ? (
        <>
          <p className="mt-6 text-small text-muted-foreground" aria-live="polite">
            {plural(list.length, 'curso', 'cursos')}
            {area ? ` de ${areaById[area].name}` : ''}
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-4 @2xl:grid-cols-2">
            {list.map((course) => (
              <li key={course.slug}>
                <TrainingCourseCard course={course} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-8">
          <EmptyState
            title={area ? `Nenhum curso de ${areaById[area].name} ainda` : 'Nenhum treinamento publicado ainda'}
            description={
              area
                ? 'Os cursos das outras áreas continuam em Todas as áreas.'
                : 'Cada curso aparece aqui quando a gravação e o texto da primeira aula forem publicados.'
            }
          >
            {area && (
              <Link to="/academy/treinamentos" search={{}} className="text-small link">
                Ver todos os treinamentos
              </Link>
            )}
          </EmptyState>
        </div>
      )}
    </div>
  );
}
