import type { Area, AreaId } from './types';

export const areas: Area[] = [
  {
    id: 'produto',
    name: 'Produto',
    audience: 'PO, PM e analistas de negócio',
    pitch: 'Transforme reunião e e-mail em histórias de usuário e em especificações prontas para o portão.',
  },
  {
    id: 'qualidade',
    name: 'Qualidade',
    audience: 'QA e automação de testes',
    pitch: 'Escreva os cenários Gherkin e leve a automação dos testes até a suíte estável.',
  },
  {
    id: 'engenharia',
    name: 'Engenharia',
    audience: 'Devs, tech leads e arquitetos',
    pitch: 'Revise PR em seis ângulos, documente o sistema a partir do código e traga o board do Azure DevOps.',
  },
  {
    id: 'meio',
    name: 'Meio',
    audience: 'Suporte, Financeiro, RH e Administrativo',
    pitch: 'Use o Claude e o Cowork para automatizar rotinas, montar relatórios e criar skills para o dia a dia.',
  },
];

export const areaById = Object.fromEntries(areas.map((a) => [a.id, a])) as Record<AreaId, Area>;

export const suggestions = [
  { label: 'Revisar um PR', q: 'revisar PR' },
  { label: 'Escrever histórias de usuário', q: 'história de usuário' },
  { label: 'Automatizar testes', q: 'testes automatizados' },
  { label: 'Documentar a API', q: 'documentar API' },
  { label: 'Importar PBIs', q: 'PBI' },
  { label: 'Criar uma apresentação', q: 'apresentação' },
];
