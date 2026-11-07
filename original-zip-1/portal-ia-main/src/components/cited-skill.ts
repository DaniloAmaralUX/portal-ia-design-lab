import { findSkill } from "@/data/catalog-index";
import type { CatalogSkill } from "@/data/types";
import { exactSkillName } from "@/lib/skill-name";

export function citedSkill(text: string): CatalogSkill | undefined {
  const name = exactSkillName(text);
  return name ? findSkill(name) : undefined;
}
