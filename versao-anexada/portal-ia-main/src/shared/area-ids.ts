// The ids of the areas, for what the BFF checks. src/data/areas.ts holds the names, and scripts/publish-files.test.ts fails if the two lists differ.
export const AREA_IDS = ["produto", "qualidade", "engenharia", "meio"] as const;

export type AreaId = (typeof AREA_IDS)[number];
