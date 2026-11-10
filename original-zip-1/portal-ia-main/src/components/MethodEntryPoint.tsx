import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { readingOrder } from "@/data/guides";
import { EntryPoint } from "./EntryPoint";
import { entryLink, entryLinkSecondary } from "./entry-point-class";

export function MethodEntryPoint() {
  return (
    <EntryPoint
      label="Aplicar"
      title="Método"
      text={`${readingOrder.length} guias: por que adotar o SDD, os requisitos, o ciclo em três ferramentas e um caso real, com um roteiro por área.`}
    >
      <Link to="/metodo" className={entryLink}>
        Abrir o Método
        <ArrowRight aria-hidden className="size-4" />
      </Link>
      <Link to="/metodo/$guide" params={{ guide: "sdd" }} className={entryLinkSecondary}>
        Guia SDD
      </Link>
    </EntryPoint>
  );
}
