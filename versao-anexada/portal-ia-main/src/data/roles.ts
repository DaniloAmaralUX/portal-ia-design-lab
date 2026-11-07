import type { AreaId } from './types';

export type Role = {
  area: AreaId;
  name: string;
  description: string;
  audience: string;
  keywords: string;
};

export const ROLES: Role[] = [
  {
    area: 'produto',
    name: 'Analista de requisitos / PO',
    description: 'Requisitos, histórias, critérios de aceite e priorização com IA.',
    audience: 'Para analistas de requisitos e product owners.',
    keywords: 'po product owner analista requisitos produto historias',
  },
  {
    area: 'engenharia',
    name: 'Desenvolvedor de software',
    description: 'Codar, integrar e entregar com agentes. Tech leads também seguem esta trilha.',
    audience:
      'Para desenvolvedores. O tech lead segue esta mesma trilha, com atenção especial aos cursos marcados para tech leads.',
    keywords: 'dev desenvolvedor desenvolvimento programador engenharia tech lead',
  },
  {
    area: 'qualidade',
    name: 'Engenheiro de testes',
    description: 'Automação, avaliação de sistemas com IA e evidências de teste.',
    audience: 'Para engenheiros de testes.',
    keywords: 'qa teste testes tester engenheiro qualidade automacao',
  },
  {
    area: 'meio',
    name: 'Profissional das áreas de meio',
    description: 'Rotinas, relatórios e documentos com o Claude e o Cowork, e as skills que repetem o trabalho.',
    audience: 'Para quem trabalha no Suporte, no Financeiro, no RH e no Administrativo.',
    keywords: 'suporte financeiro rh administrativo meio',
  },
];

export function roleFor(area: string): Role | undefined {
  return ROLES.find((p) => p.area === area);
}
