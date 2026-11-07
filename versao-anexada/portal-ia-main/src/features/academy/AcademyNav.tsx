import { useId } from 'react';
import { AreaDot } from '@/components/AreaDot';
import { NavGroup } from '@/components/NavGroup';
import { NavLink } from '@/components/NavLink';
import { ReadMark } from '@/components/ReadMark';
import { ROLES } from '@/data/roles';
import { useReadChapters } from '@/hooks/use-read-chapters';

export function AcademyNav({ onNavigate }: { onNavigate?: () => void }) {
  const id = useId();
  const { readIds } = useReadChapters();
  return (
    <nav aria-label="Academy">
      <NavLink to="/academy" activeOptions={{ exact: true }} onClick={onNavigate}>
        Visão geral
      </NavLink>
      <NavLink to="/academy/intervalos" onClick={onNavigate}>
        Intervalos técnicos
      </NavLink>
      <NavLink to="/academy/treinamentos" onClick={onNavigate}>
        Treinamentos
      </NavLink>
      <NavGroup id={`${id}-start`} title="Antes de começar">
        <li>
          <NavLink to="/academy/em-portugues" onClick={onNavigate}>
            <span className="min-w-0 flex-1">Estudar em português</span>
            {readIds.has('em-portugues') && <ReadMark />}
          </NavLink>
        </li>
        <li>
          <NavLink to="/academy/glossario" onClick={onNavigate}>
            Glossário
          </NavLink>
        </li>
      </NavGroup>
      <NavGroup id={`${id}-tracks`} title="Trilhas por papel">
        {ROLES.map((role) => (
          <li key={role.area}>
            <NavLink
              to="/academy/trilhas/$area"
              params={{ area: role.area }}
              onClick={onNavigate}
              className="items-start"
            >
              <AreaDot area={role.area} className="mt-2 size-1.5" />
              <span className="min-w-0 flex-1">{role.name}</span>
            </NavLink>
          </li>
        ))}
      </NavGroup>
    </nav>
  );
}
