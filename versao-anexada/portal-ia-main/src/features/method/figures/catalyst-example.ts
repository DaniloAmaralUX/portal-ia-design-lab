export type Level = 0 | 1 | 2 | 3;

export type Requirement = { code: string; name: string; minimum: Level; before: Level; after: Level };

// The example project of the presentation of the catalyst (apresentacao/catalyst.html, in pitang-dev-cli): the minimum of each
// requirement and the level the doctor gave it before and after the init prepared the R1 and the R7, the two critical requirements
// the init prepares. The radar draws it.
export const REQUIREMENTS: Requirement[] = [
  { code: "R1", name: "Contexto técnico legível", minimum: 2, before: 1, after: 2 },
  { code: "R2", name: "Base de conhecimento do produto", minimum: 1, before: 1, after: 1 },
  { code: "R3", name: "Arquitetura com fronteiras explícitas", minimum: 1, before: 2, after: 2 },
  { code: "R4", name: "Rede de testes", minimum: 2, before: 1, after: 1 },
  { code: "R5", name: "Observabilidade que aponta causa", minimum: 2, before: 1, after: 1 },
  { code: "R6", name: "Pipeline e reversibilidade", minimum: 2, before: 1, after: 1 },
  { code: "R7", name: "Segurança, dados e escopo do agente", minimum: 2, before: 1, after: 2 },
];

export type Round = "before" | "after";
