import type { ReactNode } from "react";
import { Term } from "@/components/Term";
import { LIFECYCLES } from "@/data/lifecycle";
import type { LifecycleId } from "@/data/types";
import { formatInteger } from "@/lib/utils";

type FactItem = { label: ReactNode; value: ReactNode };

// What the sheet of a plugin and of a skill tell, from what the skills repository declares, so a person can decide to install without asking: who keeps it and in which state, how recent and what it runs.
export function trustFacts({
  lifecycle,
  listChars,
}: {
  lifecycle: LifecycleId;
  listChars: number | null;
}): { state: FactItem; listSpace: FactItem } {
  const { label, means } = LIFECYCLES[lifecycle];
  return {
    state: {
      label: "Estado",
      value: (
        <span className="block">
          {label}
          <span className="block font-normal text-muted-foreground">{means}</span>
        </span>
      ),
    },
    listSpace: {
      label: <Term id="custo-de-contexto">Na lista de skills</Term>,
      value:
        listChars === null ? (
          <span className="block">
            Não ocupa a lista
            <span className="block font-normal text-muted-foreground">só roda quando alguém chama pela barra</span>
          </span>
        ) : (
          <span className="block">
            {formatInteger(listChars)} caracteres
            <span className="block font-normal text-muted-foreground">nome e description, em toda sessão</span>
          </span>
        ),
    },
  };
}
