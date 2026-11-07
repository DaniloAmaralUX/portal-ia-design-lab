import type { ReactNode } from "react";
import { Acronym } from "@/components/Acronym";
import { TERMS, type TermId } from "@/data/glossary";

export function Term({ id, children }: { id: TermId; children: ReactNode }) {
  return (
    <Acronym tip={TERMS[id].explanation} as="span">
      {children}
    </Acronym>
  );
}
